import { Box, Typography, Paper, Chip } from "@mui/material"
import { Star } from "@mui/icons-material"
import PropTypes from 'prop-types'


export default function ProgressUpdate({ city, mission, points, badge, date, isMobile = false }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: "1px solid #d3d3d3",
        borderRadius: 1,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "flex-start" },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            bgcolor: "#12447f",
            color: "white",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            mr: { xs: 0, sm: 1.5 },
            mt: { xs: 0, sm: 0.5 },
            flexShrink: 0,
          }}
        >
          {city.substring(0, 2).toUpperCase()}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              lineHeight: 1.5,
            }}
          >
            <Box component="span" sx={{ fontWeight: "medium" }}>
              Prefeitura de {city}
            </Box>{" "}
            concluiu a missão "{mission}" e ganhou{" "}
            <Box
              component="span"
              sx={{
                color: "#e79d0d",
                fontWeight: "medium",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Star
                sx={{
                  color: "#f5d664",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  mr: 0.25,
                }}
              />
              {points} pontos
            </Box>{" "}
            e um emblema de{" "}
            <Chip
              label={badge}
              size="small"
              sx={{
                bgcolor: "#27884a",
                color: "white",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                height: "auto",
                py: 0.25,
                fontWeight: "medium",
                ml: 0.5,
              }}
            />
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#8d8d8d",
              display: "block",
              textAlign: "right",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
            }}
          >
            {date}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

ProgressUpdate.propTypes = {
  city: PropTypes.string.isRequired,
  mission: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  badge: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isMobile: PropTypes.bool
}

