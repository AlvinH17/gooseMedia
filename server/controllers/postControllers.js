const HttpError = require("../models/errorModel");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");

const uuid = require("uuid").v4; // to generate random chars
const cloudinary = require("../utils/cloudinary");
const fs = require("fs"); // file system, to handle file operations
const path = require("path"); // to handle and transform file paths

let MAX_POST_LENGTH = 280; // chars
let MAX_IMAGE_SIZE = 1000000; // bits

// ========== CREATE POST ==========
// POST : api/posts
// PROTECTED
const createPost = async (req, res, next) => {
  try {
    // res.json(req.files);
    const { body } = req.body;
    if (!body) {
      return next(new HttpError("Fill in post body", 422));
    } else if (body.length > MAX_POST_LENGTH) {
      return next(
        new HttpError(
          `Post body cannot exceed ${MAX_POST_LENGTH} characters`,
          422
        )
      );
    }

    if (!req.files.image) {
      return next(new HttpError("Please upload an image", 422));
    } else {
      const { image } = req.files;
      if (image.size > MAX_IMAGE_SIZE) {
        let kb = MAX_IMAGE_SIZE / 1000;
        return next(new HttpError(`Image size must be less than ${kb}KB`, 422));
      }
      // rename the image
      let fileName = image.name;
      fileName = fileName.split(".");
      fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1]; // to make filename unique
      await image.mv(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
          // store image on cloudinary
          const result = await cloudinary.uploader.upload(
            path.join(__dirname, "..", "uploads", fileName),
            {
              resource_type: "image",
            }
          );
          if (!result.secure_url) {
            return next(new HttpError("Image upload failed, try again", 422));
          }
          // save post to db
          const newPost = await PostModel.create({
            creator: req.user.id,
            body, // ES6 shorthand property syntax
            image: result?.secure_url,
          });
          // await UserModel.findByIdAndUpdate(newPost?.creator, {
          //   $push: { posts: newPost._id },
          // });
          await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { posts: newPost._id },
          });
          res.json(newPost).status(201);
        }
      );
    }
    // res.json("Create Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET POST ==========
// GET : api/posts/:id
// PROTECTED
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id)
      .populate("creator")
      .populate({ path: "comments", options: { sort: { createdAt: -1 } } });
    res.json(post);
    // res.json("Get Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET POSTS ==========
// GET : api/posts
// PROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
    // res.json("Get All Posts");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== UPDATE POST ==========
// PATCH : api/posts/:id
// PROTECTED
const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { body } = req.body;
    // get post from db
    const post = await PostModel.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    // check if logged in user is the post creator
    if (post?.creator != req.user.id) {
      return next(
        new HttpError("You are not authorized to edit this post", 403)
      );
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { body },
      { new: true }
    );
    res.json(updatedPost).status(200);
    // res.json("Update Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== DELETE POST ==========
// DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    // get post from db
    const post = await PostModel.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    // check if logged in user is the post creator
    if (post?.creator != req.user.id) {
      return next(
        new HttpError("You are not authorized to edit this post", 403)
      );
    }
    // const deletedPost = await PostModel.findByIdAndDelete(postId);
    // res.json(deletedPost).status(200);

    // Extract public_id from Cloudinary URL for deletion
    let publicId = null;
    if (post.image) {
      // Extract public_id from URL like: https://res.cloudinary.com/.../image/upload/v123456/public_id.jpg
      const urlParts = post.image.split("/");
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      publicId = fileNameWithExtension.split(".")[0]; // Remove file extension
    }
    // Delete from Cloudinary
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with post deletion even if Cloudinary deletion fails
      }
    }
    // Delete post from database
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    // Remove post ID from user's posts array
    await UserModel.findByIdAndUpdate(req.user.id, {
      $pull: { posts: postId },
    });
    res.status(200).json({
      message: "Post deleted successfully",
      deletedPost,
    });

    // res.json("Delete Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET FOLLOWING POSTS ==========
// GET : api/posts/following
// PROTECTED
const getFollowingPosts = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const posts = await PostModel.find({
      creator: { $in: user?.following },
    }).sort({ createdAt: -1 });
    res.json(posts).status(200);
    // res.json("Get Following Posts");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== LIKE/DISLIKE POST ==========
// GET : api/posts/:id/like
// PROTECTED
const likeDislikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    // if user has already liked post
    let updatedPost;
    if (post.likes.includes(req.user.id)) {
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user.id } }, // unlike
        { new: true }
      );
    } else {
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $push: { likes: req.user.id } }, // like
        { new: true }
      );
    }
    res.json(updatedPost).status(200);
    // res.json("Like/Dislike Posts");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET USER POSTS ==========
// GET : api/users/:id/posts
// PROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await UserModel.findById(userId).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    });
    res.json(posts).status(200);
    // res.json("Get User Posts");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== CREATE BOOKMARK ==========
// POST : api/posts/:id/bookmark
// PROTECTED
const createBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    const user = await UserModel.findById(req.user.id);
    // if (user.bookmarks.includes(id)) {
    // if user has already bookmarked post
    let updatedBookmarks;
    if (user.bookmarks.includes(id)) {
      updatedBookmarks = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $pull: { bookmarks: id } }, // unbookmark
        { new: true }
      );
    } else {
      updatedBookmarks = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $push: { bookmarks: id } }, // bookmark
        { new: true }
      );
    }
    res.json(updatedBookmarks).status(200);
    // res.json("Create Bookmark");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET BOOKMARKS ==========
// GET : api/bookmarks
// PROTECTED
const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await UserModel.findById(userId).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } },
    });
    res.json(bookmarks).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
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
};
