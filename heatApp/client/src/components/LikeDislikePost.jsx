import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FcLike } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa";

const LikeDislikePost = (props) => {
  const [post, setPost] = useState(props.post);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const [postLiked, setPostLiked] = useState(post?.likes?.includes?.userId);

  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // function to check if post is already liked or not
  const handleCheckIfUserLikePost = () => {
    // if (post?.likes?.includes(userId)) {
    //   setPostLiked(true);
    // } else {
    //   setPostLiked(false);
    // }
    setPostLiked(post?.likes?.includes(userId));
  };

  useEffect(() => {
    handleCheckIfUserLikePost();
  }, [post]);

  return (
    <button
      style={{
        cursor: "pointer",
        fontSize: "1.5rem",
        // color: "var(--color-gray-900)",
      }}
      onClick={handleLikeDislikePost}
    >
      {/* className="feed__footer-comments" */}
      {postLiked ? <FcLike /> : <FaRegHeart />}
      <small>{post?.likes.length}</small>
    </button>
  );
  //   return <div>LikeDislikePost</div>;
};

export default LikeDislikePost;
