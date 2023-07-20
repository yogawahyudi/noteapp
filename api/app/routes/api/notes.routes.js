const express = require("express");
var app = express();
const notesController = require("../../controller/api/notes.controller");
const subTask = require("../../controller/api/sub-task.controller");
const router = express.Router();

router.get("/", notesController.getNotes);
router.post("/", notesController.insertNotes);
router.get("/:id", notesController.viewTask);
router.put("/:id", notesController.updateNotes);
router.delete("/:id", notesController.deleteTask);
router.put("/:id/progress", notesController.updateProgress);
router.get("/:taskId/sub", subTask.findTask, subTask.getSubTask);
router.post("/:taskId/sub", subTask.findTask, subTask.insertSubTask);
router.put("/:taskId/sub/:id", subTask.findTask, subTask.updateSubTask);
router.delete("/:taskId/sub/:id", subTask.findTask, subTask.deleteSubTask);
router.put(
  "/:taskId/sub/:subTaskId/progress",
  subTask.findTask,
  subTask.updateSubTaskProgress
);

module.exports = router;
