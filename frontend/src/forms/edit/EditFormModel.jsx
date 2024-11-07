/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";

import ImageTableCell from "../../components/tableCells/ImageTableCell";
import DialogHeader from "../../components/small/DialogHeader";

import TableCellOptions from "../../options/tableCellOptions";

export default function EditFormModel(props) {
  const [fields, setFields] = React.useState(props.options.fields);
  const [image, setImage] = React.useState(
    props.target.image
      ? `http://localhost:3000/static/${props.target.image}`
      : ""
  );
  //fix this
  // eslint-disable-next-line no-unused-vars
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [positions, setPositions] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [priceDifference, setPriceDifference] = React.useState({});
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [okToDispatch, setOkToDispatch] = React.useState(false);

  // updating value from child modifications
  React.useEffect(() => {}, [priceDifference]);

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await api.get("/get", {
          params: { model: "Department" },
        });
        const positions = await api.get("/get", {
          params: { model: "Position" },
        });
        const users = await api.get("/get", {
          params: { model: "User" },
        });
        setDepartments(departments.data);
        setPositions(positions.data);
        setMembers(users.data.filter((user) => !user.isManager));
        setManagers(users.data.filter((user) => user.isManager));
      } catch (error) {
        console.error("Erro ao buscar departamentos:", error);
        toast.error("Erro ao buscar departamentos. Tente novamente.", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    };

    fetchDepartments();
  }, []);

  // Initializing form with target data
  React.useEffect(() => {
    const initializeFields = () => {
      const initialFields = {};
      props.options.fields.forEach((field) => {
        const fieldValue = props.target[field.name] || "";

        if (field.name === "department" && typeof fieldValue === "string") {
          const department = departments.find((dep) => dep._id === fieldValue);
          initialFields[field.name] = department ? department.name : "";
        } else if (
          field.name === "position" &&
          typeof fieldValue === "string"
        ) {
          const position = positions.find((pos) => pos._id === fieldValue);
          initialFields[field.name] = position ? position.name : "";
        } else if (field.name === "manager" && typeof fieldValue === "string") {
          const manager = managers.find(
            (manager) => manager._id === fieldValue
          );
          initialFields[field.name] = manager ? manager : "";
        } else if (field.name === "members") {
          const membersFound = fieldValue.map((memberId) => {
            return members.find((member) => member._id === memberId) || null;
          });
          initialFields[field.name] = membersFound.filter(
            (member) => member !== null
          );
        } else {
          initialFields[field.name] = fieldValue;
        }
      });
      setFields(initialFields);
    };

    initializeFields();
  }, [
    props.options.fields,
    props.target,
    departments,
    positions,
    managers,
    members,
  ]);

  const modalOptions = props.options;

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageRemove = () => {
    setImage("");
  };

  const handleChange = (fieldName) => (e) => {
    setFields({
      ...fields,
      [fieldName]: e.target.value,
    });
  };

  const handleMemberChange = (members) => {
    setSelectedMembers(members);
  };

  const handleProductChange = (product, count) => {
    setSelectedProducts((prev) => {
      const existingProductIndex = prev.findIndex(
        (p) => p.name === product.name
      );

      let newState;
      if (existingProductIndex !== -1) {
        if (count > 0) {
          const updatedProducts = [...prev];
          updatedProducts[existingProductIndex].count = count;
          newState = updatedProducts;
        } else {
          newState = prev.filter((p) => p.name !== product.name);
        }
      } else {
        if (count > 0) {
          newState = [...prev, { ...product, count }];
        } else {
          newState = prev;
        }
      }

      return newState;
    });
  };

  const handleServiceChange = (service, count) => {
    setSelectedServices((prev) => {
      const existingServiceIndex = prev.findIndex(
        (s) => s.name === service.name
      );

      let newState;
      if (existingServiceIndex !== -1) {
        if (count > 0) {
          const updatedServices = [...prev];
          updatedServices[existingServiceIndex].count = count;
          newState = updatedServices;
        } else {
          newState = prev.filter((p) => p.name !== service.name);
        }
      } else {
        if (count > 0) {
          newState = [...prev, { ...service, count }];
        } else {
          newState = prev;
        }
      }

      return newState;
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    const selectedMemberIds = selectedMembers.map((member) => member._id);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.put("/edit", {
        sourceId: props.userId,
        prevData: props.target,
        fields,
        label: modalOptions.label,
        image: imagePath ? imagePath : props.target.image,
        model: modalOptions.model,
        selectedProducts,
        selectedMembers: selectedMemberIds,
        previousMembers: props.target["members"],
        services: selectedServices,
        createdBy: props.userName || "Admin",
        isManager: modalOptions.label === "Colaborador" && props.tabIndex === 1,
        price:
          modalOptions.label === "Venda"
            ? selectedProducts
                .reduce(
                  (sum, product) => sum + product.sellValue * product.count,
                  0
                )
                .toFixed(2) || 0
            : modalOptions.label === "Job"
            ? fields.service.price
            : modalOptions.label === "Plano de Serviços"
            ? selectedServices
                .reduce(
                  (sum, service) => sum + service.price * service.count,
                  0
                )
                .toFixed(2) || 0
            : fields.price,
        finalPrice,
      });
      if (res.data) {
        toast.success(`${modalOptions.label} Editado!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.setOpenDialog(!props.openDialog);
      !props.setRefreshData(!props.refreshData);
    } catch (err) {
      if (
        (err && err.response && err.response.status === 422) ||
        (err && err.response && err.response.status === 420)
      ) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        console.log("err", err);
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogHeader
        title={modalOptions.label}
        femaleGender={modalOptions.femaleGender}
        extraSmall
        isEditing
      />
      <DialogContent>
        {modalOptions.fieldsSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
              {section.name !== "image" && section.label}
            </Typography>
            {section.name === "image" && (
              <ImageTableCell
                image={image}
                onImageChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setImage(selectedImage);
                }}
                onImageRemove={handleImageRemove}
                onImageClick={handleImageClick}
              />
            )}
            <Grid container direction="row">
              {modalOptions.fields
                .filter(
                  (field) =>
                    field.fieldSection ===
                    modalOptions.fieldsSections[sectionIndex].name
                )
                .map((field, fieldIndex) => (
                  <Grid
                    item
                    key={fieldIndex}
                    sx={{
                      mr: field.type === "servicesList" ? 0 : 1,
                      mb: fieldIndex === 0 ? 1 : 0,
                      width: field.type === "productList" ? "100%" : "auto",
                    }}
                  >
                    <TableCellOptions
                      field={field}
                      fields={fields}
                      handleChange={handleChange}
                      modalOptions={modalOptions}
                      setFields={setFields}
                      handleMemberChange={handleMemberChange}
                      handleProductChange={handleProductChange}
                      handleServiceChange={handleServiceChange}
                      selectedMembers={selectedMembers}
                      selectedProducts={selectedProducts}
                      selectedServices={selectedServices}
                      priceDifference={priceDifference}
                      setPriceDifference={setPriceDifference}
                      setFinalPrice={setFinalPrice}
                      setOkToDispatch={setOkToDispatch}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={
            modalOptions.label === "Plano de Serviços" &&
            (selectedServices.length === 0 ||
              (Object.keys(priceDifference).length !== 0 && !okToDispatch))
          }
        >
          OK
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => props.setOpenDialog(!props.openDialog)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
