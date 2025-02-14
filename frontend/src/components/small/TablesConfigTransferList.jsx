/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import { Grid, Switch, Typography } from "@mui/material";

const tableTitles = {
  customerCustomer: "Clientes - Empresa",
  customerClient: "Clientes - Pessoa Física",
  groups: "Grupos",
  requestJob: "Solicitações - Job",
  requestSale: "Solicitações - Vendas",
  servicePlan: "Plano de Serviços",
};

export default function TablesConfigTransferList({
  tableStates,
  setTableStates,
}) {
  const handleSwitchChange = (tableName) => {
    setTableStates((prevTableStates) => ({
      ...prevTableStates,
      [tableName]: !prevTableStates[tableName],
    }));
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      {Object.keys(tableStates).map((tableName) => (
        <Grid
          key={tableName}
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: 250 }}
        >
          <Typography sx={{ my: "auto" }}>{tableTitles[tableName]}</Typography>
          <Switch
            checked={tableStates[tableName]}
            onChange={() => handleSwitchChange(tableName)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
