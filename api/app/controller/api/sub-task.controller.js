const luxon = require("luxon");
const knex = require("../../config/db.config");

const findTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  try {
    await knex("task")
      .where("id", taskId)
      .whereNull("deleted_at")
      .first()
      .then((resTask) => {
        if (!resTask) {
          res.status(404).json({ message: "Can't find task" });
          return;
        }
        next();
      });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const getSubTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    await knex("sub_task")
      .where("task_id", taskId)
      .whereNull("deleted_at")
      .then((result) => {
        res.status(200).json({ data: result });
      });
  } catch (e) {
    console.log(e);
  }
};

const insertSubTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { task, eta } = req.body;
    await knex("sub_task").insert({
      task_id: taskId,
      task: task,
      eta: eta,
    });
    res.json({ message: "Success create sub task" });
  } catch (e) {
    // res.status(500).json({ message: e });
    console.log(e);
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { task, eta } = req.body;
    const id = req.params.id;
    const findSubTask = knex("sub_task").where("id", id);
    await findSubTask.first().then(async (restask) => {
      if (!restask) {
        res.status(404).json({ message: "Can't find sub task" });
        return;
      }
      await findSubTask.update({
        task: task,
        eta: eta,
        updated_at: luxon.DateTime.now().toSQLDate(),
      });
      res.status(200).json({ message: "Successfully update sub task" });
    });
  } catch (e) {
    res.json({ message: e }, 500);
  }
};

const deleteSubTask = async (req, res) => {
  try {
    const id = req.params.id;
    const findSubTask = knex("sub_task").where("id", id);
    await findSubTask.first().then(async (restask) => {
      if (!restask) {
        res.status(404).json({ message: "Can't find sub task" });
        return;
      }
      await findSubTask.update({
        deleted_at: luxon.DateTime.now().toSQLDate(),
      });
      res.status(200).json({ message: "Successfully delete sub task" });
    });
  } catch (e) {
    res.json({ message: e }, 500);
  }
};

const updateSubTaskProgress = async (req, res) => {
  await knex.transaction(async (trx) => {
    try {
      const { status } = req.body;
      const taskId = req.params.taskId;
      const subTaskId = req.params.subTaskId;
      const findTask = knex("sub_task")
        .where("id", subTaskId)
        .where("task_id", taskId);
      await findTask
        .first()
        .transacting(trx)
        .then(async (restask) => {
          if (!restask) {
            res.status(404).json({ message: "Can't find sub_task" });
            return;
          }
          await findTask
            .update({
              status: status,
              updated_at: luxon.DateTime.now().toSQLDate(),
            })
            .transacting(trx);

          await knex("task")
            .where("id", taskId)
            .first()
            .transacting(trx)
            .then(async (task) => {
              if (task.status == "unprogress") {
                await knex("task")
                  .where("id", taskId)
                  .update({
                    status: "progress",
                    updated_at: luxon.DateTime.now().toSQLDate(),
                  })
                  .transacting(trx);
              }
            });
          res.status(200).json({ message: "Successfully update sub_task" });
        });
    } catch (e) {
      trx.rollback();
      res.json({ message: e }, 500);
    }
  });
};

module.exports = {
  getSubTask,
  insertSubTask,
  findTask,
  updateSubTask,
  deleteSubTask,
  updateSubTaskProgress,
};
