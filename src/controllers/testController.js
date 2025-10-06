const path = require("path");
const fs = require("fs");
const Test = require("../models/test");
const TestImage = require("../models/testImage");
const { generateMockResult } = require("../utils/resultMock");
const{ mockRandomRelevantTest } = require("../utils/releventTestMock");


const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

function scheduleProcessing(testId, delayMs = 185 * 1000) {
  setTimeout(async () => {
    try {
      const mock = generateMockResult();
      await Test.updateStatus(testId, "completed", {
        result: mock.result,
        e3g: mock.metrics.E3G,
        pdg: mock.metrics.PDG,
        fsh: mock.metrics.FSH,
        test_completed_at: new Date(),
      });
      console.log(`Processed test ${testId}: ${mock.result}`);
    } catch (err) {
      console.error("Processing failed", err);
      await Test.updateStatus(testId, "in_review");
    }
  }, delayMs);
}

exports.startTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const test = await Test.create(userId);
    res.json({ testId: test.id, status: test.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start test" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const userId = req.user.id;
    const testId = Number(req.params.id);

    const test = await Test.findById(testId);
    if (!test || test.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const fileName = `test_${testId}_${Date.now()}.jpg`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, req.file.buffer);

    await TestImage.create(testId, fileName);
    await Test.updateStatus(testId, "processing");

    scheduleProcessing(testId);

    res.json({ message: "Image uploaded", file: fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

exports.getResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const testId = Number(req.params.id);

    const test = await Test.findById(testId);
    if (!test || test.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (["pending", "processing"].includes(test.status)) {
      return res.json({ status: test.status, message: "Result not ready yet" });
    }

    const today = new Date().toISOString().split('T')[0];
    await mockRandomRelevantTest(userId, today);

    const image = await TestImage.findLatestByTest(test.id);
    res.json({ ...test, image_url: image ? `/uploads/${image.file_path}` : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch result" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = await Test.findByUser(userId);

    const withImages = await Promise.all(
      rows.map(async (t) => {
        const img = await TestImage.findLatestByTest(t.id);
        return { ...t, image_url: img ? `/uploads/${img.file_path}` : null };
      })
    );

    res.json(withImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

exports.getRelevantResults = async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await Test.findRelevantByUser(userId);
    console.log(results);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch relevant results" });
  }
};
