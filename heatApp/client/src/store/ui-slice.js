import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeModalIsOpen: false, // controls theme selection modal
  editProfileModalOpen: false, // controls edit profile modal
  editPostModalOpen: false, // controls edit post modal
  editPostId: "", // stores which post is being edited
  theme: JSON.parse(localStorage.getItem("theme")) || {
    primaryColor: "",
    backgroundColor: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openEditProfileModal: (state) => {
      state.editProfileModalOpen = true;
    },
    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false;
    },
    openEditPostModal: (state, action) => {
      state.editPostModalOpen = true;
      state.editPostId = action.payload;
    },
    closeEditPostModal: (state) => {
      state.editPostModalOpen = false;
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice;
