import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { userActions } from "../store/user-slice";
import { uiSliceActions } from "../store/ui-slice";

const UserProfile = () => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const loggedInUserId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  const [user, setUser] = useState({});
  const [followsUser, setFollowsUser] = useState(
    user?.followers?.includes(loggedInUserId)
  );
  const [avatar, setAvatar] = useState({});
  const { id: userId } = useParams(user?.profilePhoto);

  const [avatarTouched, setAvatarTouched] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get user from db
  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response?.data);
      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
      setAvatar(response?.data?.profilePhoto);
    } catch (error) {
      console.log(error);
    }
  };

  // function to change avatar
  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    setAvatarTouched(true);
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(
        userActions?.changeCurrentUser({
          ...currentUser,
          profilePhoto: response?.data?.profilePhoto,
        })
      );
      navigate(0);
    } catch (error) {
      console.log(error);
    }
    setAvatarTouched(false);
    // e.preventDefault();
    // setAvatarTouched(true);
    // try {
    //   const postData = new FormData();
    //   postData.set("avatar", avatar);
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/users/avatar`,
    //     postData,
    //     { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   dispatch(
    //     userActions?.changeCurrentUser({
    //       ...currentUser,
    //       profilePhoto: response?.data?.profilePhoto,
    //     })
    //   );
    //   navigate(0);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // function to open "edit user"modal
  const openEditProfileModal = () => {
    dispatch(uiSliceActions.openEditProfileModal());
  };

  const followUnfollowUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, followsUser]);

  //   console.log(user);

  return (
    <section className="profile">
      {/* <HeaderInfo text={`${user.fullName}'s Profile`} /> */}
      <div className="profile__container">
        <form
          className="profile__image"
          onSubmit={changeAvatarHandler}
          encType="multipart/form-data"
        >
          <img src={`${user?.profilePhoto}`} alt="" />
          {!avatarTouched ? (
            <label htmlFor="avatar" className="profile__image-edit">
              <span>
                <LuUpload />
              </span>
            </label>
          ) : (
            <button type="submit" className="profile__image-btn">
              <FaCheck />
            </button>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              setAvatarTouched(true);
            }}
            accept=".png, .jpg, .jpeg"
          />
        </form>
        <div>
          <h4>{user?.fullName}</h4>
          <small>{user?.email}</small>
        </div>
        <ul className="profile__follows">
          <li>
            <h4>{user?.following?.length}</h4>
            <small>Following</small>
          </li>
          <li>
            <h4>{user?.followers?.length}</h4>
            <small>Followers</small>
          </li>
        </ul>
        <div className="profile__actions-wrapper">
          {user?._id == loggedInUserId ? (
            <button className="btn" onClick={openEditProfileModal}>
              Edit Profile
            </button>
          ) : (
            <button className="btn" onClick={followUnfollowUser}>
              {followsUser ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <article className="profile__bio">
          <p>{user?.bio}</p>
        </article>
      </div>
    </section>
  );
  //   return <div>UserProfile</div>;
};

export default UserProfile;
