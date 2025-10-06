const db = require("../config/knex");

const TestImage = {
  async create(testId, filePath) {
    return db("test_images").insert({
      test_id: testId,
      file_path: filePath,
    });
  },

  async findLatestByTest(testId) {
    return db("test_images")
      .where({ test_id: testId })
      .orderBy("created_at", "desc")
      .first();
  },
};

module.exports = TestImage;
