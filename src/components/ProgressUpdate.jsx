import { Box, Typography, Paper, Chip, Avatar } from "@mui/material"
import { Star, StarRounded } from "@mui/icons-material"
import PropTypes from 'prop-types'


export default function ProgressUpdate({ city, mission, points, badge, date, isMobile = false }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 0.5, sm: 1 },
        borderRadius: 1,
        backgroundColor: "#F3F3F3",
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
        <Avatar
          variant="square"
          sx={{
            bgcolor: "#12447f",
            color: "white",
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            width: { xs: 28, sm: 32, md: 40 },
            height: { xs: 28, sm: 32, md: 40 },
            mr: { xs: 0, sm: 1.5 },
            mt: { xs: 0, sm: 0.5 },
            borderRadius: 1,
            flexShrink: 0,
          }}
        >
          {city.substring(0, 2).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              mb: 0.5,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "16px" },
              lineHeight: 1.5,
            }}
          >
            Prefeitura de {" "}
            <Typography component="span" sx={{ fontWeight: "bold", fontSize: { xs: "0.75rem", sm: "0.875rem", md: "20px" } }}>
              {city}
            </Typography>{" "}
            concluiu a missão "{mission}" e ganhou{" "}
            <Box
              component="span"
              sx={{
                color: "#E79D0D",
                fontWeight: "medium",
                display: "inline-flex",
                alignItems: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "20px" },
              }}
            >
              <StarRounded
                sx={{
                  color: "#E79D0D",
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
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "16px" },
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
              fontSize: { xs: "0.65rem", sm: "0.75rem", md: "16px" },
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

