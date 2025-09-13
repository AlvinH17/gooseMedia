import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
// import { createBookmark } from "../../../server/controllers/postControllers";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const BookmarksPost = ({ post }) => {
  const [user, setUser] = useState({});
  const [postBookmarked, setPostBookmarked] = useState(
    user?.bookmarks?.includes(post?._id)
  );
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const id = useSelector((state) => state?.user?.currentUser?.id);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response?.data);
      // if (response?.data?.bookmarks?.includes(post?._id))
      setPostBookmarked(response?.data?.bookmarks?.includes(post?._id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (id && token) {
    getUser();
    // }
  }, []);

  // function to createBookmark
  const createBookmark = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   if (response?.data?.bookmarks?.includes(post?._id)) {
      //     setPostBookmarked(true);
      //   } else {
      //     setPostBookmarked(false);
      //   }
      setPostBookmarked(response?.data?.bookmarks?.includes(post?._id));

      //   setPost(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="feed_footer-bookmark" onClick={createBookmark}>
      {postBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
  //   return <div>BookmarksPost</div>;
};

export default BookmarksPost;
