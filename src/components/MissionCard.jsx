import { Box, Typography, Paper, Button, LinearProgress, useTheme, useMediaQuery, Chip } from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"
import PropTypes from 'prop-types'
import React from 'react'

function MissionCard({ category, title, progress, missionId, onViewMap, isSelected }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getCategoryColor = (category) => {
    if (category.includes("AMPLIAÇÃO")) return "linear-gradient(to right, #1C434F, #0A5166)"
    if (category.includes("FORTALECIMENTO")) return "linear-gradient(to right, #3D5E85, #5E7DA0)"
    if (category.includes("MELHORIA")) return "linear-gradient(to right, #256F93, #5B97B5)"
    return "#333333"
  }

  const progressValue = (Number.parseInt(progress.split("/")[0]) / Number.parseInt(progress.split("/")[1])) * 100

  return (
    <Paper
      elevation={isSelected ? 6 : 2}
      sx={{
        background: getCategoryColor(category),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: isSelected ? "2px solid #12447f" : "1px solid #d3d3d3",
        borderRadius: 1,
        transition: "all 0.2s ease-in-out",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        opacity: isSelected ? 1 : 0.7,
        "&:hover": {
          transform: isSelected ? "scale(1.02)" : "translateY(-4px)",
          boxShadow: isSelected ? 6 : 3,
          opacity: 1,
        },
        position: "relative",
        pt: 2,
        overflow: "visible",
        zIndex: isSelected ? 2 : 1,
        marginBottom: 1.5,
      }}
    >
      <Chip
        label={category}
        sx={{
          position: "absolute",
          top: -12,
          left: 16,
          color: "white",
          fontWeight: "medium",
          fontSize: { xs: "0.65rem", sm: "0.75rem" },
          background: getCategoryColor(category),
          "& .MuiChip-label": {
            px: 1,
          }
        }}
      />
      <Box sx={{ p: { xs: 1.5, sm: 2 }, paddingBottom: { xs: 0, sm: 0 }, display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            minHeight: { xs: 60, sm: 80 },
            flex: 1,
            color: "white",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            lineHeight: 1.5,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ mb: 0, mx: -2, mt: 'auto' }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5, px: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: { xs: 6, sm: 8 },
                borderRadius: 4,
                bgcolor: "#eeeeee",
                width: "100%",
                mr: 1,
                ".MuiLinearProgress-bar": {
                  bgcolor: "#50b755",
                  borderRadius: 4,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#525252",
                minWidth: 40,
                textAlign: "right",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
              }}
            >
              {progress}
            </Typography>
          </Box>
          <Button
            endIcon={
              <KeyboardArrowDown
                sx={{
                  transform: "rotate(180deg)",
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                }}
              />
            }
            sx={{
              color: "#12447f",
              backgroundColor: "white",
              width: "100%",
              py: 1,
              px: 2,
              textAlign: "center",
              justifyContent: "center",
              textTransform: "none",
              fontSize: { xs: "0.85rem", sm: "1rem" },
              fontWeight: "500",
              borderRadius: 0,
              borderBottomLeftRadius: 1,
              borderBottomRightRadius: 1,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => onViewMap(missionId)}
          >
            {isSelected ? 'Mostrando no mapa' : 'Ver no mapa'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

MissionCard.propTypes = {
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  progress: PropTypes.string.isRequired,
  missionId: PropTypes.string.isRequired,
  onViewMap: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
}

MissionCard.defaultProps = {
  isSelected: false
}

export default React.memo(MissionCard, (prevProps, nextProps) => {
  return prevProps.isSelected === nextProps.isSelected && prevProps.progress === nextProps.progress;
})

