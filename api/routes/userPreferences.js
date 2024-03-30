const express = require("express");
const router = express.Router();
const UserPreferences = require("../models/UserPreferences");

// GET USER PREFERENCES
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const userPreferences = await UserPreferences.findOne({ userId: userId });

    res.status(200).json(userPreferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ADD USER SHORTCUT
router.put("/addShortcut", async (req, res) => {
  const { userId, newShortcutName, newShortcutAction } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });

    if (!userPreferences) {
      return res.status(404).json({ error: "User preferences not found." });
    }

    const newShortcut = {
      name: newShortcutName,
      action: newShortcutAction.action,
      isActive: true,
      fullWidth: newShortcutAction.fullWidth,
      maxWidth: newShortcutAction.maxWidth,
    };

    userPreferences.userShortcuts.push(newShortcut);
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Shortcut added successfully", newShortcut });
  } catch (error) {
    console.error("Error adding user shortcut:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE USER SHORTCUT
router.put("/deleteShortcut", async (req, res) => {
  const { userId, shortcutName } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });

    if (!userPreferences) {
      return res.status(404).json({ error: "User preferences not found." });
    }

    const shortcutIndex = userPreferences.userShortcuts.findIndex(shortcut => shortcut.name === shortcutName);
    if (shortcutIndex !== -1) {
      userPreferences.userShortcuts.splice(shortcutIndex, 1);

      await userPreferences.save();
      res.status(200).json({ message: "Shortcut deleted successfully" });
    } else {
      res.status(404).json({ error: "Shortcut not found." });
    }
  } catch (error) {
    console.error("Error deleting user shortcut:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
