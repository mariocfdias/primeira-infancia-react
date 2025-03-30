import { Box, Typography, Paper, Button, Chip, Grid, Divider, useTheme, useMediaQuery } from "@mui/material"
import { CheckCircle, OpenInNew, Info } from "@mui/icons-material"
import PropTypes from 'prop-types'

export default function MissionEvidenceCard({
  category,
  title,
  status,
  points,
  iconUrl,
  evidenceItems,
  viewOnly = false,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getCategoryColor = (category) => {
    if (category.includes("AMPLIAÇÃO")) return "#1c434f"
    if (category.includes("FORTALECIMENTO")) return "#27884a"
    if (category.includes("MELHORIA")) return "#3f6087"
    return "#333333"
  }

  const getStatusChip = () => {
    switch (status) {
      case "not-started":
        return (
          <Chip
            label="Não iniciada"
            sx={{
              bgcolor: "white",
              border: "1px solid #d3d3d3",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              height: 24,
            }}
          />
        )
      case "in-progress":
        return (
          <Chip
            label="Em ação"
            sx={{
              bgcolor: "#e7eef8",
              color: "#12447f",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              height: 24,
            }}
          />
        )
      case "completed":
        return (
          <Chip
            icon={<CheckCircle sx={{ fontSize: "1rem !important", color: "white" }} />}
            label="Missão concluída"
            sx={{
              bgcolor: "#50b755",
              color: "white",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              height: 24,
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        )
    }
  }

  const getEvidenceInstructions = () => {
    if (status === "completed" && viewOnly) {
      return "Visualize as evidências enviadas."
    } else if (status === "in-progress") {
      return "Envie as evidências abaixo para concluir a missão ou visualize as que já foram enviadas."
    } else {
      return "Envie as evidências abaixo para concluir a missão."
    }
  }

  return (
    <Paper
      elevation={2}
      sx={{
        border: "1px solid #d3d3d3",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          bgcolor: getCategoryColor(category),
          color: "white",
          py: 0.5,
          px: 2,
          fontSize: { xs: "0.65rem", sm: "0.75rem" },
          fontWeight: "medium",
        }}
      >
        {category}
      </Box>

      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              width: { xs: 40, sm: 50 },
              height: { xs: 40, sm: 50 },
              mr: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={iconUrl || "/placeholder.svg"}
              alt="Mission icon"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "medium",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {getStatusChip()}
              <Typography
                variant="body2"
                sx={{
                  color: "#e79d0d",
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                +{points} <span style={{ fontSize: "1.25em", marginLeft: "2px" }}>⭐</span>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body2"
          sx={{
            fontWeight: "medium",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            mb: 1.5,
          }}
        >
          Evidências
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#525252",
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            mb: 2,
          }}
        >
          {getEvidenceInstructions()}
        </Typography>

        <Grid container spacing={1} sx={{ mb: status !== "completed" ? 2 : 0 }}>
          {evidenceItems.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  border: "1px solid #d3d3d3",
                  borderRadius: 1,
                  bgcolor: item.status === "completed" ? "#f3f5ed" : "white",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    mr: 1,
                  }}
                >
                  {item.id}. {item.title}
                </Typography>
                {item.status === "pending" ? (
                  <Info sx={{ color: "#12447f", fontSize: { xs: "0.9rem", sm: "1rem" }, ml: "auto" }} />
                ) : (
                  <OpenInNew sx={{ color: "#12447f", fontSize: { xs: "0.9rem", sm: "1rem" }, ml: "auto" }} />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {status !== "completed" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              endIcon={<OpenInNew />}
              sx={{
                bgcolor: "#12447f",
                "&:hover": {
                  bgcolor: "#0d3666",
                },
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Enviar evidências
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

MissionEvidenceCard.propTypes = {
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['not-started', 'in-progress', 'completed']).isRequired,
  points: PropTypes.number.isRequired,
  iconUrl: PropTypes.string.isRequired,
  evidenceItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'completed']).isRequired
    })
  ).isRequired,
  viewOnly: PropTypes.bool
}

