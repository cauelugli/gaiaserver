/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ResolveJobForm = ({
  user,
  selectedItem,
  refreshData,
  setRefreshData,
  setOpenDialog,
  toast,
  successMessage,
}) => {
  const [resolution, setResolution] = React.useState("");

  const handleResolveJob = async () => {
    try {
      const res = await api.put(`/jobs/resolve`, {
        jobId: selectedItem._id,
        user: user.name,
        resolution,
      });
      if (res.data) {
        toast.success(successMessage, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenDialog(false);
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
    <>
      <DialogTitle>Resolver Job: {selectedItem.title}</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Resolução"
          value={resolution}
          required
          onChange={(e) => setResolution(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Grid
          container
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleResolveJob}
            sx={{ mr: 2 }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            X
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

export default ResolveJobForm;
