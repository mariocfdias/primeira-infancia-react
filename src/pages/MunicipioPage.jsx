import { Box, Typography, Container, Paper, Grid, Button, LinearProgress, useMediaQuery, useTheme, CircularProgress } from "@mui/material"
import { ArrowBack, Star, KeyboardArrowUp } from "@mui/icons-material"
import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import MissionEvidenceCard from "../components/MissionEvidenceCard"
import EmblemCard from "../components/EmblemCard"
import { services } from "../api"

export default function MunicipioPage({ onBack, ibge }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  console.log({ibge})
  
  const [loading, setLoading] = useState(true)
  const [municipioData, setMunicipioData] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchMunicipioData = async () => {
      try {
        setLoading(true)
        const response = await services.municipiosService.getMunicipioByIbge(ibge)
        // The response is already processed by axios interceptor, no need to use response.data
        setMunicipioData(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching municipality data:", err)
        setError(err.message || "Erro ao carregar dados do município")
        setLoading(false)
      }
    }
    
    if (ibge) {
      fetchMunicipioData()
    }
  }, [ibge])
  
  // Add debug information
  console.log("Loading:", loading)
  console.log("Error:", error)
  console.log("Municipality data:", municipioData)
  
  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Container>
    )
  }
  
  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Erro ao carregar dados: {error}
        </Typography>
        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#12447f",
            "&:hover": {
              bgcolor: "#0d3666",
            },
            textTransform: "none",
          }}
        >
          Voltar para o mapa
        </Button>
      </Container>
    )
  }
  
  // Handle case where data is missing
  if (!municipioData) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Nenhum dado encontrado para este município
        </Typography>
        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#12447f",
            "&:hover": {
              bgcolor: "#0d3666",
            },
            textTransform: "none",
          }}
        >
          Voltar para o mapa
        </Button>
      </Container>
    )
  }

  // Group desempenhos by categoria
  const categorias = municipioData?.desempenhos?.reduce((acc, desempenho) => {
    const categoria = desempenho.missao.categoria
    if (!acc[categoria]) {
      acc[categoria] = {
        id: categoria,
        nome: desempenho.missao.descricao_da_categoria,
        emblema: desempenho.missao.emblema_da_categoria,
        missoes: []
      }
    }
    acc[categoria].missoes.push(desempenho)
    return acc
  }, {}) || {}

  // Calculate total points and progress
  const totalPointsAvailable = municipioData?.desempenhos?.reduce((total, desempenho) => 
    total + parseInt(desempenho.missao.qnt_pontos), 0) || 0
    
  const earnedPoints = municipioData?.desempenhos?.reduce((total, desempenho) => 
    desempenho.validation_status === "VALID" ? total + parseInt(desempenho.missao.qnt_pontos) : total, 0) || 0
  
  // Calculate number of emblems earned (categories with all missions completed)
  const categoriasList = Object.values(categorias)
  const emblemCount = categoriasList.reduce((count, categoria) => {
    const allComplete = categoria.missoes.every(missao => missao.validation_status === "VALID")
    return allComplete ? count + 1 : count
  }, 0)

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={5} lg={4}>
          <Button
            onClick={onBack}
            startIcon={<ArrowBack />}
            variant="contained"
            sx={{
              mb: 3,
              bgcolor: "#12447f",
              "&:hover": {
                bgcolor: "#0d3666",
              },
              textTransform: "none",
            }}
          >
            Voltar para o mapa
          </Button>

          {/* Municipality Card */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Paper
                elevation={2}
                sx={{
                  width: { xs: 80, sm: 120 },
                  height: { xs: 80, sm: 120 },
                  mr: 2,
                  overflow: "hidden",
                  bgcolor: "#ffea00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={municipioData.imagemAvatar || "/placeholder.svg"}
                  alt={municipioData.nome}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Paper>
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "#333333",
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  }}
                >
                  {municipioData.nome}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#525252",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    mb: 1,
                  }}
                >
                  {municipioData.status || "Participante"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#e79d0d",
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Nível {Math.floor(earnedPoints / 50) + 1 || 1}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#525252",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {earnedPoints}/{totalPointsAvailable}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Star sx={{ color: "#f5d664", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalPointsAvailable > 0 ? (earnedPoints / totalPointsAvailable) * 100 : 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "#eeeeee",
                  mb: 1,
                  ".MuiLinearProgress-bar": {
                    bgcolor: "#e79d0d",
                    borderRadius: 5,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#525252",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Complete missões para subir de nível.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-around", mb: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Star sx={{ color: "#f5d664", fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {earnedPoints}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#525252",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  pontos
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/placeholder.svg?height=24&width=24" alt="Emblemas" style={{ width: 24, height: 24 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {emblemCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#525252",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  emblemas
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Emblems Section */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "#333333",
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              mb: 1,
            }}
          >
            Emblemas
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#525252",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              mb: 2,
            }}
          >
            Complete missões para ganhar novos emblemas.
          </Typography>

          <Grid container spacing={2}>
            {categoriasList.map((categoria, index) => {
              const allComplete = categoria.missoes.every(missao => missao.validation_status === "VALID")
              const stars = allComplete ? 3 : categoria.missoes.filter(missao => missao.validation_status === "VALID").length
              
              // Define a map of colors for each category
              const categoryColors = {
                "CTG1": "#1c434f", // Ampliação e Qualificação dos Serviços
                "CTG2": "#27884a", // Fortalecimento da Governança
                "CTG3": "#3f6087", // Melhoria da Gestão de Recursos
              }
              
              return (
                <Grid item xs={4} key={categoria.id}>
                  <EmblemCard
                    title={categoria.nome}
                    categoryId={categoria.id}
                    stars={stars}
                    color={categoryColors[categoria.id] || "#333333"}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={7} lg={8}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "#333333",
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              mb: 1,
            }}
          >
            Missões 2025
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#525252",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              mb: 3,
            }}
          >
            Conclua as missões para ganhar emblemas e pontos!
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Map through all missions and render MissionEvidenceCard for each */}
            {municipioData.desempenhos.map((desempenho) => {
              // Parse evidence items if they exist
              let evidenceItems = []
              if (desempenho.missao.evidencias) {
                try {
                  const parsedEvidencias = JSON.parse(desempenho.missao.evidencias)
                  evidenceItems = parsedEvidencias.map((item, index) => ({
                    id: index + 1,
                    title: item.titulo,
                    description: item.descricao,
                    status: desempenho.validation_status === "VALID" ? "completed" : "pending"
                  }))
                } catch (e) {
                  console.error("Failed to parse evidencias:", e)
                }
              }
              
              // Map API status to component status
              let status = "not-started"
              if (desempenho.validation_status === "VALID") {
                status = "completed"
              } else if (desempenho.validation_status === "STARTED") {
                status = "in-progress"
              }
              
              return (
                <MissionEvidenceCard
                  key={desempenho.missaoId}
                  category={desempenho.missao.descricao_da_categoria.toUpperCase()}
                  categoryId={desempenho.missao.categoria}
                  title={desempenho.missao.descricao_da_missao}
                  status={status}
                  points={parseInt(desempenho.missao.qnt_pontos)}
                  iconUrl={desempenho.missao.emblema_da_categoria || "/placeholder.svg?height=60&width=60"}
                  evidenceItems={evidenceItems}
                  viewOnly={desempenho.validation_status === "VALID"}
                />
              )
            })}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              endIcon={<KeyboardArrowUp />}
              variant="text"
              sx={{
                color: "#333333",
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Voltar para o topo
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

