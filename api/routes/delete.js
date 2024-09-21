const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");
const { deleteRoutines } = require("../../controllers/functions/deleteRoutines");

// DELETE ITEM
router.delete("/:model/:id", async (req, res) => {
  const { model, id } = req.params;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    await Model.findByIdAndDelete(id);
    deleteRoutines(model, id)
    res.status(200).json("Item deletado com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao deletar o item" });
  }
});

module.exports = router;
