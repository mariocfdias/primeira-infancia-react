"use client"

import { Box, useTheme, useMediaQuery } from "@mui/material"

export default function BrazilMap() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/placeholder.svg?height=500&width=400"
        alt="Mapa do Brasil"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          maxHeight: isMobile ? "280px" : "480px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9f9f9f",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          textAlign: "center",
          p: 2,
        }}
      >
        Mapa interativo do Brasil
      </Box>
    </Box>
  )
}

