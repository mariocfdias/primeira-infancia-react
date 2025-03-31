import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from 'prop-types';

export default function MapLegend({ selectedMissao }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Only render the legend outside the map on mobile
  if (!isMobile) return null;
  
  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 1.5, sm: 2 },
        maxWidth: { xs: "100%", sm: 400 },
        mb: 4,
        border: "1px solid #d3d3d3",
        borderRadius: 1,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: "medium",
          mb: 1,
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        {selectedMissao ? "Legenda de Missão" : "Legenda"}
      </Typography>
      {selectedMissao ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#12447F",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              Missão Concluída
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#72C576",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              Missão em Andamento
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#9F9F9F",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              Missão Pendente
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#707070",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              89
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Não iniciado (0 pontos)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#50B755",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              135
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Nível 1
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#525252",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                1 até 100 pontos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#066829",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              30
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Nível 2
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#525252",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                101 a 199 pontos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#12447f",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              2
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Concluído
              </Typography>
              <Box
                sx={{
                  width: { xs: 10, sm: 12 },
                  height: { xs: 10, sm: 12 },
                  bgcolor: "#f5d664",
                  borderRadius: "50%",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#525252",
                  ml: 0.5,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                200+ pontos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "white",
                border: "1px solid #d3d3d3",
                color: "#525252",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              10
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Não aderiu o Pacto
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

MapLegend.propTypes = {
  selectedMissao: PropTypes.string
}; 