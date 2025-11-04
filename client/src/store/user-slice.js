import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null, // gets and stores logged-in user data (from localStorage if available)
    socket: null, // stores socket.io connection object for real-time messaging
    onlineUsers: [],
  },
  reducers: {
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload; // updates current user with new user data [action.payload]
    },
    setSocket: (state, action) => {
      state.socket = action.payload; // stores socket.io connection obj for real-time messaging functionality
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // stores current users online
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
