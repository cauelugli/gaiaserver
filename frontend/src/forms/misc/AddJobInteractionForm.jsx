/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddJobInteractionForm = ({
  user,
  openEditJob,
  setOpenEditJob,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
  fromSales,
}) => {
  const [activity, setActivity] = React.useState("");
  const [endpoint, setEndpoint] = React.useState(fromSales ? "sales" : "jobs");

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    const requestBody = {
      jobId: selectedJob._id,
      activity,
      user,
      worker: selectedJob.worker,
      manager: selectedJob.manager,
      date: dayjs().format("DD/MM/YYYY HH:mm"),
    };
    try {
      const res = await api.put(`/${endpoint}/interaction`, requestBody);
      if (res.data) {
        toast.success("Interação Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEditJob(!openEditJob);
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAddInteraction}>
      <Grid container>
        <Typography sx={{ m: 3, fontSize: 18, fontWeight: "bold" }}>
          Histórico do Job
        </Typography>
        <Grid container direction="column" sx={{ mx: 3 }}>
          <Grid item>
            <Typography sx={{ mt: 3, mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Interações
            </Typography>
            <Table>
              <TableBody>
                <TableRow
                  sx={{
                    backgroundColor: "#eee",
                  }}
                >
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      Colaborador
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      Atividade
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      Data
                    </Typography>
                  </TableCell>
                </TableRow>

                {selectedJob.interactions.map((interaction) => (
                  <TableRow
                    key={interaction.number}
                    sx={{
                      backgroundColor:
                        interaction.number % 2 === 0 ? "#eee" : "white",
                    }}
                  >
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.user}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.activity}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>

          <Grid item>
            <Typography sx={{ mb: 2, mt: 4, fontSize: 18, fontWeight: "bold" }}>
              Nova Interação
            </Typography>
            <TextField
              label="Atividade"
              variant="outlined"
              size="small"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              sx={{ width: "100%", mx: "auto" }}
            />
            <Grid item>
              <Grid container direction="row" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ my: 2, mr: 2 }}
                >
                  Adicionar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenEditJob(!openEditJob)}
                  sx={{ my: 2 }}
                >
                  X
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddJobInteractionForm;