import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    toggle: false,
  },
  reducers: {
    toggleBtn(state, action) {
      return {
        ...state,
        toggle: state.toggle === false ? true : false,
      };
    },
  },
});
const { actions, reducer } = toggleSlice;
export const { toggleBtn } = actions;
export default reducer;
