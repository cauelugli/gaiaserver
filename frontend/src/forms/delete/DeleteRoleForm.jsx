/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";

import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DeleteRoleForm({
  selectedRole,
  openDelete,
  setOpenDelete,
  toast,
}) {
  const role = selectedRole;

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/roles/${role._id}`);
      if (res.data) {
        toast.error("Perfil de Acesso Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <DeleteIcon />,
        });
      }
      setOpenDelete(false);
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`Deletar Perfil ${selectedRole.name} ?`}</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => handleDelete()}
            sx={{ mr: 2 }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDelete(!openDelete)}
          >
            X
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
}
