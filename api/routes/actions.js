const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");
const dayjs = require("dayjs");

// USER - MARK SINGLE NOTIFICATION AS READ
router.put("/markNotificationAsRead", async (req, res) => {
  const { userId, notificationCreatedAt } = req.body;
  const Model = defineModel("User");

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedUser = await Model.findOneAndUpdate(
      { _id: userId, "notifications.createdAt": notificationCreatedAt },
      {
        $set: { "notifications.$.read": true },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Notificação não encontrada" });
    }

    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao atualizar notificação" });
  }
});

// USER - DELETE SINGLE NOTIFICATION
router.put("/deleteNotification", async (req, res) => {
  // in the future, as a company, we will send this somewhere, instead of deleting
  const { userId, notificationCreatedAt } = req.body;
  const Model = defineModel("User");

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedUser = await Model.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { notifications: { createdAt: notificationCreatedAt } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Notificação não encontrada" });
    }

    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao atualizar notificação" });
  }
});

// USER - MARK ALL NOTIFICATIONS AS READ
router.put("/markAllAsRead", async (req, res) => {
  const { userId } = req.body;
  const Model = defineModel("User");

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      {
        $set: { "notifications.$[].read": true },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Notificação não encontrada" });
    }

    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao atualizar notificação" });
  }
});

// REQUEST - RESOLVE ITEM
router.put("/resolve", async (req, res) => {
  const { model, id, resolvedBy, resolvedAt } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Resolvido",
        resolvedBy,
        resolvedAt: resolvedAt || dayjs().format("DD/MM/YYYY HH:mm"),
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.status(200).json("Item resolvido com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao resolver o item" });
  }
});

// REQUEST - REQUEST APPROVAL
router.put("/requestApproval", async (req, res) => {
  const { model, id, requestedBy, requestedAt } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Aprovação Solicitada",
        $push: {
          interactions: {
            activity: "Solicitação de Aprovação",
            attachments: [],
            date: requestedAt || dayjs().format("DD/MM/YYYY HH:mm"),
            number: null,
            reactions: {
              dislike: { quantity: 0, usersReacted: [] },
              haha: { quantity: 0, usersReacted: [] },
              like: { quantity: 0, usersReacted: [] },
              love: { quantity: 0, usersReacted: [] },
            },
            user: requestedBy,
          },
        },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.status(200).json("Item resolvido com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao resolver o item" });
  }
});

module.exports = router;
