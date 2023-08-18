/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import { Divider, List, ListItemButton, Typography } from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FlagIcon from '@mui/icons-material/Flag';
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import LanIcon from "@mui/icons-material/Lan";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";

const options = [
  { label: "Dashboard", icon: <DashboardIcon />, link: "/" },
  { label: "Colaboradores", icon: <GroupIcon />, link: "/users" },
  { label: "Departamentos", icon: <LanIcon />, link: "/departments" },
  { label: "Pedidos", icon: <GradingIcon />, link: "/requests" },
  { label: "Metas", icon: <FlagIcon />, link: "/goals", disabled: true },
  { label: "Financeiro", icon: <AttachMoneyIcon />, link: "/finance", disabled: true },
  { label: "Clientes", icon: <WorkIcon />, link: "/customers" },
  { label: "Configurações", icon: <SettingsIcon />, link: "/settings", disabled: true },
];

const SideBar = ({ sidebarOpen }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickOption = (index) => {
    setSelectedIndex(index);
  };

  return (
    <List>
      {options.map((option, index) => (
        <Link
          key={index}
          onClick={() => handleClickOption(index)}
          to={option.link}
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <ListItemButton
            selected={selectedIndex === index}
            disabled={option.disabled}
            sx={{
              color: selectedIndex === index ? "white" : "",
              "&:hover": {
                backgroundColor: "#aaa",
              },
            }}
          >
            {option.icon}
            {sidebarOpen && <Typography sx={{ ml: 1 }}>{option.label}</Typography>}
          </ListItemButton>
          {option.label === "Financeiro" && <Divider sx={{my:2}}/>}
        </Link>
      ))}
    </List>
  );
};

export default SideBar;
