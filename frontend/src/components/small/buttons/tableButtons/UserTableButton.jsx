/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Typography,
  MenuItem,
  MenuList,
  Grid,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";

export default function UserTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddUser,
  setOpenAddManager,
  configCustomization,
}) {
  return (
    <div>
      <Button
        onClick={handleClickAddButton}
        size="small"
        sx={{
          color: configCustomization.mainColor || "#32aacd",
          "&:hover": { borderColor: "#eee" },
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" sx={{ mb: 0.5, mr: 0.5 }}>
            +
          </Typography>
          <Typography sx={{ fontSize: 16 }}>Novo</Typography>
        </Grid>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openAddButton}
        onClick={handleCloseAddButton}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList sx={{ width: 190 }}>
          <MenuItem onClick={() => setOpenAddUser(true)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>Colaborador</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddManager(true)}>
            <ListItemIcon>
              <Person4Icon />
            </ListItemIcon>
            <ListItemText>Gerente</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
