const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuid = require("uuid");

const AdminSchema = Schema({
  userId: String,
  panelUserName: String,
  panelPassword: String,
  tasksCompleted: [
    {
      taskId: {
        type: String,
        default: uuid(),
      },
      taskName: String,
      taskDate: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  loginDates: [Date],
});

module.exports = mongoose.model("Admin", AdminSchema);
