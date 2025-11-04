const { Schema, model } = require("mongoose"); // schema defines what fields data will have, model turns schema into usable data

const commentSchema = new Schema(
  {
    creator: {
      type: {
        creatorId: { type: Schema.Types.ObjectId, ref: "User" },
        creatorName: { type: String, required: true },
        creatorPhoto: { type: String, required: true },
      },
    },
    comment: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true } // automatically creates createdAt and updatedAt fields
);

module.exports = model("Comment", commentSchema);
