import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    signInStart(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    signInSuccess(state, action) {
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
      };
    },
    signInFailure(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateStart(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateSuccess(state, action) {
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
      };
    },
    updateFailure(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    deleteStart(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteSuccess(state, action) {
      return {
        ...state,
        loading: false,
        currentUser: null,
      };
    },
    deleteFailure(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
} = userSlice.actions;

export default userSlice.reducer;
