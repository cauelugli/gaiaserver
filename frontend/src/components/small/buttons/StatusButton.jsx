/* eslint-disable react/prop-types */
import * as React from "react";

import { Button, Menu, Grid, Typography, MenuItem } from "@mui/material";

export default function StatusButton({ status, changedStatus, onMouseEnter }) {
  const previousStatus = status;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const optionList = [
    "Aprovado",
    "Em Execução",
    "Aguardando Cliente",
    "Aguardando Terceiro",
    "Concluido",
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionClick = (opt) => {
    setAnchorEl(null);
    changedStatus(opt);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
      >
        <Typography
          sx={{
            fontSize: 13,
            color:
              (previousStatus === "Aberto" && "#777") ||
              (previousStatus === "Aprovado" && "darkgreen") ||
              "black",
          }}
        >
          {previousStatus}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <MenuItem sx={{ my: -0.25 }} disabled>
            <Typography sx={{ fontSize: 13 }}>Aberto</Typography>
          </MenuItem>
          {optionList.map((opt, index) => (
            <MenuItem
              key={index}
              sx={{ my: -0.25 }}
              onClick={() => handleOptionClick(opt)}
            >
              <Typography sx={{ fontSize: 13 }}>{opt}</Typography>
            </MenuItem>
          ))}
        </Grid>
      </Menu>
    </>
  );
}
