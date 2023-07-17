import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  headerText: "",
  titleText: "",
  titleLink: "",
  desc: "",
  buttonText: "",
  buttonLink: "",
  buttonStyle: "",
  titleStyle: "",
};

const panelSlice = createSlice({
  name: "panel",
  initialState,
  reducers: {
    updateID: (state, action) => {
      state.id = action.payload;
    },
    updateHeaderText: (state, action) => {
      state.headerText = action.payload;
    },
    updateTitleText: (state, action) => {
      state.titleText = action.payload;
    },
    updateTitleLink: (state, action) => {
      state.titleLink = action.payload;
    },
    updateDesc: (state, action) => {
      state.desc = action.payload;
    },
    updateButtonText: (state, action) => {
      state.buttonText = action.payload;
    },
    updateButtonLink: (state, action) => {
      state.buttonLink = action.payload;
    },
    updateButtonStyle: (state, action) => {
      state.buttonStyle = action.payload;
    },
    updateTitleStyle: (state, action) => {
      state.titleStyle = action.payload;
    },
  },
});
export const {
  updateHeaderText,
  updateTitleText,
  updateTitleLink,
  updateButtonText,
  updateDesc,
  updateButtonLink,
  updateID,
  updateButtonStyle,
  updateTitleStyle
} = panelSlice.actions;
export default panelSlice.reducer;
