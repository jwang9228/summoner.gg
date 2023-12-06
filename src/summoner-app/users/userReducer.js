import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state) => {
      state.loggedIn = true;
    },
    logoutUser: (state) => {
      state.loggedIn = false;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
