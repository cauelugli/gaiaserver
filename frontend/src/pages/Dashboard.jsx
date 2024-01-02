/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { Typography } from "@mui/material";
import TestWebSocketButton from "../components/small/buttons/TestWebsocketButton";

const Dashboard = ({ user }) => {
  return (
    <>
      <TestWebSocketButton />
      <p>Dashboard</p>
      <Typography sx={{ my: 3 }}>
        Hellow, <strong>{user.name}</strong> !
      </Typography>
      <Typography sx={{ my: 1 }}>
        Departamento: {user.department ? user.department.name : "-"}
      </Typography>
      <Typography sx={{ my: 1 }}>
        Acesso: {user.role ? user.role.name : "-"}
      </Typography>
      <Typography sx={{ my: 1 }}>
        Cargo: {user.position ? user.position : "-"}
      </Typography>
      <Typography sx={{ my: 1 }}>Usuário: {user.username}</Typography>

      <img
        src={`http://localhost:3000/static${user.image}`}
        alt="Logo do Tenant"
        style={{
          width: "8%",
          marginTop: 2,
          marginBottom: 2,
          cursor: "pointer",
        }}
      />
    </>
  );
};

export default Dashboard;
