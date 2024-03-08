/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";

import {
  Avatar,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const WorkerSelect = (props) => {
  const [workers, setWorkers] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await api.get("/users");
        const resManagers = await api.get("/managers");
        const combinedData = [...resUsers.data, ...resManagers.data];
        setWorkers(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FormControl sx={{ mx: props.mx075 ? 0.75 : 0 }}>
      <Select
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Typography>Colaborador</Typography>;
          }

          return (
            <Grid container direction="row" alignItems="center">
              <Avatar
                alt="Imagem do Cliente"
                src={`http://localhost:3000/static/${selected.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography>{selected.name}</Typography>
            </Grid>
          );
        }}
        sx={{ mt: 1, width: 180 }}
        onChange={(e) =>
          props.setWorker(props.needId ? e.target.value : e.target.value.name)
        }
      >
        <TextField
          placeholder="Pesquisar"
          variant="outlined"
          sx={{ my: 1, mx: "10%" }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((item) => (
            <MenuItem value={item} key={item._id}>
              <Grid container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem do Cliente"
                  src={`http://localhost:3000/static/${item.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography id="ghostText" sx={{ color: "white" }}>
                  {"•"}
                </Typography>
                <Typography>{item.name}</Typography>
              </Grid>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography sx={{ textAlign: "center" }}>
              Nenhum colaborador encontrado
            </Typography>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default WorkerSelect;
