/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { io } from "socket.io-client";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import Members from "../../components/small/Members";
import ProjectStages from "../../components/small/ProjectStages";
import ProjectStageTasks from "../../components/small/ProjectStageTasks";
import ProjectReviewTable from "../../components/ProjectReviewTable";
import DialogHeader from "../../components/small/DialogHeader";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FormEndLine from "../../components/small/FormEndLine";
import FormEndLineProjectLogo from "../../components/small/FormEndLineProjectLogo";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const socket = io("http://localhost:5002");

export default function AddProjectForm({
  userId,
  userName,
  userImage,
  configData,
  openAdd,
  setOpenAdd,
  refreshData,
  setRefreshData,
  toast,
  customers,
  clients,
  departments,
  services,
  products,
  handleOpenConfirmDialog,
  configNotificationsBooleans,
  template,
}) {
  const [firstPartOK, setFirstPartOK] = React.useState(false);
  const [secondPartOK, setSecondPartOK] = React.useState(false);
  const [thirdPartOK, setThirdPartOK] = React.useState(false);
  const [type, setType] = React.useState(template.type || "");
  const [customer, setCustomer] = React.useState("");
  const [customerType, setCustomerType] = React.useState("");
  const [name, setName] = React.useState(template.title || "");
  const [price, setPrice] = React.useState(template.price || 0);
  const [mainDepartment, setMainDepartment] = React.useState(
    template.mainDepartment || ""
  );
  const [selectedDepartments, setSelectedDepartments] = React.useState(
    template.departments || []
  );
  const [availableDepartments, setAvailableDepartments] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [attachments, setAttachments] = React.useState(
    template.attachments || []
  );
  const [stages, setStages] = React.useState(template.stages || []);
  const [stagesColorSchema, setStagesSchemaColor] = React.useState(0);
  const [definedStagesColors, setDefinedStagesColors] = React.useState(
    template.definedStagesColors || []
  );
  const [description, setDescription] = React.useState(
    template.description || ""
  );
  const [recurrent, setRecurrent] = React.useState(false);
  const [templateName, setTemplateName] = React.useState("");
  const [dueTo, setDueTo] = React.useState(dayjs().add(1, "month"));

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/projects", {
        name,
        creator: { name: userName, id: userId },
        type,
        customer,
        customerType,
        description,
        mainDepartment,
        members,
        departments: selectedDepartments,
        price,
        createdAt: dayjs().format("DD/MM/YYYY"),
        dueTo: dayjs(dueTo).format("DD/MM/YYYY"),
        stages,
        definedStagesColors,
        recurrent,
        templateName,
      });

      if (res.data) {
        const itemId = res.data.updatedProject._id;
        const uploadResponses = [];

        for (const file of attachments) {
          const formData = new FormData();
          formData.append("attachment", file);
          formData.append("itemId", itemId);

          const uploadResponse = await api.post(
            "/uploads/singleAttachment",
            formData
          );
          uploadResponses.push(uploadResponse.data.attachmentPath);
        }

        await api.put(`/projects/addAttachments`, {
          itemId: res.data.updatedProject._id,
          attachments: uploadResponses,
        });

        toast.success("Projeto Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });

        socket.emit("newDataRefreshButton", {
          page: "projects",
          userId: userId,
        });

        if (configData.notifyWhenProjectIsCreated) {
          const memberIds = members.map((member) => member.id);
          socket.emit("whenProjectIsCreated", {
            sender: userName,
            list: memberIds,
            date: dayjs(Date.now()).format("DD/MM/YYYY"),
            projectName: name,
          });
        }
      }

      setOpenAdd(!openAdd);
      setRefreshData(!refreshData);
    } catch (err) {
      console.log("err", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleAddTask = (stageIndex, newTask) => {
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        tasks: [...updatedStages[stageIndex].tasks, newTask],
      };
      return updatedStages;
    });
  };

  const handleRemoveMember = (memberToRemove) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member !== memberToRemove)
    );
  };

  React.useEffect(() => {
    const selectedMembers = selectedDepartments.reduce(
      (allMembers, department) => {
        const membersWithManager = department.members.concat(
          department.manager || []
        );
        return [...allMembers, ...membersWithManager];
      },
      []
    );

    const mainDepartmentMembers = mainDepartment
      ? mainDepartment.members.concat(mainDepartment.manager || [])
      : [];

    setMembers([...selectedMembers, ...mainDepartmentMembers]);
  }, [selectedDepartments, mainDepartment]);

  React.useEffect(() => {
    const filteredDepartments = departments.filter(
      (department) => !selectedDepartments.includes(department)
    );
    setAvailableDepartments(filteredDepartments);
  }, [departments, selectedDepartments]);

  const handleFileChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  return (
    <form onSubmit={handleAdd} style={{ marginBottom: 10 }}>
      <DialogHeader
        special
        specialTitle={
          firstPartOK ? (
            <Grid container direction="row" justifyContent="center">
              <Typography sx={{ mr: 1, fontSize: 16, fontWeight: "bold" }}>
                {name}
              </Typography>
              {template && (
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  ({template.title})
                </Typography>
              )}
            </Grid>
          ) : (
            <Grid container direction="row" justifyContent="center">
              <Typography sx={{ mr: 1, fontSize: 16, fontWeight: "bold" }}>
                Novo Projeto
              </Typography>
              {template && (
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  ({template.title})
                </Typography>
              )}
            </Grid>
          )
        }
      />

      <DialogTitle></DialogTitle>

      <DialogContent>
        {/* FIRST PART */}
        {!firstPartOK && (
          <>
            {/* FIRST LINE */}
            <Grid
              sx={{ mt: 2 }}
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ mb: 2 }}
              >
                <Typography sx={{ my: "auto" }}>Criador: </Typography>
                <Typography
                  sx={{ color: "#777", fontWeight: "bold", mx: 1, my: "auto" }}
                >
                  {userName}
                </Typography>
                <Avatar
                  src={`http://localhost:3000/static${userImage}`}
                  sx={{ width: 32, height: 32 }}
                />
                <FormControl sx={{ ml: 2, mt: -2 }}>
                  <FormLabel>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Tipo de Cliente
                    </Typography>
                  </FormLabel>
                  <Select
                    onChange={(e) => setCustomerType(e.target.value)}
                    value={customerType}
                    required
                    size="small"
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <Typography>Tipo de Cliente</Typography>;
                      }

                      return selected;
                    }}
                    sx={{ width: 160 }}
                  >
                    <MenuItem disabled value="">
                      Tipo de Cliente
                    </MenuItem>
                    <MenuItem value={"Empresa"}>Empresa</MenuItem>
                    <MenuItem value={"Pessoa Fisica"}>Pessoa Física</MenuItem>
                  </Select>
                </FormControl>
                {customerType && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel sx={{ ml: 0 }}>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Cliente
                      </Typography>
                    </FormLabel>
                    <Select
                      onChange={(e) => setCustomer(e.target.value)}
                      value={customer}
                      size="small"
                      displayEmpty
                      required
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography>Selecione um Cliente</Typography>;
                        }

                        return selected.name;
                      }}
                      sx={{ width: 200 }}
                    >
                      <MenuItem disabled value="">
                        {customerType === "Empresa"
                          ? "Empresas"
                          : "Clientes Pessoa Física"}
                      </MenuItem>

                      {customerType === "Empresa"
                        ? customers.map((item) => (
                            <MenuItem value={item} key={item._id}>
                              {item.name}
                            </MenuItem>
                          ))
                        : clients.map((item) => (
                            <MenuItem value={item} key={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                )}
                {customer && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Tipo de Projeto
                      </Typography>
                    </FormLabel>
                    <Select
                      onChange={(e) => setType(e.target.value)}
                      value={type}
                      required
                      size="small"
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography>Tipo de Projeto</Typography>;
                        }

                        return selected;
                      }}
                      sx={{ width: 150 }}
                    >
                      <MenuItem disabled value="">
                        Tipo de Projeto
                      </MenuItem>
                      {configData.projectTypes.map((type) => (
                        <MenuItem key value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {customer && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Nome do Projeto
                      </Typography>
                    </FormLabel>
                    <TextField
                      size="small"
                      placeholder="Melhorias, Expansão, Integração, ..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      sx={{ width: 275 }}
                    />
                  </FormControl>
                )}
                {name.length > 0 && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Valor
                      </Typography>
                    </FormLabel>
                    <TextField
                      type="text"
                      size="small"
                      value={price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0 }}>
                            R$
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*\.?\d*$/g.test(inputValue)) {
                          setPrice(inputValue);
                        }
                      }}
                      required
                      variant="outlined"
                      sx={{ width: 120 }}
                    />
                  </FormControl>
                )}
              </Grid>
            </Grid>
            {/* SECOND LINE */}
            <Grid container direction="row">
              <Grid item>
                {name.length > 0 && (
                  <FormControl sx={{ mt: 2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Departamento Principal
                      </Typography>
                    </FormLabel>
                    <Select
                      onChange={(e) => setMainDepartment(e.target.value)}
                      value={mainDepartment}
                      required
                      size="small"
                      displayEmpty={template ? false : true}
                      sx={{ width: 190 }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography>Departamentos</Typography>;
                        }

                        return selected.name;
                      }}
                    >
                      {availableDepartments.map((item) => (
                        <MenuItem value={item} key={item.id}>
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: item.color,
                              }}
                            />
                            <Typography>{item.name}</Typography>
                          </Grid>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item>
                {mainDepartment && (
                  <Grid container direction="row">
                    <Members
                      users={departments.filter(
                        (item) => item !== mainDepartment
                      )}
                      value={selectedDepartments}
                      onChange={setSelectedDepartments}
                      option="projectDepartments"
                      sx={{ mt: 2, width: 300 }}
                    />
                    <FormControl sx={{ mt: 2 }}>
                      <FormLabel>
                        <Typography sx={{ fontSize: 13, color: "#444" }}>
                          Membros do Projeto
                        </Typography>
                      </FormLabel>
                      <Grid
                        container
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: 1,
                          width: 630,
                        }}
                      >
                        {members.map((member, index) => (
                          <Grid
                            key={index}
                            sx={{ m: 1 }}
                            sm={5}
                            md={5}
                            lg={5}
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Avatar
                              alt="Imagem do Colaborador"
                              src={`http://localhost:3000/static/${member.image}`}
                              sx={{ width: 28, height: 28 }}
                            />
                            <Typography sx={{ mx: 0.5, fontSize: 13 }}>
                              {member.name}
                            </Typography>
                            <IconButton
                              sx={{
                                height: 18,
                                maxWidth: 18,
                                color: "white",
                                backgroundColor: "red",
                                borderRadius: 3,
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: "red",
                                },
                              }}
                              onClick={() => handleRemoveMember(member)}
                            >
                              <Typography sx={{ fontWeight: "bold" }}>
                                -
                              </Typography>
                            </IconButton>
                          </Grid>
                        ))}
                      </Grid>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* THIRD LINE */}
            {mainDepartment && (
              <Grid sx={{ mt: 2 }}>
                <FormControl sx={{ width: "85%" }}>
                  <TextField
                    placeholder="Descrição do Projeto"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Prazo"
                    value={dueTo}
                    sx={{ width: 160, ml: 1.5 }}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => setDueTo(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            )}
            {mainDepartment && (
              <Grid sx={{ mt: 4 }}>
                <Grid container direction="row" alignItems="center">
                  <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Anexar Arquivos
                  </Typography>
                  <input
                    type="file"
                    multiple
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="fileInput">
                    <Button
                      variant="outlined"
                      color="primary"
                      component="span"
                      size="small"
                      startIcon={<FileUploadIcon />}
                      sx={{ ml: 1 }}
                    >
                      Enviar
                    </Button>
                  </label>
                  <Grid item>
                    <Grid container direction="row">
                      {attachments.map((file, index) => (
                        <Grid key={index} item sx={{ ml: 1 }}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            sx={{
                              border: "1px solid darkgrey",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              sx={{ fontSize: 13, ml: 1, color: "#777" }}
                            >
                              {file.name}
                            </Typography>

                            <Button
                              size="small"
                              color="error"
                              onClick={() => removeFile(index)}
                              sx={{ mx: -1 }}
                            >
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}
        {/* FIRST PART */}

        {/* SECOND PART */}
        {firstPartOK && !secondPartOK && (
          <ProjectStages
            stages={stages}
            stagesColorSchema={stagesColorSchema}
            updateStages={(newStagesList) => setStages(newStagesList)}
            setStagesSchemaColor={setStagesSchemaColor}
            setDefinedStagesColors={setDefinedStagesColors}
            isTemplate={template ? Boolean(true) : Boolean(false)}
          />
        )}
        {/* SECOND PART */}

        {/* THIRD PART */}
        {secondPartOK && !thirdPartOK && (
          <ProjectStageTasks
            members={members}
            products={products}
            services={services}
            stages={stages}
            definedStagesColors={definedStagesColors}
            addTaskFromParent={handleAddTask}
          />
        )}
        {/* THIRD PART */}

        {/* LAST PART */}
        {thirdPartOK && (
          <ProjectReviewTable
            type={type}
            customer={customer}
            customerType={customerType}
            name={name}
            price={parseFloat(price)}
            mainDepartment={mainDepartment}
            selectedDepartments={selectedDepartments}
            members={members}
            stages={stages}
            recurrent={recurrent}
            setRecurrent={setRecurrent}
            templateName={templateName}
            setTemplateName={setTemplateName}
            description={description}
            isTemplate={template ? Boolean(true) : Boolean(false)}
          />
        )}
        {/* LAST PART */}
      </DialogContent>
      <DialogActions>
        {mainDepartment && description.length > 0 && (
          <>
            {!firstPartOK && !secondPartOK && !thirdPartOK && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => setFirstPartOK(Boolean(true))}
              >
                Prosseguir para "Etapas"
              </Button>
            )}
          </>
        )}
        {firstPartOK && !secondPartOK && !thirdPartOK && (
          <>
            <Button
              variant="contained"
              color="warning"
              startIcon={<KeyboardReturnIcon />}
              onClick={() => setFirstPartOK(Boolean(false))}
            >
              Retornar para "Informações"
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={stages.length <= 1}
              startIcon={<CheckIcon />}
              onClick={() => setSecondPartOK(Boolean(true))}
            >
              Prosseguir para "Tarefas"
            </Button>
          </>
        )}
        {firstPartOK && secondPartOK && !thirdPartOK && (
          <>
            <Button
              variant="contained"
              color="warning"
              startIcon={<KeyboardReturnIcon />}
              onClick={() => setSecondPartOK(Boolean(false))}
            >
              Retornar para "Etapas"
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => setThirdPartOK(Boolean(true))}
            >
              Prosseguir para "Revisão"
            </Button>
          </>
        )}
      </DialogActions>
      {thirdPartOK && (
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            startIcon={<KeyboardReturnIcon />}
            onClick={() => setThirdPartOK(Boolean(false))}
          >
            Retornar para "Tarefas"
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
          >
            Criar Projeto
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenConfirmDialog}
          >
            Cancelar
          </Button>
        </DialogActions>
      )}
      {customer ? (
        <FormEndLineProjectLogo image={customer.image} />
      ) : (
        <FormEndLine />
      )}
    </form>
  );
}
