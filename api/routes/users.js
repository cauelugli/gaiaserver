const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");
const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE USER
router.post("/", async (req, res) => {
  try {
    const existingNameUser = await User.findOne({ name: req.body.name });
    const existingEmailUser = await User.findOne({ email: req.body.email });

    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Usuário já cadastrado" });
    }
    if (existingEmailUser) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }

    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      department: req.body.department,
      email: req.body.email,
      image: req.body.image,
      position: req.body.position,
      role: req.body.role,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
    });
    const savedUser = await newUser.save();

    if (req.body.department.name) {
      await Department.findOneAndUpdate(
        { _id: req.body.department.id },
        {
          $addToSet: {
            members: {
              id: savedUser._id.toString(),
              name: savedUser.name,
              phone: savedUser.phone,
              email: savedUser.email,
              image: savedUser.image,
              position: savedUser.position,
              role: savedUser.role,
            },
          },
        },
        { upsert: true }
      );
    }

    if (req.body.position.name) {
      await Position.findOneAndUpdate(
        { _id: req.body.position._id },
        {
          $addToSet: {
            members: savedUser._id.toString(),
          },
        },
        { upsert: true }
      );
    }

    const newUserPreferences = new UserPreferences({ userId: savedUser._id });
    const savedUserPreferences = await newUserPreferences.save();

    res.status(200).json({ savedUser, savedUserPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    const updatedDepartment = await Department.findOneAndUpdate(
      { "members.id": userId },
      { $pull: { members: { id: userId } } },
      { new: true }
    );
    const deletedPreferences = await UserPreferences.findOneAndDelete({
      userId: userId,
    });

    if (deletedUser.position.name) {
      await Position.findOneAndUpdate(
        { _id: deletedUser.position._id },
        {
          $pull: {
            members: userId.toString(),
          },
        },
        { upsert: true }
      );
    }

    res
      .status(200)
      .json({ deletedUser, deletedPreferences, updatedDepartment });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE USER
router.put("/", async (req, res) => {
  const { name, email, option, isManager } = req.body;
  const position = { _id: req.body.position._id, name: req.body.position.name };

  const existingName = await User.findOne({ name });
  const existingEmail = await User.findOne({ email });

  if (existingName) {
    if (existingName.name !== req.body.previousData.name) {
      return res.status(422).json({ error: "Nome já cadastrado" });
    }
  }
  if (existingEmail) {
    if (existingEmail.email !== req.body.previousData.email) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }
  }

  if (req.body.position.name) {
    if (
      req.body.previousData.position &&
      req.body.previousData.position.name &&
      req.body.previousData.position._id !== position._id
    ) {
      await Position.findOneAndUpdate(
        { _id: position._id },
        {
          $addToSet: {
            members: req.body.userId.toString(),
          },
        },
        { upsert: true }
      );

      await Position.findOneAndUpdate(
        { _id: req.body.previousData.position._id },
        {
          $pull: {
            members: req.body.userId.toString(),
          },
        },
        { upsert: true }
      );
    } else {
      await Position.findOneAndUpdate(
        { _id: position._id },
        {
          $addToSet: {
            members: req.body.userId.toString(),
          },
        },
        { upsert: true }
      );
    }
  }

  try {
    let updateFields = {};

    if (option === "account") {
      updateFields = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
      };
    } else {
      updateFields = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        department: req.body.department,
        position: position,
        role: req.body.role,
      };
      if (req.body.department) {
        updateFields.department = req.body.department;
        updateFields.position = position;
        updateFields.role = req.body.role;
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.body.userId,
      updateFields,
      { new: true }
    );

    let updatedDepartment;

    if (option !== "account" && req.body.department) {
      updatedUser.department.id
        ? updatedUser.department.id && req.body.previousData.department
          ? updatedUser.department.id === req.body.previousData.department.id
            ? // SAME DEPT, UPDATES ONLY NEW DEPARTMENT
              (updatedDepartment = await Department.findOneAndUpdate(
                {
                  _id: req.body.department.id,
                  "members.id": req.body.userId,
                },
                {
                  $set: {
                    "members.$.name": req.body.name,
                    "members.$.phone": req.body.phone,
                    "members.$.email": req.body.email,
                    "members.$.position": position,
                    "members.$.image": req.body.image,
                    "members.$.role": req.body.role,
                  },
                },
                { new: true }
              ))
            : // CHANGING DEPTs, UPDATES PREVIOUS AND NEW DEPARTMENT
              (await Department.findOneAndUpdate(
                { "members.id": req.body.userId },
                { $pull: { members: { id: req.body.userId } } }
              ),
              (updatedDepartment = await Department.findByIdAndUpdate(
                req.body.department.id,
                {
                  $push: {
                    members: {
                      id: updatedUser.id,
                      name: updatedUser.name,
                      email: updatedUser.email,
                      phone: updatedUser.phone,
                      image: updatedUser.image,
                      position: position,
                      role: updatedUser.role,
                    },
                  },
                },
                { new: true }
              )))
          : // ADDS MEMBER, BECAUSE USER NEVER HAD A DEPT PREVIOUSLY
            (updatedDepartment = await Department.findByIdAndUpdate(
              req.body.department.id,
              {
                $push: {
                  members: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    position: position,
                    image: updatedUser.image,
                    role: updatedUser.role,
                  },
                },
              },
              { new: true }
            ))
        : "";
    }

    res.status(200).json({ updatedUser, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET USER'S NOTIFICATIONS
router.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Substitua a linha abaixo pela lógica real para obter as notificações do usuário
    const userNotifications = await User.findById(userId).select(
      "notifications"
    );

    res.json(userNotifications.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// MARK NOTIFICATION AS READ
router.put("/readNotification", async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.notifications[notificationId]) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    user.notifications[notificationId].status = "Lida";
    user.markModified("notifications");
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

// MARK ALL NOTIFICATIONS AS READ
router.put("/markAllAsRead", async (req, res) => {
  try {
      const { userId } = req.body;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
      }

      Object.keys(user.notifications).forEach(key => {
          user.notifications[key].status = "Lida";
      });

      user.markModified("notifications");
      await user.save();

      return res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// UPDATE USER'S PROFILE PICTURE
router.put("/changeProfilePicture", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { image: req.body.image },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a imagem de perfil." });
  }
});

// CHANGE USER PASSWORD ON FIRST ACCESS
router.put("/changePassFirstAccess", async (req, res) => {
  const userId = req.body.userId;
  let user;

  user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPass;
    user.isFirstAccess = false;

    await user.save();

    res.status(200).json({
      message: "Senha atualizada com sucesso e acesso inicial removido.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
