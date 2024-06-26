/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const GenericActivateForm = ({
  selectedItem,
  model,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  toast,
  endpoint,
  successMessage,
}) => {
  const handleIActivate = async () => {
    try {
      const res = await api.put(`/activate/${selectedItem._id}`, {
        model,
        isActive: selectedItem.isActive ? false : true,
        status: selectedItem.status === "Arquivado" ? "Aberto" : "Arquivado",
      });
      if (res.data) {
        toast.success(successMessage, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
    } catch (err) {
      alert("Houve algum erro...");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`${
        selectedItem.name
          ? selectedItem.isActive
            ? "Arquivar"
            : "Reativar"
          : selectedItem.status === "Arquivado"
          ? "Reativar"
          : "Arquivar"
      } ${
        selectedItem.name || selectedItem.title || selectedItem.quoteNumber
      } ?`}</DialogTitle>
      <DialogContent>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleIActivate}
            sx={{ mr: 2 }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(!openDialog)}
          >
            X
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

export default GenericActivateForm;
