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

  // Atualiza o status para 'in-progress' se houver evidências e o status não for 'completed'
  const effectiveStatus = status !== 'completed' && evidenceItems.length > 0 ? 'in-progress' : status;

  console.log({evidenceItems})

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
          bgcolor: '#D4FFDE',
          color: '#066829',
          fontWeight: "500",
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

    // Usar o effectiveStatus em vez do status original
    const config = statusConfig[status];

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        sx={{
          ...config.style,
          fontSize: { xs: "1rem", sm: "1.2rem", lg: "18px" },
          height: 24,
          "& .MuiChip-icon": {
            color: "white",
          },
        }}
      />
    );
  }

  const getEvidenceInstructions = () => {
    // Usar o effectiveStatus em vez do status original
    if (effectiveStatus === "completed" && viewOnly) {
      return "Visualize as evidências enviadas."
    } else if (effectiveStatus === "in-progress") {
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
                fontSize: { xs: "14px", sm: "16px", lg: "20px" },
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
                  color: "#F6CD54",
                  textShadow: "1px 1px 1px #EE9C06",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.2rem", lg: "24px" },
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                }}
              >
                +{points}
              </Typography>
              <StarRounded sx={{
                  color: "#F6CD54",
                  textShadow: "1px 1px 1px #EE9C06",
                  fontWeight: "bold",
                  pr: 2,
                 fontSize: { xs: "1rem", sm: "1.2rem", lg: "36px" },
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
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.2rem", lg: "24px" },
            color: "#000000",
          }}
        >
          Evidências
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontSize: { xs: "0.8rem", sm: "1rem", lg: "16px" },
            mb: 2,
          }}
        >
          {getEvidenceInstructions()}
        </Typography>

        <Grid container spacing={1}  sx={{ mb: effectiveStatus !== "completed" ? 2 : 0 }}>
          {evidenceItems.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              {console.log({item})}
              <EvidenceItem
                id={item.id}
                title={item.titulo}
                description={item.descricao}
                evidence={item.evidence}
                status={item.status}
              />
            </Grid>
          ))}
        </Grid>

        {effectiveStatus !== "completed" && (
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

