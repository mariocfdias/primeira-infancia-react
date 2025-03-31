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
          p: 1,
          position: "relative",
          mb: 1,
          overflow: "hidden",
          transition: "transform 0.2s ease-in-out",
          opacity: stars === 0 ? 0.7 : 1,
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <img
          src={getCategoryIcon(categoryId)}
          alt={title}
          style={{
            maxWidth: "80%",
            maxHeight: "80%",
            objectFit: "contain",
          }}
        />
        {stars >= 0 && (
          <Box
            sx={{
              position: "relative",
              bottom: 30,
              left: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#213B7B",
              color: "#FFFFFF",
              borderRadius: 300,
              width: { xs: 20, sm: 34 },
              height: { xs: 20, sm: 34 },
              fontSize: { xs: "0.75rem", sm: "1rem" },
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
          fontSize: { xs: "0.65rem", sm: "0.7rem", lg: "1rem" },
          fontWeight: "400",
          display: "block",
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

