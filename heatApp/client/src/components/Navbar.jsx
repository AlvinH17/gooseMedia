import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import ProfileImage from "./ProfileImage";
import { useSelector } from "react-redux";
import axios from "axios";
import gooseIcon from "../assets/goose_icon.png";

let LOG_OUT_AFTER = 60; // log out after 60 min

const Navbar = () => {
  const [user, setUser] = useState([]);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // const profilePhoto = useSelector(
  //   (state) => state?.user?.currentUser?.profilePhoto
  // );

  // get user from db
  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  // find user from db by fullName
  const findUser = async (fullName) => {
    try {
      setIsSearching(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${fullName}/find`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response?.data);
      return response?.data;
    } catch (error) {
      alert("User not found");
      setSearchResults(null);
    }
    setIsSearching(false);
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Option 1: Search for user and navigate to their profile
      const foundUser = await findUser(searchQuery.trim());
      if (foundUser) {
        navigate(`/users/${foundUser._id}`);
        setSearchQuery(""); // Clear search after navigation
      }
    }
  };
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Clear previous results when user starts typing
    if (searchResults) {
      setSearchResults(null);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getUser();
    }
  }, [userId, token]);

  // REDIRECT USER TO LOGIN PAGE IF HE/SHE HAS NO TOKEN
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // kick out user after an hour
  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 1000 * 60 * LOG_OUT_AFTER);
  }, []);

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link
          to="/"
          className="navbar__logo"
          style={{
            marginRight: "30px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img
            src={gooseIcon}
            alt="Goose Logo"
            style={{
              marginLeft: "20px",
              width: "2.5rem",
              height: "2.5rem",
              objectFit: "contain",
            }}
          />
          GOOSE
        </Link>
        {/* Navigation Items - styled like sidebar but horizontal */}
        <div className="navbar__nav">
          <NavLink to="/">
            <span style={{ marginLeft: "20px", marginRight: "20px" }}>
              Home
            </span>
          </NavLink>
          <NavLink to="/bookmarks">
            <span style={{ marginLeft: "20px", marginRight: "20px" }}>
              Bookmarks
            </span>
          </NavLink>
          <NavLink to={`users/${userId}`}>
            <span style={{ marginLeft: "20px", marginRight: "20px" }}>
              Profile
            </span>
          </NavLink>
          {/* Add more nav items as needed */}
        </div>
        {/* Search Form */}
        <form className="navbar__search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={isSearching}
          />
          <button type="submit" disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? "..." : <CiSearch />}
          </button>
        </form>

        <div className="navbar__right">
          <Link
            to={`/users/${userId}`}
            className="navbar__profile"
            style={{ marginLeft: "20px" }}
          >
            <ProfileImage image={user?.profilePhoto} />
          </Link>
          {token ? (
            <Link to={"/logout"}>Logout</Link>
          ) : (
            <Link to={"/login"}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
