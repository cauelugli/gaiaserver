/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  // Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditJobForm = ({
  openEditJob,
  setOpenEditJob,
  fetchData1,
  selectedJob,
  toast,
}) => {
  const [title, setTitle] = React.useState(selectedJob.title);
  const [description, setDescription] = React.useState(selectedJob.description);
  const [requester, setRequester] = React.useState(selectedJob.requester);
  const [worker, setWorker] = React.useState(selectedJob.worker);
  const [department, setDepartment] = React.useState(selectedJob.department);
  const [service, setService] = React.useState("");
  const [price, setPrice] = React.useState(selectedJob.price);
  const [materials, setMaterials] = React.useState(selectedJob.materials);
  const [materialsCost, setMaterialsCost] = React.useState(selectedJob.materialsCost);
  const [local, setLocal] = React.useState(selectedJob.local);
  const [scheduledTo, setScheduledTo] = React.useState(
    dayjs(selectedJob.scheduledTo)
  );

  const [departments, setDepartments] = React.useState([]);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await api.get("/departments");
        const services = await api.get("/services");
        setDepartments(departments.data);
        setServices(services.data);

        const selectedDepartment = departments.data.find(
          (department) => department._id === selectedJob.department.id
        );
        setDepartment(selectedDepartment);

        const selectedService = services.data.find(
          (service) => service._id === selectedJob.service._id
        );
        setService(selectedService);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [
    selectedJob.department.id,
    selectedJob.service.name,
    selectedJob.service._id,
  ]);

  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);

  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/jobs", {
        jobId: selectedJob._id,
        title,
        description,
        requester,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          color: department.color,
        },
        worker,
        manager: department.manager,
        materials,
        materialsCost,
        service,
        price,
        local,
        scheduledTo,
      });
      if (res.data) {
        toast.success("Pedido Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEditJob(!openEditJob);
      fetchData1;
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>Editando Job</DialogTitle>
      </Grid>

      <DialogContent>
        <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
          Informações do Cliente
        </Typography>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item>
            <TextField
              label="Tipo"
              variant="outlined"
              disabled
              value={selectedJob.customer.cnpj ? "Empresa" : "Pessoa Física"}
              sx={{ width: 180 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Cliente"
              variant="outlined"
              disabled
              value={selectedJob.customer.name}
              sx={{ width: 200, mx: 1 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Solicitante"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              variant="outlined"
              sx={{ width: 200, ml: 1 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Local de Execução"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              variant="outlined"
              sx={{ width: 250, mx: 1 }}
            />
          </Grid>
          <Grid item sx={{ mt: -1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={scheduledTo}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => setScheduledTo(newValue)}
                  label="Agendado para"
                  sx={{ width: 180 }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Departamento
        </Typography>
        <Grid container sx={{ pr: "4%" }} direction="row">
          <Grid item>
            <Select
              onChange={(e) => {
                setDepartment(e.target.value), setService(""), setWorker("");
              }}
              value={department || selectedJob.department}
              size="small"
              sx={{ minWidth: "200px" }}
              renderValue={(selected) => selected.name}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: item.color,
                      color: "white",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item sx={{ ml: 2, mt: -7 }}>
            <>
              <Typography sx={{ my: 2 }}>Serviço</Typography>
              <Select
                onChange={(e) => setService(e.target.value)}
                value={service}
                size="small"
                sx={{ width: 250 }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>{selectedJob.service.name}</Typography>;
                  }

                  return selected.name;
                }}
              >
                {services
                  .filter(
                    (service) =>
                      service.department.id ===
                      (department ? department._id : selectedJob.department.id)
                  )
                  .map((item) => (
                    <MenuItem value={item} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </>
          </Grid>

          <Grid item sx={{ ml: 2, mt: -7 }}>
            <>
              <Typography sx={{ my: 2 }}>Colaborador</Typography>
              <Select
                onChange={(e) => setWorker(e.target.value)}
                value={worker}
                size="small"
                sx={{ minWidth: "200px" }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>{selectedJob.worker.name}</Typography>;
                  }

                  return selected.name;
                }}
              >
                {department.members ? (
                  department.members.map((item) => (
                    <MenuItem
                      value={item}
                      key={item._id}
                      sx={{ fontSize: "100%" }}
                    >
                      {item.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Carregando...</MenuItem>
                )}
              </Select>
            </>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
          Solicitação
        </Typography>
        <Grid container sx={{ pr: "4%", mt: 2 }} direction="column">
          <Grid item>
            <TextField
              label="Título"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            />

            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Orçamento
        </Typography>
        <Grid container sx={{ pr: "4%", ml: "5%" }} direction="row">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              sx={{
                width: 750,
                backgroundColor: "#eee",
                p: 3,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Serviço
              </Typography>
              <Grid
                container
                direction="row"
                sx={{
                  width: "70%",
                  borderRadius: 4,
                  py: 2,
                }}
              >
                <Typography sx={{ fontSize: 16, mx: 1 }}>
                  {service && `${service.name} = `}{" "}
                  {service.value ? `R$ ${service.value}` : "R$0,00"}
                </Typography>
              </Grid>
              <Typography sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}>
                Materiais
              </Typography>

              <Grid
                container
                direction="row"
                sx={{
                  width: "70%",
                  borderRadius: 4,
                  py: 2,
                }}
              >
                <Grid
                  item
                  sx={{
                    borderRadius: 4,
                  }}
                >
                  {materials.map((material) => (
                    <Typography
                      sx={{ my: 0.5, ml: 1, fontSize: 16 }}
                      key={material.id}
                    >
                      {material.name} x{material.quantity} = R$
                      {material.sellValue * material.quantity}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
              <Typography sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}>
                Total
              </Typography>

              <Grid
                container
                direction="row"
                sx={{
                  width: "70%",
                  borderRadius: 4,
                  py: 2,
                }}
              >
                <Typography sx={{ fontSize: 16, mx: 1 }}>
                  Serviço + Materiais ={" "}
                  {service && `R$ ${materialsCost + service.value}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, mt: 4 }} />
        <Checkbox
          checked={showAdditionalOptions}
          onChange={handleCheckboxChange}
        />
        <label>Observações</label>

        {showAdditionalOptions && (
          <Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEditJob(!openEditJob)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditJobForm;
