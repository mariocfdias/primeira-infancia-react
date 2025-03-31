import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material"
import PropTypes from 'prop-types'

export default function EmblemCard({ title, categoryId, stars, color }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  console.log({categoryId})
  
  // Extract category ID from iconUrl or title to use the correct icon
  const getCategoryIcon = (categoryId) => {
    // Try to extract CTG pattern from iconUrl or title

    // If a valid category ID was found, use the corresponding icon
    if (categoryId) {
      return `/icons/${categoryId}.png`
    }
    
    // Fallback to the provided iconUrl or placeholder
    return "/placeholder.svg"
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1/1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.2s ease-in-out",
          width: { xs: 80, sm: 120, lg: 160 },
          height: { xs: 80, sm: 120, lg: 160 },
          m: 0,
          p: 0,
          opacity: stars === 0 ? 0.7 : 1,
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <img
          src={getCategoryIcon(categoryId)}
          alt={title}
          width={useMediaQuery(theme.breakpoints.down("sm")) ? 80 : 120}
          height={useMediaQuery(theme.breakpoints.down("sm")) ? 80 : 120}
          style={{
            objectFit: "contain",
            m: 0,
            p: 0,
          }}
        />
        {stars >= 0 && (
          <Box
            sx={{
              position: "relative",
              bottom: 40,
              left: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#213B7B",
              color: "#FFFFFF",
              borderRadius: 300,
              width: { xs: 20, sm: 34, lg: 40 },
              height: { xs: 20, sm: 34, lg: 40 },
              fontSize: { xs: "0.75rem", sm: "1rem", lg: "1.5rem" },
              fontWeight: "bold",
            }}
          >
            {stars}
          </Box>
        )}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: "#525252",
          position: "relative",
          top: -30,
          fontSize: { xs: "0.65rem", sm: "0.7rem", lg: "20px" },
          fontWeight: "400",
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}

EmblemCard.propTypes = {
  title: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

