const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listSchema = new Schema({
  userId: { type: String, required: true },
  listId: { type: String, required: true },
  title: { type: String },
});

const List = mongoose.model("List", listSchema);

module.exports = List;
