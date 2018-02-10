var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Notes"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;