import axios from "axios";
import { createTheme } from "@mui/material/styles";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const getUserPreferences = async () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userData?._id;
  const userPreferences = await api.get(`/userPreferences/${userId}`);
  return {
    paletteColor: userPreferences.data?.paletteColor || "#ffffff",
    fontFamilyTitle:
      userPreferences.data?.fontFamilyTitle || "Arial, sans-serif",
    fontFamilyRest: userPreferences.data?.fontFamilyRest || "Arial, sans-serif",
  };
};

const userPreferences = await getUserPreferences();
const userPaletteColor = userPreferences.paletteColor;
const userFontFamilyTitle = userPreferences.fontFamilyTitle.value;
const userFontFamilyRest = userPreferences.fontFamilyRest.value;

const commonThemeSettings = {
  typography: {
    fontFamily: userFontFamilyRest,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: userFontFamilyRest,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonThemeSettings,
  palette: {
    mode: "light",
    background: {
      default: userPaletteColor,
      paper: userPaletteColor,
    },
  },
  components: {
    ...commonThemeSettings.components,
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: userFontFamilyRest, 
          "&#title": {
            fontFamily: userFontFamilyTitle,
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.noHoverBackground": {
            backgroundColor: userPaletteColor,
            "&:hover": {
              backgroundColor: "none",
            },
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...commonThemeSettings,
  palette: {
    mode: "dark",
    background: {
      default: userPaletteColor,
      paper: userPaletteColor,
    },
  },
  components: {
    ...commonThemeSettings.components,
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: userFontFamilyRest,
          "&#title": {
            fontFamily: userFontFamilyTitle,
          },
        },
      },
    },
  },
});
