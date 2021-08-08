const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LinkSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String },
});
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  links: { type: [LinkSchema], default: [] },
  // image: { type: String, default: 'img/hacker-background.jpg' },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  create_at: { type: Date, required: true },
  modified_at: { type: Date, required: true },
  star: { type: Boolean, default: false },
});

module.exports = mongoose.model("Project", ProjectSchema);
