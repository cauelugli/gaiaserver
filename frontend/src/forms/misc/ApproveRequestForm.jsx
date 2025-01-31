/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ApproveRequestForm = (props) => {
  const handleApproveRequest = async () => {
    try {
      const res = await api.put(`/actions/approveRequest/`, {
        model: props.model,
        id: props.selectedItemId,
        approvedBy: props.userId,
      });

      if (res.data) {
        toast.success(`Solicitação Aprovada`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });

        if (props.userId) {
          socket.emit("newDataRefreshButton", {
            page: props.page,
            userId: props.userId,
          });
        }
      }
      props.setOpenDialog(false);
      props.setRefreshData(!props.refreshData);
      api.post("/log", {
        source: props.userId,
        target: res.data,
        label: props.label,
      });
    } catch (err) {
      toast.error("Houve um erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ my: 2 }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          Aprovar Solicitação {props.selectedItemName}?
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleApproveRequest}
          sx={{ mr: 2 }}
        >
          Confirmar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => props.setOpenDialog(!props.openDialog)}
        >
          X
        </Button>
      </DialogActions>
    </Grid>
  );
};

export default ApproveRequestForm;
