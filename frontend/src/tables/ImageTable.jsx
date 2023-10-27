import * as React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ImageTable() {
  const [files, setFiles] = React.useState([]);
  const [totalSpaceOccupiedMB, setTotalSpaceOccupiedMB] = React.useState(0);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);

  const handleCheckboxChange = (file) => {
    if (selectedImages.includes(file)) {
      setSelectedImages(selectedImages.filter((image) => image !== file));
    } else {
      setSelectedImages([...selectedImages, file]);
    }
  };

  const [multipleDeletionDialogOpen, setMultipleDeletionDialogOpen] =
    React.useState(false);

  const openMultipleDeletionDialog = () => {
    setMultipleDeletionDialogOpen(true);
  };

  const closeMultipleDeletionDialog = () => {
    setMultipleDeletionDialogOpen(false);
  };

  const handleDeleteMultiple = () => {
    if (selectedImages.length > 0) {
      openMultipleDeletionDialog();
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await api.get("/uploads/listFiles");
      setFiles(response.data.files);
      setTotalSpaceOccupiedMB(response.data.totalSpaceMB);
    } catch (error) {
      console.error("Erro ao buscar a lista de arquivos:", error);
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  const deleteFile = async (file) => {
    setSelectedFile(file.name);
    openConfirmationDialog();
  };

  const openConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const confirmDelete = async (filename) => {
    try {
      const response = await api.delete(`/uploads/deleteFile/${filename}`);
      if (response.status === 200) {
        fetchFiles();
        closeConfirmationDialog();
      }
    } catch (error) {
      console.error("Erro ao excluir o arquivo:", error);
    }
  };

  const confirmDeleteMultiple = async (imagesToDelete) => {
    try {
      const response = await api.post("/uploads/deleteMultipleFiles", {
        files: imagesToDelete,
      });

      if (response.status === 200) {
        // Atualize a lista de arquivos após a exclusão bem-sucedida
        fetchFiles();
        closeMultipleDeletionDialog();
        setSelectedImages([]); // Limpe a lista de imagens selecionadas
      }
    } catch (error) {
      console.error("Erro ao excluir as imagens:", error);
    }
  };

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <Grid container direction="row" sx={{ py: 2 }}>
          <Typography sx={{ my: "auto" }}>
            Tamanho em Disco: {totalSpaceOccupiedMB}MB
          </Typography>
          <Grid item sx={{ mt: -1 }}>
            {selectedImages.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<ClearIcon sx={{ mt: -0.5, p:0 }}/>}
                onClick={() => setSelectedImages([])}
                sx={{ mx: 1 }}
              >
                Limpar Seleção
              </Button>
            )}
          </Grid>
          <Grid item sx={{ mt: -1 }}>
            {selectedImages.length > 0 && (
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon sx={{ mt: -0.5 }}/>}
                onClick={handleDeleteMultiple}
              >
                Excluir Selecionados
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {files.map((file) => (
            <Grid key={file._id} item xs={2}>
              <img
                alt="Imagem do Produto"
                src={`http://localhost:3000/static/images/${file.name}`}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Typography sx={{ fontSize: 10 }}>
                {file.name} - {file.sizeKB}KB
              </Typography>
              <Grid container direction="row" sx={{ ml: 1 }}>
                <Checkbox
                  checked={selectedImages.includes(file)}
                  onChange={() => handleCheckboxChange(file)}
                  sx={{ mr: 1, py: 0 }}
                />
                <DeleteIcon
                  color="error"
                  onClick={() => deleteFile(file)}
                  style={{ cursor: "pointer" }}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog
        open={confirmationDialogOpen}
        onClose={closeConfirmationDialog}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja excluir esta imagem?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => confirmDelete(selectedFile)} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={multipleDeletionDialogOpen}
        onClose={closeMultipleDeletionDialog}
        aria-labelledby="multiple-deletion-dialog-title"
      >
        <DialogTitle id="multiple-deletion-dialog-title">
          Confirmação de Deleção Múltipla
        </DialogTitle>
        <DialogContent>
          <Typography>
            Confirma deletar {selectedImages.length} imagem(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMultipleDeletionDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => confirmDeleteMultiple(selectedImages)}
            color="secondary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}