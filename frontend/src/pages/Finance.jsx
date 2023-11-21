/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";

import CustomerTable from "../tables/CustomerTable";
import ClientTable from "../tables/ClientTable";
import AddClientForm from "../forms/add/AddClientForm";
import AddCustomerForm from "../forms/add/AddCustomerForm";

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import TableFilters from "../components/TableFilters";
import FinanceIncomeTable from "../tables/FinanceIncomeTable";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

export default function Finance({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [incoming, setIncoming] = React.useState([]);
  const [outcoming, setOutcoming] = React.useState([]);

  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const [searchValue, setSearchValue] = React.useState("");

  const searchOptionList = [
    {
      // FINANCE INCOME TABLE
      options: [{ value: "name", label: "Nome" }],
    },
    {
      // FINANCE OUTCOME TABLE
      options: [{ value: "name", label: "Nome" }],
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    setSearchOption("name");
    setSearchOptionLabel("Nome");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const finance = await api.get("/finance");
        setIncoming(finance.data.filter((item) => item.type==="income"));
        setOutcoming(finance.data.filter((item) => item.type==="outcome"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
          Financeiro
        </Typography>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>A Receber</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>A Pagar</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {incoming.length === 0 ? (
          <NoDataText option="Contas a Receber" />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[0]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <FinanceIncomeTable />

            {/* <CustomerTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            /> */}
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {outcoming.length === 0 ? (
          <NoDataText option="Contas a Pagar" />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[1]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            {/* <ClientTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            /> */}
          </>
        )}
      </CustomTabPanel>
    </Box>
  );
}
