import React from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Pagination,
  PaginationItem,
  useMediaQuery,
} from "@mui/material"
import { FilterAlt, Search, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import BrazilMap from "../components/BrazilMap"
import MissionCard from "../components/MissionCard"
import ProgressUpdate from "../components/ProgressUpdate"
import { useTheme } from "@mui/material/styles"

export default function HomePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          color: "#333333",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
        }}
      >
        Acompanhe o avanço das prefeituras
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#525252",
          mt: 1,
          mb: 3,
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        Aqui você pode visualizar o progresso e o cumprimento das missões de cada prefeitura, além dos avanços mais
        recentes.
      </Typography>

      {/* Stats */}
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: 4,
          border: "1px solid #d3d3d3",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            borderRight: { xs: "none", sm: "1px solid #d3d3d3" },
            borderBottom: { xs: "1px solid #d3d3d3", sm: "none" },
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography
            variant="h3"
            component="span"
            sx={{
              fontWeight: "bold",
              mr: 2,
              color: "#12447f",
              fontSize: { xs: "2.5rem", sm: "3rem" },
            }}
          >
            82
          </Typography>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: "#12447f",
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              prefeituras
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#12447f",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              aderiram ao Pacto
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography
            variant="h3"
            component="span"
            sx={{
              fontWeight: "bold",
              mr: 2,
              color: "#12447f",
              fontSize: { xs: "2.5rem", sm: "3rem" },
            }}
          >
            2%
          </Typography>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: "#12447f",
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              das missões
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#12447f",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              foram concluídas
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Interactive Map */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: "#333333",
          mb: 1,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Mapa interativo
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#525252",
          mb: 2,
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        Acesse um município no mapa abaixo ou selecione-o na caixa ao lado para ver mais detalhes sobre a participação e
        avanço de sua{" "}
        <Box component="span" sx={{ fontWeight: "medium" }}>
          prefeitura
        </Box>
        .
      </Typography>

      <Grid container spacing={2} sx={{ mb: { xs: 4, sm: 6 } }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Button
              startIcon={<FilterAlt fontSize="small" />}
              variant="text"
              size={isMobile ? "small" : "medium"}
              sx={{
                color: "#12447f",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontWeight: "normal",
                px: 1,
              }}
            >
              Limpar filtros do mapa
            </Button>
          </Box>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              border: "1px solid #d3d3d3",
              borderRadius: 1,
              height: { xs: 300, sm: 400, md: 500 },
            }}
          >
            <BrazilMap />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "medium",
              mb: 1,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Prefeituras
          </Typography>
          <FormControl fullWidth variant="outlined" size={isMobile ? "small" : "medium"} sx={{ mb: 2 }}>
            <InputLabel>Selecione</InputLabel>
            <Select
              label="Selecione"
              defaultValue=""
              sx={{
                borderColor: "#d3d3d3",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d3d3d3",
                },
              }}
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value="caninde">

              </MenuItem>
              <MenuItem value="all">Todas as prefeituras</MenuItem>
            </Select>
          </FormControl>

          <Paper
            elevation={2}
            sx={{
              bgcolor: "#333333",
              color: "white",
              p: { xs: 1.5, sm: 2 },
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Selecione o município para visualizar os detalhes da{" "}
              <Box component="span" sx={{ fontWeight: "medium" }}>
                prefeitura
              </Box>
              .
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Legend */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 1.5, sm: 2 },
          maxWidth: { xs: "100%", sm: 400 },
          mb: 4,
          border: "1px solid #d3d3d3",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: "medium",
            mb: 1,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Legenda
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#a5a5a5",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              89
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Não iniciado
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#72c576",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              135
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Nível 1
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#525252",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                1 até 100 pontos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#27884a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              30
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Nível 2
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#525252",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                101 a 200 pontos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "#12447f",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              2
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Concluído
              </Typography>
              <Box
                sx={{
                  width: { xs: 10, sm: 12 },
                  height: { xs: 10, sm: 12 },
                  bgcolor: "#f5d664",
                  borderRadius: "50%",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#525252",
                  ml: 0.5,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                200 pontos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                bgcolor: "white",
                border: "1px solid #d3d3d3",
                color: "#525252",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                mr: 1,
              }}
            >
              10
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Não aderiu o Pacto
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Missions */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: "#333333",
          mb: 1,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Panorama de missões
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#525252",
          mb: 3,
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        Cada card abaixo representa uma missão específica e mostra a quantidade de municípios que já a concluíram.
        Acesse{" "}
        <Box component="span" sx={{ fontWeight: "medium" }}>
          "Ver no mapa"
        </Box>{" "}
        para visualizar no mapa interativo os municípios que já completaram, estão em curso ou ainda não iniciaram essa
        missão.
      </Typography>

      <Grid container spacing={2} sx={{ mb: { xs: 4, sm: 6 } }}>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="AMPLIAÇÃO E QUALIFICAÇÃO DOS SERVIÇOS"
            title="Fortalecer a rede de serviços de atendimento à primeira infância, em especial, a articulação de serviços de saúde, educação e assistência (...)"
            progress="19/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="AMPLIAÇÃO E QUALIFICAÇÃO DOS SERVIÇOS"
            title="Investir na capacitação continuada de profissionais que atuam na primeira infância, em especial, os que trabalham diretamente (...)"
            progress="19/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="FORTALECIMENTO DA GOVERNANÇA"
            title="Priorizar a primeira infância na gestão de políticas e na alocação de recursos."
            progress="168/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="FORTALECIMENTO DA GOVERNANÇA"
            title="Promover a articulação intersetorial entre as diferentes secretarias municipais, assim como os órgãos protetivos (...)"
            progress="150/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="FORTALECIMENTO DA GOVERNANÇA"
            title="Realizar campanhas e atividades educativas para disseminar o conhecimento sobre os direitos da criança para a população (...)"
            progress="168/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="FORTALECIMENTO DA GOVERNANÇA"
            title="Elaborar, implementar, monitorar e divulgar os planos municipais para a primeira infância, alinhados ao Marco Legal (...)"
            progress="168/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="MELHORIA DA GESTÃO DE RECURSOS"
            title="Implementar sistemática de monitoramento e avaliação das políticas para a primeira infância, utilizando indicadores de (...)"
            progress="85/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="MELHORIA DA GESTÃO DE RECURSOS"
            title="Garantir o financiamento das políticas para a primeira infância, com recursos próprios e por meio de recursos de transferências, (...)"
            progress="85/184"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MissionCard
            category="MELHORIA DA GESTÃO DE RECURSOS"
            title="Evidenciar os recursos aplicados em projetos e atividades voltados para a primeira infância no orçamento municipal, conforme (...)"
            progress="164/184"
          />
        </Grid>
      </Grid>

      {/* Recent Progress */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: "#333333",
          mb: 1,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Quem está avançando?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#525252",
          mb: 3,
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        Veja as atualizações mais recentes sobre{" "}
        <Box component="span" sx={{ fontWeight: "medium" }}>
          missões concluídas
        </Box>{" "}
        e{" "}
        <Box component="span" sx={{ fontWeight: "medium" }}>
          envio de evidências
        </Box>{" "}
        pelas prefeituras{" "}
        <Box component="span" sx={{ fontWeight: "medium" }}>
          nos últimos 30 dias
        </Box>
        .
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          component="span"
          sx={{
            mr: 2,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            display: { xs: "block", sm: "inline" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Mostrando:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button
            variant="contained"
            size={isMobile ? "small" : "medium"}
            sx={{
              bgcolor: "#12447f",
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": {
                bgcolor: "#0d3666",
              },
              boxShadow: 2,
            }}
            startIcon={
              <Box
                sx={{
                  width: { xs: 10, sm: 12 },
                  height: { xs: 10, sm: 12 },
                  bgcolor: "#f5d664",
                  borderRadius: "50%",
                }}
              />
            }
          >
            Missões concluídas
          </Button>
          <Button
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              borderColor: "#d3d3d3",
              color: "#333333",
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": {
                borderColor: "#b3b3b3",
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Envio de evidências
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="nome@example.com"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9f9f9f", fontSize: isMobile ? "1rem" : "1.25rem" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#d3d3d3",
              },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mr: 1,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Ordenar por
            </Typography>
            <FormControl
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                minWidth: { xs: "100%", sm: 150 },
                flex: { xs: 1, sm: "unset" },
              }}
            >
              <Select
                defaultValue="recent"
                displayEmpty
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d3d3d3",
                  },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                <MenuItem value="recent">Mais recente</MenuItem>
                <MenuItem value="oldest">Mais antigo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <ProgressUpdate
          city="Canindé"
          mission="Priorizar a primeira infância na gestão de políticas e na alocação de recursos"
          points={20}
          badge="Fortalecimento da Governança"
          date="Hoje"
          isMobile={isMobile}
        />
        <ProgressUpdate
          city="Ererê"
          mission="Priorizar a primeira infância na gestão de políticas e na alocação de recursos"
          points={20}
          badge="Fortalecimento da Governança"
          date="7 dias"
          isMobile={isMobile}
        />
        <ProgressUpdate
          city="Milagres"
          mission="Priorizar a primeira infância na gestão de políticas e na alocação de recursos"
          points={20}
          badge="Fortalecimento da Governança"
          date="08/03/2025"
          isMobile={isMobile}
        />
        <ProgressUpdate
          city="Milagres"
          mission="Priorizar a primeira infância na gestão de políticas e na alocação de recursos"
          points={20}
          badge="Fortalecimento da Governança"
          date="08/03/2025"
          isMobile={isMobile}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={3}
          page={2}
          size={isMobile ? "small" : "medium"}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: KeyboardArrowLeft, next: KeyboardArrowRight }}
              {...item}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#12447f",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#0d3666",
                  },
                },
                border: "1px solid #d3d3d3",
                borderRadius: 0,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            />
          )}
        />
      </Box>
    </Container>
  )
}

