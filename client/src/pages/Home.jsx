import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import axios from "axios";
import Feeds from "../components/Feeds";
import HeaderInfo from "../components/HeaderInfo";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // function to create post
  const createPost = async (data) => {
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        data,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      const newPost = response?.data;
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  // function to get posts
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(response?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getPosts();
  }, [setPosts]);

  console.log(posts);

  return (
    <section className="mainArea">
      <HeaderInfo text="My Home" />

      <CreatePost onCreatePost={createPost} error={error} />
      <Feeds posts={posts} onSetPosts={setPosts} />
    </section>
  );
  // return <div>Home</div>
};

export default Home;
