import { Box, Typography, Paper, Button, LinearProgress, useTheme, useMediaQuery, Chip } from "@mui/material"
import { ArrowUpward, KeyboardArrowDown, Star, StarRounded } from "@mui/icons-material"
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
      elevation={isSelected ? 12 : 2}
      sx={{
        background: getCategoryColor(category),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: isSelected ? "16px solid #FFDE9D" : "3px solid #12447f",
        opacity: isSelected ? 1 : 0.8,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        transform: isSelected ? "scale(1.18)" : "scale(1)",
        zIndex: isSelected ? 1000 : 1,
        "&:hover": {
          transform: isSelected ? "scale(1.02)" : "scale(1) translateY(-4px)",
          boxShadow: isSelected ? 6 : 3,
          opacity: 1,
        },
        position: "relative",
        pt: 2 ,
        overflow: "visible",
        zIndex: isSelected ? 2 : 1,
        marginBottom: 0 ,
      }}
    >
      <Chip
        label={category}
        sx={{
          position: "absolute",
          top: { xs: -10, sm: -12, md: -14, lg: -16 },
          left: { xs: 12, sm: 16, md: 20, lg: 24 },
          color: "white",
          fontWeight: "500",
          letterSpacing: { xs: 1, sm: 1.5, md: 2 },
          fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "18px" },
          background: getCategoryColor(category),
          maxWidth: "90%",
          "& .MuiChip-label": {
            px: { xs: 1, sm: 1.25, md: 1.5, lg: 2 },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }
        }}
      />
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 2, lg: 2 }, 
        display: "flex", 
        flexDirection: "column",
        height: "100%"
      }}>
        <Typography
          variant="body2"
          sx={{
            mb: { xs: 0.5, sm: 1, md: 1, lg: 0 },
            minHeight: { xs: 60, sm: 80, md: 100, lg: 120 },
            flex: "0 0 auto",
            color: "white",
            fontSize: { xs: "18px", sm: "18px", md: "19px", lg: "20px" },
            lineHeight: { xs: 1.5, sm: 1.6, md: 1.7, lg: 1.8 },
          }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          mt: "auto",
          mx: { xs: -1.5, sm: -2, md: -2, lg: -2 },
          mb: { xs: -1.5, sm: -2, md: -2, lg: -2 }
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            mb: 2,
            px: { xs: 1.5, sm: 2, md: 2, lg: 2 }
          }}>
            <Box sx={{ position: 'relative', width: '100%', mr: { xs: 1, sm: 1.5, md: 2, lg: 2.5 } }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: { xs: 16, sm: 18, md: 20, lg: 22 },
                  borderRadius: { xs: 3, sm: 3.5, md: 4, lg: 4 },
                  border: "1px solid #ffffff",
                  bgcolor: "#eeeeee",
                  width: "100%",
                  ".MuiLinearProgress-bar": {
                    bgcolor: "#50b755",
                    borderRadius: { xs: 3, sm: 3.5, md: 4, lg: 4 },
                  },
                }}
              />
              <StarRounded 
                sx={{
                  position: 'absolute',
                  right: `${100 - progressValue}%`,
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  color: '#E79D0D',
                  fontSize: { xs: "34px", sm: "38px", md: "44px", lg: "52px" },
                  filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.3))'
                }}
              />
            </Box>
            <Typography
              variant="caption"
              fontFamily={"Atkinson Hyperlegible"}
              sx={{
                color: "#ffffff",
                minWidth: { xs: 40, sm: 50, md: 60, lg: 70 },
                textAlign: "right",
                fontSize: { xs: "16px", sm: "17px", md: "18px", lg: "20px" },
              }}
            >
              {progress}
            </Typography>
          </Box>
          <Button
            endIcon={
              <ArrowUpward
                sx={{                  
                  fontSize: { xs: "20px", sm: "22px", md: "23px", lg: "24px" },
                }}
              />
            }
            sx={{
              color: "#12447f",
              backgroundColor: "white",
              width: "100%",
              py: { xs: 1, sm: 1.25, md: 1.5, lg: 2 },
              px: { xs: 2, sm: 2.5, md: 3, lg: 1 },
              textAlign: "center",
              justifyContent: "center",
              textTransform: "none",
              fontSize: { xs: "16px", sm: "17px", md: "18px", lg: "20px" },
              fontWeight: "500",
              borderRadius: 0,
              borderBottomLeftRadius: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5 },
              borderBottomRightRadius: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5 },
              "&:hover": {
                backgroundColor: "#f5f5f5",
              }
            }}
            onClick={() => {
              onViewMap(missionId);
              // Encontra o elemento do mapa e rola até ele
              const mapElement = document.getElementById('brazil-map');
              if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
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

