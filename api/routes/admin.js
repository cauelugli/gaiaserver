const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../../models/models/Admin");
const UserPreferences = require("../../models/models/UserPreferences");

// CREATE ADMIN USER
router.post("/createAdminUser", async (req, res) => {
  const existingAdmin = await Admin.findOne({ username: "admin" });

  if (existingAdmin) {
    return res.status(422).json({ error: "Já existe um Admin Cadastrado" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new Admin({
      password: hashedPass,
    });

    try {
      const savedUser = await newUser.save();
      const newUserPreferences = new UserPreferences({ userId: savedUser._id });
      const savedUserPreferences = await newUserPreferences.save();

      res.status(200).json({ savedUser, savedUserPreferences });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// UPDATE ADMIN'S PROFILE PICTURE
router.put("/changeProfilePicture", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      {},
      { image: req.body.image },
      { new: true }
    );
    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a imagem de perfil." });
  }
});

module.exports = router;
