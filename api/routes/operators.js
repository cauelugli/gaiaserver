const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Role = require("../models/Role");
const User = require("../models/User");
const Manager = require("../models/Manager");

// UPDATE OPERATOR
router.put("/", async (req, res) => {
  const { username } = req.body;

  let type;

  req.body.operator.position ? (type = User) : (type = Manager);

  const userExists = await User.findOne({ username });
  const managerExists = await Manager.findOne({ username });

  if (userExists || managerExists) {
    return res.status(422).json({ error: "Nome de Operador já cadastrado" });
  }

  if (req.body.option === "delete") {
    try {
      const updatedOperator = await type.findByIdAndUpdate(
        req.body.operatorId,
        {
          $unset: {
            username: 1,
            password: 1,
          },
        },
        { new: true }
      );

      await Role.findByIdAndUpdate(req.body.operator.role.id, {
        $pull: { members: req.body.operatorId },
      });

      return res.status(200).json(updatedOperator);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  if (req.body.option === "password") {
    if (req.body.password && !req.body.username) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      try {
        const updatedOperator = await type.findByIdAndUpdate(
          req.body.operatorId,
          {
            password: hashedPass,
          },
          { new: true }
        );
        res.status(200).json(updatedOperator);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const updatedOperator = await type.findByIdAndUpdate(
          req.body.operatorId,
          {
            username: req.body.username,
            password: hashedPass,
            role: req.body.role,
          },
          { new: true }
        );
        await Role.findByIdAndUpdate(req.body.role.id, {
          $addToSet: { members: req.body.operatorId },
        });

        res.status(200).json(updatedOperator);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  }

  if (req.body.option === "operator") {
    try {
      const updatedOperator = await type.findByIdAndUpdate(
        req.body.operatorId,
        {
          username: req.body.username,
          role: req.body.role,
        },
        { new: true }
      );

      if (req.body.role.id !== req.body.operator.role.id) {
        await Role.findByIdAndUpdate(req.body.operator.role.id, {
          $pull: { members: req.body.operatorId },
        });

        await Role.findByIdAndUpdate(req.body.role.id, {
          $addToSet: { members: req.body.operatorId },
        });
      }

      res.status(200).json(updatedOperator);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

module.exports = router;
