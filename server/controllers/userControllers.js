// REST API - allows frontend and backend to comm over the web, using HTTP requests

const HttpError = require("../models/errorModel");
const UserModel = require("../models/userModel");
require("dotenv").config({ path: "../.env" });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4; // to generate random chars
const fs = require("fs"); // file system, to handle file operations
const path = require("path"); // to handle and transform file paths
const cloudinary = require("../utils/cloudinary");

let MIN_PASSWORD_LENGTH = 6;
let MAX_AVATAR_SIZE = 1000000; // bits

// ========== REGISTER USER ==========
// POST : api/users/register
// UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    // res.json("Register User");
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
      return next(new HttpError("Fill in all fields", 422)); // invalid input error
    }
    // make the email lowercase
    const lowerCasedEmail = email.toLowerCase();
    // check database if email already registered
    const emailExists = await UserModel.findOne({ email: lowerCasedEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists", 422)); // invalid input error
    }
    // check if password and confirm password matches
    if (password != confirmPassword) {
      return next(new HttpError("Passwords do not match", 422));
    }
    // check password length
    if (password.length < MIN_PASSWORD_LENGTH) {
      return next(
        new HttpError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
          422
        )
      );
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // add user to database
    const newUser = await UserModel.create({
      fullName,
      email: lowerCasedEmail,
      password: hashedPassword,
    });
    res.json(newUser).status(201);
  } catch (error) {
    // console.log(error);
    return next(new HttpError(error));
  }
};

// ========== LOGIN USER ==========
// POST : api/users/login
// UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields", 422)); // invalid input error
    }
    // make the email lowercase
    const lowerCasedEmail = email.toLowerCase();
    // fetch user from the database
    const user = await UserModel.findOne({ email: lowerCasedEmail });
    if (!user) {
      return next(new HttpError("Invalid email or password", 422)); // invalid input error
    }
    // const { uPassword, ...userInfo } = user;
    // compare passwords
    const comparedPass = await bcrypt.compare(password, user?.password);
    if (!comparedPass) {
      return next(new HttpError("Invalid email or password", 422));
    }
    const token = await jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .json({ token, profilePhoto: user.profilePhoto, id: user?._id })
      .status(200);

    // res.json({ token, id: user?._id, ...userInfo }).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== CHANGE USER AVATAR ==========
// POST : api/users/avatar
// PROTECTED
const changeUserAvatar = async (req, res, next) => {
  try {
    // res.json("Change User Avatar");
    if (!req.files.avatar) {
      return next(new HttpError("Please upload an image", 422));
    }
    const { avatar } = req.files;
    // check file size (greater than 1000KB)
    if (avatar.size > MAX_AVATAR_SIZE) {
      let kb = MAX_AVATAR_SIZE / 1000;
      return next(new HttpError(`File size must be less than ${kb}KB`, 422));
    }

    let fileName = avatar.name;
    let splitFileName = fileName.split(".");
    let newFileName =
      splitFileName[0] + uuid() + "." + splitFileName[splitFileName.length - 1]; // to make filename unique
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }
        // store image on cloudinary
        const result = await cloudinary.uploader.upload(
          path.join(__dirname, "..", "uploads", newFileName),
          {
            resource_type: "image",
          }
        );
        if (!result.secure_url) {
          return next(new HttpError("Image upload failed, try again", 422));
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.user.id,
          { profilePhoto: result?.secure_url },
          { new: true }
        );
        res.json(updatedUser).status(200);
      }
    );
    // res.json(newFileName).status(200);
    // res.json(req.files).status(200); // asks for a file from user
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET USER ==========
// GET : api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 404)); // invalid input error
    }
    res.json(user).status(200);

    // res.json("Get User");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== FIND USER ==========
// GET : api/users/:fullName/find
// PROTECTED
const findUser = async (req, res, next) => {
  try {
    const { fullName } = req.params;
    const user = await UserModel.findOne({ fullName: fullName }).select(
      "-password"
    );
    if (!user) {
      return next(new HttpError("User not found", 404)); // invalid input error
    }
    res.json(user).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET USERS ==========
// GET : api/users
// PROTECTED
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().limit(10).sort({ createdAt: -1 }); // limited to 10 users, newest first
    res.json(users);
    // res.json("Register Users");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== FOLLOW/UNFOLLOW USER ==========
// GET : api/users/:id/follow-unfollow
// PROTECTED
const followUnfollowUser = async (req, res, next) => {
  try {
    const userToFollowID = req.params.id;
    if (req.user.id == userToFollowID) {
      return next(new HttpError("You cannot follow/unfollow yourself", 422));
    }
    const userToFollow = await UserModel.findById(userToFollowID);
    if (!userToFollow) {
      return next(new HttpError("User to follow not found", 404));
    }
    const currentUser = await UserModel.findById(req.user.id);
    const isFollowing = currentUser.following.includes(userToFollowID); // checking if followed already
    // follow if not following, else unfollow
    if (!isFollowing) {
      // add follower
      const updateUser = await UserModel.findByIdAndUpdate(
        userToFollowID,
        { $push: { followers: req.user.id } },
        { new: true }
      );
      // add following
      await UserModel.findByIdAndUpdate(
        req.user.id,
        { $push: { following: userToFollowID } },
        { new: true }
      );
      res
        .json(`${currentUser.fullName} followed ${userToFollow.fullName}`)
        .status(200);
    } else {
      // remove follower
      const updateUser = await UserModel.findByIdAndUpdate(
        userToFollowID,
        { $pull: { followers: req.user.id } },
        { new: true }
      );
      // remove following
      await UserModel.findByIdAndUpdate(
        req.user.id,
        { $pull: { following: userToFollowID } },
        { new: true }
      );
      res
        .json(`${currentUser.fullName} unfollowed ${userToFollow.fullName}`)
        .status(200);
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== EDIT USER ==========
// PATCH : api/users/edit
// PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { fullName, bio } = req.body;
    const editedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        bio,
      },
      { new: true }
    );
    res.json(editedUser).status(200); // success status
    // res.json("Edit User");
  } catch (error) {
    return next(new HttpError(error));
  }
};

const handleGoogleAuth = async (req, res) => {
  try {
    console.log("Google OAuth data received:", req.body);
    console.log("Authorization token:", req.headers.authorization);

    const { name, email } = req.body;

    // Here you can:
    // 1. Verify the Firebase token
    // 2. Check if user exists in your database
    // 3. Create new user or update existing user
    // 4. Return user data

    // For now, just return success
    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: { name, email },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changeUserAvatar,
  getUser,
  findUser,
  getUsers,
  followUnfollowUser,
  editUser,
  handleGoogleAuth, // Add this line
};
