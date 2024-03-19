import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
    toggle: false,
  },
  reducers: {
    toggleTheme(state, action) {
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    },
  },
});
const { actions, reducer } = themeSlice;
export const { toggleTheme, userToggle } = actions;
export default reducer;
