import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import TimeAgo from "react-timeago";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import LikeDislikePost from "./LikeDislikePost";
import TrimText from "../helpers/TrimText";
import BookmarksPost from "./BookmarksPost";
import { uiSliceActions } from "../store/ui-slice";
import { HiDotsHorizontal } from "react-icons/hi";

let MAX_POST_LENGTH = 160;

// get post creator
const Feed = ({ post, onDeletePost }) => {
  // Add safety check
  if (!post || !post._id) {
    return <div>Loading...</div>;
  }

  const [creator, setCreator] = useState({});
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const getPostCreator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${post?.creator}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setCreator(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, []);

  const showEditPostModal = () => {
    dispatch(uiSliceActions?.openEditPostModal(post?._id));
    setShowFeedHeaderMenu(false);
  };

  const deletePost = () => {
    onDeletePost(post?._id);
    setShowFeedHeaderMenu(false);
  };

  return (
    <article className="feed">
      <header className="feed__header">
        <Link to={`/users/${post?.creator}`} className="feed__header-profile">
          <ProfileImage image={creator?.profilePhoto} />
          <div className="feed__header-details">
            <h4>{creator?.fullName}</h4>
            <small>
              <TimeAgo date={post?.createdAt} />
            </small>
          </div>
        </Link>
        {showFeedHeaderMenu &&
          userId == post?.creator &&
          location.pathname.includes("users") && (
            <menu className="feed__header-menu">
              <button onClick={showEditPostModal}>Edit</button>
              <button onClick={deletePost}>Delete</button>
            </menu>
          )}
        {userId == post?.creator && location.pathname.includes("user") && (
          <button onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}>
            <HiDotsHorizontal />
          </button>
        )}
      </header>
      <Link to={`posts/${post?._id}`} className="feed__body">
        <p>
          <TrimText item={post?.body} maxLength={MAX_POST_LENGTH} />
        </p>
        <div className="feed__images">
          <img src={post?.image} alt="" />
        </div>
      </Link>
      <footer className="feed__footer">
        <div>
          <LikeDislikePost post={post} />
          <button className="feed__footer-comments">
            <Link to={`/posts/${post?._id}`}>
              <FaRegCommentDots />
            </Link>
            <small>{post?.comments?.length}</small>
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>
    </article>
  );
  //   return <div>Feed</div>;
};

export default Feed;
