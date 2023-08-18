/* eslint-disable react/prop-types */
import React from "react";

import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";
import DepartmentTable from "../tables/DepartmentTable";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Departments({ selectedCustomer }) {
  const [value, setValue] = React.useState(0);
  const [openAdd, setOpenAdd] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "121%" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography variant="h4" sx={{ mr: 1 }}>
          Departamentos
        </Typography>
        <Button
          onClick={() => setOpenAdd(true)}
          variant="outlined"
          sx={{ borderColor: "#eee", borderRadius: 3, mb: 1, "&:hover": { borderColor: "#eee" }, }}
        >
          <Typography variant="h6" color="#eee">
            + Novo
          </Typography>
        </Button>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label="Geral"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DepartmentTable
          selectedCustomer={selectedCustomer}
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
        />
      </CustomTabPanel>
    </Box>
  );
}
