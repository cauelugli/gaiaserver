/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";

import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DeleteUserForm = ({ selectedUser, openDelete, setOpenDelete, fetchData }) => {
  const user = selectedUser;

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/users/${user._id}`);
      res.status === 200 && alert("Colaborador deletado com sucesso!");
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`Deletar Colaborador ${user.name} ?`}</DialogTitle>
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
};

export default DeleteUserForm;