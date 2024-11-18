/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Grid, IconButton, Typography } from "@mui/material";

import { icons } from "../../icons";

const AgendaEventBar = (props) => {
  return (
    <>
      <Grid item>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography
            sx={{
              fontSize: 14,
              borderRadius: 100,
              backgroundColor: props.isEmptyDay ? props.mainColor : "grey",
              mt: -1,
              px: 0.5,
              py: 0.25,
              color: "black",
            }}
          >
            {props.day}
          </Typography>
          <Typography
            sx={{
              ml: 3,
              mt: -1,
              fontSize: 18,
              fontWeight: "bold",
              color: "#555",
              fontFamily: "Verdana, sans-serif",
            }}
          >
            Serviços do Dia
          </Typography>

          <IconButton onClick={() => props.setOpen(!props.open)} sx={{ mb: 1 }}>
            {props.open ? <icons.ExpandLessIcon /> : <icons.ExpandMoreIcon />}
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};

export default AgendaEventBar;