/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Avatar,
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const RequestBuyForm = (props) => {
  const [quantity, setQuantity] = useState(1);

  const handleRequestApproval = async () => {
    try {
      const res = await api.put(`/actions/requestBuy/`, {
        requestedBy: props.userId,
        product: {
          id: props.selectedItem._id,
          name: props.selectedItem.name,
          quantity: quantity,
          finalPrice: props.selectedItem.buyValue * quantity,
        },
      });

      if (res.data) {
        toast.success(`Solicitação de Compra Enviada`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.setOpenDialog(false);
      props.setRefreshData(!props.refreshData);
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

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
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
          Solicitar Compra para {props.selectedItem.name}
        </Typography>
      </DialogTitle>
      <>
        <Avatar
          src={`http://localhost:3000/static${props.selectedItem.images[0]}`}
          sx={{ width: 128, height: 128, my: 1 }}
        />
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton onClick={decrementQuantity} color="inherit">
            <icons.RemoveIcon />
          </IconButton>
          <Typography>{quantity}</Typography>
          <IconButton onClick={incrementQuantity} color="inherit">
            <icons.AddIcon />
          </IconButton>
        </Grid>
      </>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ my: 2 }}
      >
        <Typography sx={{mr:5}}>
          Valor por Item: R${props.selectedItem.buyValue.toFixed(2)}
        </Typography>
        <Typography>
          Valor Total: R${(props.selectedItem.buyValue * quantity).toFixed(2)}
        </Typography>
      </Grid>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleRequestApproval}
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

export default RequestBuyForm;
