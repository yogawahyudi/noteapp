const express = require("express");
const subTask = require("../../controller/api/sub-task.controller");
const router = express.Router();

router.get("/", subTask.getSubTask);
router.post("/", subTask.insertSubTask);
// router.put("/:id", notesController.updateNotes);
// router.delete("/:id", notesController.deleteTask);
module.exports = router;
