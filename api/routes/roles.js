const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const User = require("../models/User");
const Manager = require("../models/Manager");

// GET ALL ROLES
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE ROLE
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (name === "Admin") {
    return res
      .status(420)
      .json({ error: "Não é possível nomear para 'Admin'." });
  }
  const existingName = await Role.findOne({ name });
  if (existingName) {
    return res.status(422).json({ error: "Nome de Perfil já cadastrado" });
  }
  const newRole = new Role(req.body);
  try {
    const savedRole = await newRole.save();
    res.status(200).json(savedRole);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE ROLE
router.delete("/:id", async (req, res) => {
  const roleId = req.params.id;
  try {
    const deletedRole = await Role.findByIdAndDelete(roleId);
    const usersToUpdate = await User.find({ 'role.id': roleId });
    for (const user of usersToUpdate) {
      user.role = { id: null, name: "-" };
      await user.save();
    }
    const managersToUpdate = await Manager.find({ 'role.id': roleId });
    for (const manager of managersToUpdate) {
      manager.role = { id: null, name: "-" };
      await manager.save();
    }
    res.status(200).json(deletedRole);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE ROLE
router.put("/", async (req, res) => {
  const { name, roleId } = req.body;

  if (name === "Admin") {
    return res
      .status(420)
      .json({ error: "Não é possível nomear para 'Admin'." });
  }
  const existingName = await Role.findOne({ name });

  if (existingName && existingName.name !== req.body.previousData.name) {
    return res.status(422).json({ error: "Nome de Perfil já cadastrado" });
  }

  try {
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { name: name },
      { new: true }
    );

    const usersToUpdate = await User.find({ 'role.id': roleId });
    for (const user of usersToUpdate) {
      user.role = { id: roleId, name: name };
      await user.save();
    }
    const managersToUpdate = await Manager.find({ 'role.id': roleId });
    for (const manager of managersToUpdate) {
      manager.role = { id: roleId, name: name };
      await manager.save();
    }

    res.status(200).json(updatedRole);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
