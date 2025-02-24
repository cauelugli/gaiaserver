/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Grid2, Popover, Typography } from "@mui/material";

const ShortcutItem = ({ shortcut, onShortcutClick, onDeleteShortcut }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteShortcut(shortcut.name);
    handleClosePopover();
  };

  const handleClosePopover = (e) => {
    if (e) e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Grid2
      container
      onClick={() => onShortcutClick(shortcut)}
      direction="row"
      justifyContent="space-between"
      sx={{
        mb: 1,
        backgroundColor: "#fff",
        borderRadius: 2,

        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#ddd",
        },
      }}
    >
      <Typography
        sx={{
          p: 1,
          fontSize: 12,
          mx: "auto",
        }}
      >
        {shortcut.name.toUpperCase()}
      </Typography>
      <Typography
        onClick={handleOpenPopover}
        sx={{
          p: 1,
          fontSize: 12,
          borderRadius: 2,
          cursor: "pointer",

          "&:hover": {
            backgroundColor: "#bbb",
          },
        }}
      >
        ...
      </Typography>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        elevation={0}
      >
        <Grid2 container direction="column">
          <Typography sx={{ p: 2 }}>Deletar Atalho?</Typography>
          <Grid2 item>
            <Grid2
              container
              direction="row"
              justifyContent="space-around"
              sx={{ p: 1 }}
            >
              <Button
                onClick={handleDelete}
                color="success"
                variant="contained"
                sx={{ mx: 0.5, p: 0, px: -1, borderRadius: 50 }}
              >
                OK
              </Button>
              <Button
                onClick={handleClosePopover}
                color="error"
                variant="contained"
                sx={{ mx: 0.5, p: 0, px: -1, borderRadius: 50 }}
              >
                X
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Popover>
    </Grid2>
  );
};

export default ShortcutItem;
