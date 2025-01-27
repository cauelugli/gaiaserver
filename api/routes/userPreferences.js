const express = require("express");
const router = express.Router();
const UserPreferences = require("../../models/models/UserPreferences");

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
  const {
    userId,
    newShortcutName,
    newShortcutAction,
    newShortcutSelectedItem,
  } = req.body;

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
      permission: newShortcutAction.permission,
      selectedItem: newShortcutSelectedItem,
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

    const shortcutIndex = userPreferences.userShortcuts.findIndex(
      (shortcut) => shortcut.name === shortcutName
    );
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

// UPDATE DARK MODE
router.put("/darkMode", async (req, res) => {
  const { userId, darkMode } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });
    userPreferences.darkMode = darkMode;
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Dark mode updated successfully", darkMode });
  } catch (error) {
    console.error("Error updating dark mode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE FONT FAMILY
router.put("/fontFamily", async (req, res) => {
  const { userId, fontFamily } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });
    userPreferences.fontFamily = fontFamily;
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "FontFamily updated successfully", fontFamily });
  } catch (error) {
    console.error("Error updating FontFamily:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE PALETTE COLOR
router.put("/paletteColor", async (req, res) => {
  const { userId, paletteColor } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });
    userPreferences.paletteColor = paletteColor;
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Palette Color updated successfully", paletteColor });
  } catch (error) {
    console.error("Error updating palette color:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE BAR POSITION
router.put("/barPosition", async (req, res) => {
  const { userId, barPosition } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });
    userPreferences.barPosition = barPosition;
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Bar position updated successfully", barPosition });
  } catch (error) {
    console.error("Error updating dark mode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE TABLE OR CARD VIEW
router.put("/tableOrCardView", async (req, res) => {
  const { userId, tableOrCardView } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });
    userPreferences.tableOrCardView = tableOrCardView;
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Table/Card view updated successfully", tableOrCardView });
  } catch (error) {
    console.error("Error updating tableCard view:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE CARD SIZE
router.put("/cardSize", async (req, res) => {
  const { userId, cardSize } = req.body;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: userId });
    userPreferences.cardSize = cardSize;
    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Card Size updated successfully", cardSize });
  } catch (error) {
    console.error("Error updating tableCard view:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
