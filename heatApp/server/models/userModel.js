const { Schema, model } = require("mongoose"); // schema defines what fields data will have, model turns schema into usable data

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/du5wj47wr/image/upload/v1756765934/default_user_xzwnoa.png",
    },
    bio: { type: String, default: "No bio yet" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // array of followers
    following: [{ type: Schema.Types.ObjectId, ref: "User" }], // array of following
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }], // array of bookmarked
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // array of posts

    // OAuth specific fields
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true } // auto adds createdAt & updatedAt to every user document
);

module.exports = model("User", userSchema);
