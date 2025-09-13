const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changeUserAvatar,
  getUser,
  getUsers,
  followUnfollowUser,
  editUser,
  findUser,
  handleGoogleAuth, // Add this new controller
} = require("../controllers/userControllers");

const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  getUserBookmarks,
  createBookmark,
  likeDislikePost,
  getFollowingPosts,
} = require("../controllers/postControllers");

const {
  createComment,
  getPostComments,
  deleteComment,
} = require("../controllers/commentControllers");

// const {
//   createMessage,
//   getMessages,
//   getConversations,
// } = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

// USER ROUTES
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users", handleGoogleAuth); // Add this line for Google OAuth
router.post("/users/avatar", authMiddleware, changeUserAvatar);

router.get("/users/bookmarks", authMiddleware, getUserBookmarks); // brought up to avoid conflict with getUser

router.get("/users/:id", authMiddleware, getUser);
router.get("/users", authMiddleware, getUsers);
router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.patch("/users/:id", authMiddleware, editUser);

router.get("/users/:id/posts", authMiddleware, getUserPosts);
router.get("/users/:fullName/find", authMiddleware, findUser);

// POST ROUTES
router.post("/posts", authMiddleware, createPost);
router.get("/posts/following", authMiddleware, getFollowingPosts); // brought up to avoid conflict with getPost
router.get("/posts/:id", authMiddleware, getPost);
router.get("/posts", authMiddleware, getPosts);
router.patch("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.get("/posts/:id/like", authMiddleware, likeDislikePost);
router.get("/posts/:id/bookmark", authMiddleware, createBookmark);

// COMMENT ROUTES
router.post("/comments/:postId", authMiddleware, createComment);
router.get("/comments/:postId", authMiddleware, getPostComments);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

// // MESSAGE ROUTES
// router.post("/messages/:receiverId", authMiddleware, createMessage);
// router.get("/messages/:receiverId", authMiddleware, getMessages);
// router.get("/conversations", authMiddleware, getConversations);

module.exports = router;
