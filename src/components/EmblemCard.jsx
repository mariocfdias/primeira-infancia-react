import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material"
import { Star } from "@mui/icons-material"
import PropTypes from 'prop-types'

export default function EmblemCard({ title, iconUrl, stars, color }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box sx={{ textAlign: "center" }}>
      <Paper
        elevation={stars > 0 ? 3 : 1}
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
          bgcolor: stars > 0 ? color : "white",
          border: stars > 0 ? "none" : "1px solid #d3d3d3",
          borderRadius: "50%",
          overflow: "hidden",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <img
          src={iconUrl || "/placeholder.svg"}
          alt={title}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "contain",
            filter: stars > 0 ? "brightness(0) invert(1)" : "none",
          }}
        />
        {stars > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 5,
              display: "flex",
              gap: 0.25,
            }}
          >
            {[...Array(stars)].map((_, i) => (
              <Star key={i} sx={{ color: "#f5d664", fontSize: { xs: "0.75rem", sm: "1rem" } }} />
            ))}
          </Box>
        )}
      </Paper>
      <Typography
        variant="caption"
        sx={{
          color: "#525252",
          fontSize: { xs: "0.65rem", sm: "0.7rem" },
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
  iconUrl: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

