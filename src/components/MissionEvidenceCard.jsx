import { Box, Typography, Paper, Button, Chip, Grid, Divider, useTheme, useMediaQuery, Tooltip } from "@mui/material"
import { CheckCircle, OpenInNew, Info, StarRounded } from "@mui/icons-material"
import PropTypes from 'prop-types'
import EvidenceItem from './EvidenceItem'

export default function MissionEvidenceCard({
  category,
  categoryId,
  title,
  status,
  points,
  iconUrl,
  evidenceItems,
  viewOnly = false,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getCategoryIcon = (categoryId) => {
    // Try to extract CTG pattern from iconUrl or title

    // If a valid category ID was found, use the corresponding icon
    if (categoryId) {
      return `/icons/${categoryId}.png`
    }
    
    // Fallback to the provided iconUrl or placeholder
    return "/placeholder.svg"
  }
  const getCategoryColor = (category) => {
    if (category.includes("AMPLIAÇÃO")) return "linear-gradient(45deg, #1C434F, #0A5166)"
    if (category.includes("FORTALECIMENTO")) return "linear-gradient(45deg, #3D5E85, #5E7DA0)"
    if (category.includes("MELHORIA")) return "linear-gradient(45deg, #256F93, #5B97B5)"
    return "#333333"
  }

  const getStatusChip = () => {
    const statusConfig = {
      'not-started': {
        label: 'Não iniciada',
        style: {
          bgcolor: 'white',
          border: '1px solid #d3d3d3',
          color: '#333333',
        },
        icon: null
      },
      'in-progress': {
        label: 'Em ação',
        style: {
          bgcolor: '#e7eef8',
          color: '#12447f',
        },
        icon: null
      },
      'completed': {
        label: 'Missão concluída',
        style: {
          bgcolor: '#50b755',
          color: 'white',
        },
        icon: <CheckCircle sx={{ fontSize: "1rem !important" }} />
      }
    };

    const config = statusConfig[status];
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        sx={{
          ...config.style,
          fontSize: { xs: "0.65rem", sm: "0.75rem", lg: "18px" },
          height: 24,
          "& .MuiChip-icon": {
            color: "white",
          },
        }}
      />
    );
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
        background: getCategoryColor(category),
        color: "white",
        border: "1px solid #d3d3d3",
        borderRadius: 1,
      }}
    >

      <Chip
        label={category}
        sx={{
          position: "relative",
          top: -15,
          left: 15,
          overflow: "visible",
          zIndex: 1000,
          color: "white",
          fontWeight: "500",
          letterSpacing: 2,
          fontSize: { xs: "10px", sm: "12px", lg: "14px" },
          background: getCategoryColor(category),
          "& .MuiChip-label": {
            px: 1,
          }
        }}
      />
      <Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              width: { xs: 40, sm: 60, lg: 80 },
              height: { xs: 40, sm: 60, lg: 80 },
              mr: 2,
              ml: { xs: 1, sm: 2, lg: 1 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={getCategoryIcon(categoryId)}
              alt="Mission icon"
              width={useMediaQuery(theme.breakpoints.down("sm")) ? 40 : 60}
              height={useMediaQuery(theme.breakpoints.down("sm")) ? 40 : 60}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "400",
                color: "white",
                fontSize: { xs: "12px", sm: "14px", lg: "20px" },
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
              {getStatusChip()}
              <Typography
                variant="body2"
                fontFamily="Atkinson Hyperlegible"
                sx={{
                  color: "#e79d0d",
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" },
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                }}
              >
                +{points} 
              </Typography>
              <StarRounded sx={{ 
                 color: "#e79d0d",
                 fontWeight: "bold",
                 fontSize: { xs: "0.875rem", sm: "1rem", lg: "36px" },
                 display: "flex",
                 alignItems: "center",
              }} />
              
            </Box>
          </Box>
        </Box>

        <Divider  />
        <Box sx={{ backgroundColor: "white", m:0, p:2 }} >

        <Typography
          variant="body2"
          sx={{
            fontWeight: "medium",
            fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "24px" },
            color: "#000000",
          }}
        >
          Evidências
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontSize: { xs: "0.7rem", sm: "0.8rem", lg: "16px" },
            mb: 2,
          }}
        >
          {getEvidenceInstructions()}
        </Typography>

        <Grid container spacing={1}  sx={{ mb: status !== "completed" ? 2 : 0 }}>
          {evidenceItems.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <EvidenceItem
                id={item.id}
                title={item.title}
                description={item.description}
                evidence={item.evidence}
                evidenceLink={item.evidenceLink}
                status={item.status}
              />
            </Grid>
          ))}
        </Grid>

        {status !== "completed" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              size="medium"
              endIcon={<OpenInNew />}
              sx={{
                bgcolor: "#12447f",
                "&:hover": {
                  bgcolor: "#1F5BB4",
                },
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "18px" },
                height: { xs: 30, sm: 40, lg: 50 },
              }}
            >
              Enviar evidências
            </Button>
          </Box>
        )}
      </Box>
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
      status: PropTypes.oneOf(['pending', 'completed']).isRequired,
      description: PropTypes.string,
      evidence: PropTypes.string,
      evidenceLink: PropTypes.string
    })
  ).isRequired,
  viewOnly: PropTypes.bool
}

