import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserTable from "../tables/UserTable";

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

export default function Users({ selectedCustomer }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "120%" }}>
      <Typography variant="h4">Funcionários</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Colaboradores" />
          <Tab label="Gerentes" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Managers
      </CustomTabPanel>
    </Box>
  );
}
