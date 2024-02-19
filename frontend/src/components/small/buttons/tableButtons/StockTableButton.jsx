/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SellIcon from "@mui/icons-material/Sell";
import SpokeIcon from "@mui/icons-material/Spoke";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuIndex) => {
    handleClose();
    props.openModal(menuIndex);
  };

  const [openSubmenu, setOpenSubmenu] = useState(false);

  const handleClickSubmenu = () => {
    setOpenSubmenu(!openSubmenu);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          borderRadius: 3,
          "&:hover": { borderColor: "#eee" },
        }}
      >
        <Typography variant="h6">+</Typography>
        <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>Novo</Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 220 }}>
          <ListItemButton onClick={() => handleMenuItemClick(0)}>
            <ListItemIcon>
              <SellIcon />
            </ListItemIcon>
            <ListItemText primary="Produto" sx={{ ml: -2 }} />
          </ListItemButton>
          <ListItemButton onClick={() => handleMenuItemClick(1)}>
            <ListItemIcon>
              <SpokeIcon />
            </ListItemIcon>
            <ListItemText primary="Múltiplos Produtos" sx={{ ml: -2 }} />
          </ListItemButton>
          <ListItemButton onClick={() => handleMenuItemClick(2)}>
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText primary="Material" sx={{ ml: -2 }} />
          </ListItemButton>
          <ListItemButton onClick={handleClickSubmenu}>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Entrada" sx={{ ml: -2 }} />
            {openSubmenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton onClick={() => handleMenuItemClick(3)} sx={{ pl: 5 }}>
                <ListItemIcon>
                  <ShoppingBasketIcon />
                </ListItemIcon>
                <ListItemText primary="Produtos" sx={{ ml: -2 }} />
              </ListItemButton>
              <ListItemButton onClick={() => handleMenuItemClick(4)} sx={{ pl: 5 }}>
                <ListItemIcon>
                  <WarehouseIcon />
                </ListItemIcon>
                <ListItemText primary="Estoque" sx={{ ml: -2 }} />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Menu>
    </div>
  );
}
