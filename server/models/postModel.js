const { Schema, model } = require("mongoose"); // schema defines what fields data will have, model turns schema into usable data
const { image } = require("../utils/cloudinary");

const postSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true } // auto adds createdAt & updatedAt to every post document
);

module.exports = model("Post", postSchema);
