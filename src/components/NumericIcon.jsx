import { Box, Typography } from "@mui/material"
import PropTypes from 'prop-types'

export default function NumericIcon({ icon, number, description, sx }) {
  return (
    <Box sx={{ 
      display: "flex", 
      alignItems: "center",
      gap: 2
          }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", ...sx }}>
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            lineHeight: 1
          }}
        >
          {number}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#525252",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

NumericIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  description: PropTypes.string.isRequired
} 