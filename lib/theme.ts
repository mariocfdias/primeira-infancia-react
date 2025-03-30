import { createTheme, responsiveFontSizes } from "@mui/material/styles"

let theme = createTheme({
  palette: {
    primary: {
      main: "#12447f",
      light: "#3a6ca8",
      dark: "#0d3666",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#27884a",
      light: "#4ca96c",
      dark: "#1b6a39",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#525252",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
        },
        contained: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        elevation1: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        },
        elevation2: {
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#d3d3d3",
            },
            "&:hover fieldset": {
              borderColor: "#b3b3b3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#12447f",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#d3d3d3",
            },
            "&:hover fieldset": {
              borderColor: "#b3b3b3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#12447f",
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#eeeeee",
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
})

// Apply responsive font sizes
theme = responsiveFontSizes(theme)

export default theme

