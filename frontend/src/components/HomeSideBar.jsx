/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid } from "@mui/material";

import UserShortcuts from "./small/UserShortcuts";
import NewsBox from "./small/NewsBox";

const HomeSideBar = ({ user, handleShortcutClick }) => {
  return (
    <Grid sx={{ mx: 1 }}>
      <UserShortcuts user={user} onShortcutClick={handleShortcutClick} />
      <NewsBox />
    </Grid>
  );
};

export default HomeSideBar;
