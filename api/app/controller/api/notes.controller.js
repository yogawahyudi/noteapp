const luxon = require("luxon");
const knex = require("../../config/db.config");

const getNotes = async (req, res) => {
  try {
    let task = await knex("task").whereNull("deleted_at");
    res.status(200).json({ data: task });
  } catch (e) {
    console.log(e);
  }
};

const viewTask = async (req, res) => {
  const id = req.params.id;
  try {
    await knex("task")
      .where("id", id)
      .whereNull("deleted_at")
      .first()
      .then((resTask) => {
        if (!resTask) {
          res.status(404).json({ message: "Can't find task" });
          return;
        }
        res.status(200).json({ data: resTask });
      });
  } catch (e) {
    console.log(e);
  }
};

const insertNotes = async (req, res) => {
  try {
    const { task, eta } = req.body;
    await knex("task").insert({
      task: task,
      eta: eta,
    });
    res.json({ message: "Success create task" });
  } catch (e) {
    res.json({ message: e }, 500);
  }
};

const updateNotes = async (req, res) => {
  try {
    const { task, eta } = req.body;
    const id = req.params.id;
    const findTask = knex("task").where("id", id);
    await findTask.first().then(async (restask) => {
      if (!restask) {
        res.status(404).json({ message: "Can't find task" });
        return;
      }
      await findTask.update({
        task: task,
        eta: eta,
        updated_at: luxon.DateTime.now().toSQLDate(),
      });
      res.status(200).json({ message: "Successfully update task" });
    });
  } catch (e) {
    res.json({ message: e }, 500);
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const findTask = knex("task").where("id", id);
    await findTask.first().then(async (restask) => {
      if (!restask) {
        res.status(404).json({ message: "Can't find task" });
        return;
      }
      await findTask.update({
        deleted_at: luxon.DateTime.now().toSQLDate(),
      });
      res.status(200).json({ message: "Successfully delete task" });
    });
  } catch (e) {
    res.json({ message: e }, 500);
  }
};

const updateProgress = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const findTask = knex("task").where("id", id);
    await findTask.first().then(async (restask) => {
      if (!restask) {
        res.status(404).json({ message: "Can't find task" });
        return;
      }
      await findTask.update({
        status: status,
        updated_at: luxon.DateTime.now().toSQLDate(),
      });
      res.status(200).json({ message: "Successfully update task" });
    });
  } catch (e) {
    res.json({ message: e }, 500);
  }
};

module.exports = {
  getNotes,
  insertNotes,
  updateNotes,
  deleteTask,
  viewTask,
  updateProgress,
};
