import { Box, Typography, Container, Paper, Grid, Button, LinearProgress, useMediaQuery, useTheme } from "@mui/material"
import { ArrowBack, Star, KeyboardArrowUp } from "@mui/icons-material"
import { Link } from "react-router-dom"
import MissionEvidenceCard from "../components/MissionEvidenceCard"
import EmblemCard from "../components/EmblemCard"

export default function MunicipioCanindePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Static data for the municipality
  const municipio = {
    id: "caninde",
    nome: "Canindé",
    subtitulo: "Agentes de Transformação",
    nivel: 1,
    progresso: 75,
    total: 100,
    pontos: 123,
    emblemas: 5,
    logo: "/placeholder.svg?height=200&width=200",
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={5} lg={4}>
          <Button
            component={Link}
            to="/"
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
                  src={municipio.logo || "/placeholder.svg"}
                  alt={municipio.nome}
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
                  {municipio.nome}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#525252",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    mb: 1,
                  }}
                >
                  {municipio.subtitulo}
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
                  Nível {municipio.nivel}
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
                  {municipio.progresso}/{municipio.total}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Star sx={{ color: "#f5d664", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(municipio.progresso / municipio.total) * 100}
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
                  {municipio.pontos}
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
                  {municipio.emblemas}
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
            <Grid item xs={4}>
              <EmblemCard
                title="Ampliação e Qualificação dos Serviços"
                iconUrl="/placeholder.svg?height=60&width=60"
                stars={0}
                color="#1c434f"
              />
            </Grid>
            <Grid item xs={4}>
              <EmblemCard
                title="Fortalecimento da Governança"
                iconUrl="/placeholder.svg?height=60&width=60"
                stars={2}
                color="#27884a"
              />
            </Grid>
            <Grid item xs={4}>
              <EmblemCard
                title="Melhoria da Gestão de Recursos"
                iconUrl="/placeholder.svg?height=60&width=60"
                stars={0}
                color="#3f6087"
              />
            </Grid>
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
            {/* Mission 1 - Not Started */}
            <MissionEvidenceCard
              category="FORTALECIMENTO DA GOVERNANÇA"
              title="Priorizar as ações voltadas para a primeira infância quanto à gestão de políticas e a destinação de recursos."
              status="not-started"
              points={25}
              iconUrl="/placeholder.svg?height=60&width=60"
              evidenceItems={[
                { id: 1, title: "Assinatura do Pacto", status: "pending" },
                { id: 2, title: "Portaria de instituição", status: "pending" },
                { id: 3, title: "Plano de ação", status: "pending" },
                { id: 4, title: "Relatórios de execução orçamentária", status: "pending" },
              ]}
            />

            {/* Mission 2 - Completed */}
            <MissionEvidenceCard
              category="MELHORIA DA GESTÃO DE RECURSOS"
              title="Priorizar as ações voltadas para a primeira infância quanto à gestão de políticas e a destinação de recursos."
              status="completed"
              points={50}
              iconUrl="/placeholder.svg?height=60&width=60"
              evidenceItems={[
                { id: 1, title: "Assinatura do Pacto", status: "completed" },
                { id: 2, title: "Relatórios de execução orçamentária", status: "completed" },
                { id: 3, title: "Portaria de instituição", status: "completed" },
                { id: 4, title: "Plano de ação", status: "completed" },
              ]}
              viewOnly={true}
            />

            {/* Mission 3 - In Progress */}
            <MissionEvidenceCard
              category="MELHORIA DA GESTÃO DE RECURSOS"
              title="Priorizar as ações voltadas para a primeira infância quanto à gestão de políticas e a destinação de recursos."
              status="in-progress"
              points={50}
              iconUrl="/placeholder.svg?height=60&width=60"
              evidenceItems={[
                { id: 1, title: "Assinatura do Pacto", status: "pending" },
                { id: 2, title: "Relatórios de execução orçamentária", status: "completed" },
                { id: 3, title: "Portaria de instituição", status: "completed" },
                { id: 4, title: "Plano de ação", status: "completed" },
              ]}
            />
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

