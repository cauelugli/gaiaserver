/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";

import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DeleteStockItemForm({ selectedStockItem, openDelete, setOpenDelete, fetchData }) {
  const stockItem = selectedStockItem;

  const handleDelete = async () => {
    try { 
      const res = await api.delete(`/stockItems/${stockItem._id}`);
      res.status === 200 && alert("Item deletado com sucesso!");
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`Deletar Item ${stockItem.name} do estoque?`}</DialogTitle>
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