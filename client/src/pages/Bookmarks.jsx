import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Feed from "../components/Feed";
import HeaderInfo from "../components/HeaderInfo";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // get bookmarks from db
  const getBookmarks = async () => {
    setIsLoading(true);
    try {
      // const response = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/users/bookmarks`,
      //   { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      // );
      // setBookmarks(response?.data?.bookmarks);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/bookmarks`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks(response?.data?.bookmarks);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  console.log(bookmarks);

  return (
    <section>
      <HeaderInfo text="My Bookmarks" />
      {bookmarks?.length < 1 ? (
        <p style={{ textAlign: "center", padding: "1rem" }}>
          no posts bookmarked
        </p>
      ) : (
        bookmarks?.map((bookmark) => (
          <Feed key={bookmark?._id} post={bookmark} />
        ))
      )}
    </section>
  );
  // return <div>Bookmarks</div>;
};

export default Bookmarks;
