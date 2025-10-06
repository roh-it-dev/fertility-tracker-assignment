const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // memory storage
const auth = require("../middlewares/auth");

const controller = require("../controllers/testController");

router.post("/start",auth ,controller.startTest);
router.post("/:id/upload", auth, upload.single("image"), controller.uploadImage);
router.get("/:id/result", auth,controller.getResult);
router.get("/",auth,controller.getHistory);
router.get("/relevant",auth,controller.getRelevantResults);

module.exports = router;
