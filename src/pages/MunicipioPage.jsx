import { Box, Typography, Container, Paper, Grid, Button, LinearProgress, useMediaQuery, useTheme, CircularProgress } from "@mui/material"
import { ArrowBack, Star, KeyboardArrowUp, WorkspacePremium, StarRounded } from "@mui/icons-material"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import MissionEvidenceCard from "../components/MissionEvidenceCard"
import EmblemCard from "../components/EmblemCard"
import { services } from "../api"
import NumericIcon from "../components/NumericIcon"

export default function MunicipioPage({ onBack, ibge }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const codIbge = urlParams.get('codIbge');
  
  const [loading, setLoading] = useState(true)
  const [municipioData, setMunicipioData] = useState(null)
  const [desempenhoData, setDesempenhoData] = useState(null)

  const [error, setError] = useState(null)

  useEffect(() => {
    console.log({codIbge})
  }, [codIbge])
  
  useEffect(() => {
    const fetchMunicipioData = async () => {
      try {
        setLoading(true)
        const response = await services.municipiosService.getMunicipioByIbge(ibge)
        
        // Fetch desempenhos for this municipality
        const desempenhosResponse = await services.desempenhosService.getDesempenhosByMunicipio(ibge)
        
        // Process the evidence items directly after fetching
        const processedDesempenhos = desempenhosResponse.data.map(desempenho => {
          let evidenceItems = []
          
          if (desempenho.evidence && Array.isArray(desempenho.evidence)) {
            // If evidence is already an array, use it directly
            evidenceItems = desempenho.evidence.map((item, index) => ({
              id: index + 1,
              title: item.titulo,
              description: item.descricao,
              evidenceLink: item.evidencia,
              status: desempenho.validation_status === "VALID" ? "completed" : "pending"
            }))
          } else if (desempenho.missao && desempenho.missao.evidencias) {
            // If evidence is in missao.evidencias
            try {
              // Check if evidencias is already an array or needs parsing
              const evidenciasData = typeof desempenho.missao.evidencias === 'string' 
                ? JSON.parse(desempenho.missao.evidencias) 
                : desempenho.missao.evidencias;
                
              evidenceItems = evidenciasData.map((item, index) => ({
                id: index + 1,
                title: item.titulo,
                description: item.descricao,
                status: desempenho.validation_status === "VALID" ? "completed" : "pending"
              }))
            } catch (e) {
              console.error("Failed to parse evidencias:", e)
            }
          }
          
          // Return the processed desempenho with evidence items
          return {
            ...desempenho,
            processedEvidence: evidenceItems
          }
        })
        
        // Combine the data
        const combinedData = {
          ...response.data,
          desempenhos: processedDesempenhos
        }
        
        console.log({combinedData})
        setDesempenhoData(processedDesempenhos)
        setMunicipioData(combinedData)
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

  useEffect(() => {
    console.log({desempenhoData})
  }, [desempenhoData])

  useEffect(() => {
    console.log({municipioData})
  }, [municipioData])
  
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
        {!codIbge && (
          <Button
            onClick={onBack}
            startIcon={<ArrowBack />}
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#1F5BB4",
              "&:hover": {
                bgcolor: "#0d3666",
              },
              textTransform: "none",
            }}
          >
            Voltar para o mapa
          </Button>
        )}
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
        {!codIbge && (
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
        )}
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
          {!codIbge && (
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
          )}

          {/* Municipality Card */}
          <Box display={"flex"} flexDirection={"row"} sx={{ mb: 4 }}>
          <Paper
                elevation={2}
                sx={{
                  width: { xs: 80, sm: 120, lg: 240 },
                  height: { xs: 80, sm: 120, lg: 240 },
                  mr: 2,
                  p: 0,
                  overflow: "hidden",
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
                    padding: 0,
                    margin: 0,
                    objectFit: "contain",
                  }}
                />
              </Paper>
            <Box sx={{ display: "flex",flexDirection: "column", alignItems: "flex-start", mb: 2,width: "100%" }}>

              <Box sx={{width: "100%"}}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "#333333",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", lg: "46px" },
                  }}
                >
                  {municipioData.nome}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#525252",
                    fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" },
                    mb: 1,
                  }}
                >
                  {municipioData.status || "Participante"}
                </Typography>
                <Box sx={{width: "100%"}}>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography
                  variant="body1"
                  sx={{
                    color: "#e79d0d",
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem", lg: "24px" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Nível {Math.floor(earnedPoints / 50) + 1 || 1}
                </Typography>
              <Typography
                  variant="body2"
                  sx={{
                    color: "#FCBA38",
                    fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "24px" },
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {earnedPoints}/100
                  <StarRounded sx={{ color: "#FCBA38", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalPointsAvailable > 0 ? (earnedPoints / totalPointsAvailable) * 100 : 0}
                
                sx={{
                  height: 10,
                  borderRadius: 5,
                  height: 16,
                  bgcolor: "#eeeeee",
                  mb: 1,
                  ".MuiLinearProgress-bar": {
                    background: "linear-gradient(to right, #FFDD9A, #FCBA38)",
                    borderRadius: 5,
                  },
                }}
              />
                 <Typography
                variant="body2"
                sx={{
                  color: "#525252",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "14px" },
                }}
              >
                Complete missões para subir de nível.
              </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-around", mb: 4, pt: 1 }}>
              <NumericIcon 
                icon={<Star sx={{ color: "#f5d664", fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "3rem" } }} />}
                number={earnedPoints}
                description="pontos"
                sx={{backgroundColor: "#FDF9DE", borderRadius: 2, p: 1}}
              />
              <NumericIcon 
                icon={<WorkspacePremium sx={{ color: "#0076B1", fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "3rem" } }} />}
                number={emblemCount}
                description="emblemas"
                sx={{backgroundColor: "#E7EEF8", borderRadius: 2, p: 1}}
              />
            </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
            
           
            </Box>


          </Box>

          {/* Emblems Section */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "#333333",
              fontSize: { xs: "1.125rem", sm: "1.25rem", lg: "36px" },
            }}
          >
            Emblemas
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#525252",
              fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "18px" },
            }}
          >
            Complete missões para ganhar novos emblemas.
          </Typography>

          <Grid container spacing={1}>
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
                <Grid item md={4} xs={12} key={categoria.id}>
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
              fontSize: { xs: "1.5rem", sm: "1.75rem", lg: "30px" },
              mb: 1,
            }}
          >
            Missões 2025
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#525252",
              fontSize: { xs: "0.875rem", sm: "1rem", lg: "22px" },
              mb: 3,
            }}
          >
            Conclua as missões para ganhar emblemas e pontos!
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Map through all missions and render MissionEvidenceCard for each */}
            {municipioData.desempenhos.map((desempenho) => {
              // Use the pre-processed evidence items
              
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
                  evidenceItems={desempenho.evidence ||[]}
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

