import React, { useEffect, useState, useMemo } from 'react'
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
  CircularProgress,
  Alert,
} from "@mui/material"
import { FilterAlt, Search, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import BrazilMap from "../components/BrazilMap"
import MapLegend from "../components/MapLegend"
import MissionCard from "../components/MissionCard"
import ProgressUpdate from "../components/ProgressUpdate"
import MunicipioPreview from "../components/MunicipioPreview"
import MunicipioPage from "./MunicipioPage"
import { useTheme } from "@mui/material/styles"
import { useApiRequest, services } from "../api"

export default function HomePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const { makeRequest, loading, error, data } = useApiRequest()
  const { 
    makeRequest: makeRequestPanorama, 
    loading: loadingPanorama, 
    error: panoramaError, 
    data: panoramaData 
  } = useApiRequest()
  const { 
    makeRequest: makeRequestEventos, 
    loading: loadingEventos, 
    error: eventosError
  } = useApiRequest()
  const { 
    makeRequest: makeRequestMunicipio, 
    loading: loadingMunicipio, 
    data: municipioData,
    setData: setMunicipioData
  } = useApiRequest()
  const { 
    makeRequest: makeRequestMissionPanorama, 
    loading: loadingMissionPanorama, 
    data: missionPanoramaData 
  } = useApiRequest()
  const [municipios, setMunicipios] = useState([])
  const [selectedMunicipio, setSelectedMunicipio] = useState(null)
  const [selectedMissao, setSelectedMissao] = useState(null)
  const [missionPanoramaById, setMissionPanoramaById] = useState(null)
  const [missionPanoramaCache, setMissionPanoramaCache] = useState({})
  const [municipioCache, setMunicipioCache] = useState({})
  const [eventos, setEventos] = useState([])
  const [missoes, setMissoes] = useState([])
  const [missionPanorama, setMissionPanorama] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [eventFilter, setEventFilter] = useState("mission_completed")
  const eventosLimit = 10
  // State to track if we should show MunicipioPage instead of HomePage
  const [showMunicipioPage, setShowMunicipioPage] = useState(false)

  // State to hold non-participant municipality data for display
  const [nonParticipantMunicipio, setNonParticipantMunicipio] = useState(null);

  // Add useEffect to track changes to missionPanoramaById
  useEffect(() => {
    console.log('missionPanoramaById updated:', missionPanoramaById);
  }, [missionPanoramaById]);

  // Fetch municipios on component mount
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await makeRequest(services.municipiosService.getAllMunicipios)
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          setMunicipios(response.data)
        }
      } catch (error) {
        console.error("Error fetching municipios:", error)
      }
    }

    fetchMunicipios()
  }, [])

  // Fetch missoes data on component mount
  useEffect(() => {
    const fetchMissoes = async () => {
      try {
        const response = await makeRequest(services.missoesService.getAllMissoes)
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          setMissoes(response.data)
        }
      } catch (error) {
        console.error("Error fetching missoes:", error)
      }
    }

    fetchMissoes()
  }, [])

  // Fetch mission panorama data
  useEffect(() => {
    const fetchMissionPanorama = async () => {
      try {
        const response = await makeRequestPanorama(services.dashboardService.getMissionPanorama)
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          setMissionPanorama(response.data)
        }
      } catch (error) {
        console.error("Error fetching mission panorama:", error)
      }
    }

    fetchMissionPanorama()
  }, [])

  // Fetch eventos based on filters and pagination
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const params = {
          page: currentPage,
          limit: eventosLimit,
          event: eventFilter,
          sortDirection: "DESC"
        }
        
        const response = await makeRequestEventos(() => services.eventosService.getEventos(params))
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          setEventos(response.data)
          if (response.pagination) {
            setTotalPages(response.pagination.pages)
          }
        }
      } catch (error) {
        console.error("Error fetching eventos:", error)
      }
    }

    fetchEventos()
  }, [currentPage, eventFilter])

  // Handle view mission on map
  const handleViewMissionOnMap = async (missionId) => {
    // If the mission is already selected, don't make another API call
    if (selectedMissao === missionId && missionPanoramaById) {
      return;
    }

    try {
      console.log('Starting to fetch mission panorama for ID:', missionId);
      setSelectedMissao(missionId);
      
      // Check if we already have data for this mission in the cache
      if (missionPanoramaCache[missionId]) {
        console.log('Using cached mission panorama data for ID:', missionId);
        setMissionPanoramaById(missionPanoramaCache[missionId]);
      } else {
        const response = await makeRequestMissionPanorama(() => 
          services.dashboardService.getMissionPanoramaById(missionId)
        );
        
        console.log('Mission panorama API response:', response);
        
        if (response && response.status === 'success') {
          console.log('Setting mission panorama data:', response.data);
          
          // Check if response has the expected structure or format it correctly
          let formattedData = response.data;
          
          // If data is missing the expected arrays, create a structure that matches what the map component expects
          if (!formattedData.completedMunicipios || !formattedData.startedMunicipios || !formattedData.pendingMunicipios) {
            console.log('Restructuring mission panorama data to expected format');
            
            // Create a properly structured object based on what we received
            formattedData = {
              missao: { id: missionId },
              completedMunicipios: formattedData.completedMunicipios || formattedData.completed || [],
              startedMunicipios: formattedData.startedMunicipios || formattedData.started || [],
              pendingMunicipios: formattedData.pendingMunicipios || formattedData.pending || []
            };
            
            console.log('Reformatted data:', formattedData);
          }
          
          // Store in cache and set current data
          setMissionPanoramaCache(prev => ({...prev, [missionId]: formattedData}));
          setMissionPanoramaById(formattedData);
        }
      }
      
      // If there's a selected municipality, we don't need to refetch - just ensure the view is updated
      if (selectedMunicipio && selectedMunicipio !== "all" && selectedMunicipio !== "" && municipioData) {
        // Use existing data, just trigger a re-render of MunicipioPreview by creating a shallow copy
        setMunicipioData({...municipioData});
      }
    } catch (error) {
      console.error("Error fetching mission panorama by ID:", error);
    }
  };

  // Handle municipality selection change
  const handleMunicipioChange = (event) => {
    const codIbge = event.target.value;
    
    if (!codIbge || codIbge === "") {
      setSelectedMunicipio(null);
      return;
    }
    
    if (codIbge === "all") {
      setSelectedMunicipio({ codIbge: "all", nome: "Todas as prefeituras" });
      return;
    }
    
    // Find the municipio in our list
    const municipio = municipios.find(m => m.codIbge === codIbge);
    if (municipio) {
      setSelectedMunicipio(municipio);
      
      // Check if we already have this municipality in cache
      if (municipioCache[codIbge]) {
        console.log('Using cached municipality data for:', codIbge);
        setMunicipioData(municipioCache[codIbge]);
        return;
      }
      
      // Fetch the selected municipality data if not in cache
      makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge));
    }
  }

  // Handle municipality selection from map
  const handleMapMunicipioSelect = (codIbge) => {
    // If the same municipality is already selected, don't make another API call
    if (selectedMunicipio?.codIbge === codIbge && (municipioData || nonParticipantMunicipio)) {
      return;
    }
    
    // Clear any previous non-participant data
    setNonParticipantMunicipio(null);
    
    // Find the municipio in our list
    const municipio = municipios.find(m => m.codIbge === codIbge);
    
    if (municipio) {
      // Set the selected municipio using the full object
      setSelectedMunicipio(municipio);
      
      // Check if we already have this municipality in cache
      if (municipioCache[codIbge]) {
        console.log('Using cached municipality data for:', codIbge);
        setMunicipioData(municipioCache[codIbge]);
        return;
      }
      
      // Fetch the selected municipality data if not in cache
      makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge))
        .then(response => {
          if (response && response.status === 'success') {
            // Store in cache for future use
            setMunicipioCache(prev => ({...prev, [codIbge]: response}));
          }
        });
    } else {
      // Create a basic object for municipalities not in our list
      const basicMunicipio = {
        codIbge: codIbge,
        nome: `Município ${codIbge}`
      };
      
      setSelectedMunicipio(basicMunicipio);
      
      // Try to fetch data anyway, might be a municipality that doesn't participate yet
      makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge))
        .then(response => {
          if (response && response.status === 'success') {
            // Store in cache for future use
            setMunicipioCache(prev => ({...prev, [codIbge]: response}));
          }
        })
        .catch(error => {
          // The API request failed, which might mean this municipality doesn't exist
          // or doesn't participate in the pacto
          console.log("Municipality data not found, creating placeholder");
          
          // Create a non-participant municipality data object
          const placeholder = {
            codIbge: codIbge,
            nome: basicMunicipio.nome,
            status: "Não participante",
            points: 0,
            badges: 0,
            missoes: []
          };
          
          setNonParticipantMunicipio(placeholder);
        });
    }
  }

  // Handle "Ver perfil" button click
  const handleViewProfile = () => {
    setShowMunicipioPage(true);
  }

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1) // API uses 0-based pagination
  }

  // Handle event filter change
  const handleEventFilterChange = (filterValue) => {
    setEventFilter(filterValue)
    setCurrentPage(0) // Reset to first page when changing filter
  }

  // Get mission details by ID
  const getMissionDetails = (missionId) => {
    return missoes.find(mission => mission.id === missionId) || { 
      descricao_da_missao: "Missão não encontrada",
      descricao_da_categoria: "Categoria não encontrada",
      qnt_pontos: 0
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return "Hoje"
    } else if (diffDays <= 7) {
      return `${diffDays} dias`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  // Function to get progress value for each mission based on panorama data
  const getMissionProgress = useMemo(() => {
    return (missionId) => {
      const panoramaItem = missionPanorama.find(item => item.missao.id === missionId)
      
      if (panoramaItem) {
        return `${panoramaItem.countValid}/${panoramaItem.totalMunicipios}`
      }
      
      return "0/184" // Default fallback
    }
  }, [missionPanorama]);

  // Add useMemo to memoize the mission cards grid to avoid re-renders
  const missionCardsGrid = useMemo(() => {
    if (loading || loadingPanorama) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error || panoramaError) {
      return (
        <Grid item xs={12}>
          <Alert severity="error">
            Erro ao carregar as missões: {(error || panoramaError)?.message}
          </Alert>
        </Grid>
      );
    }
    
    return missoes.map((missao) => (
      <Grid item xs={12} sm={6} md={4} key={missao.id}>
        <MissionCard
          category={missao.descricao_da_categoria.toUpperCase()}
          title={missao.descricao_da_missao}
          progress={getMissionProgress(missao.id)}
          missionId={missao.id}
          onViewMap={handleViewMissionOnMap}
          isSelected={selectedMissao === missao.id}
        />
      </Grid>
    ));
  }, [missoes, selectedMissao, loading, loadingPanorama, error, panoramaError, missionPanorama, getMissionProgress]);

  // Memoize the MunicipioPreview component
  const memoizedMunicipioPreview = useMemo(() => {
    if (!selectedMunicipio) return null;
    
    return (
      <MunicipioPreview
        municipioData={
          nonParticipantMunicipio 
            ? { status: 'success', data: nonParticipantMunicipio } 
            : (municipioData?.status === 'success' ? municipioData : null)
        }
        loading={loadingMunicipio && !nonParticipantMunicipio}
        selectedMissionId={selectedMissao}
        isNonParticipant={!!nonParticipantMunicipio}
        onViewProfile={handleViewProfile}
      />
    );
  }, [selectedMunicipio, municipioData, nonParticipantMunicipio, loadingMunicipio, selectedMissao]);

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
      {showMunicipioPage ? (
        <MunicipioPage 
          ibge={selectedMunicipio?.codIbge}
          onBack={() => setShowMunicipioPage(false)}
        />
      ) : (
        <>
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
                {loading ? <CircularProgress size={24} /> : municipios.length || 82}
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
    
          {/* Main Content */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Map Section */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={1}
                sx={{
                  height: { xs: 280, sm: 480, md: 600 },
                  border: "1px solid #d3d3d3",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                {console.log('Passing missionPanoramaById to BrazilMap:', missionPanoramaById)}
                <BrazilMap 
                  missionPanoramaData={missionPanoramaById} 
                  selectedMunicipio={selectedMunicipio?.codIbge}
                  onMunicipioSelect={handleMapMunicipioSelect}
                />
              </Paper>
            </Grid>
    
            {/* Municipality Details */}
            <Grid item xs={12} md={4}>
              {selectedMissao && (
                <Box sx={{ p: 2, border: "1px solid #d3d3d3", borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Visualizando missão no mapa
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {missoes.find(m => m.id === selectedMissao)?.descricao_da_missao || "Missão selecionada"}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedMissao(null);
                      setMissionPanoramaById(null);
                    }}
                    sx={{
                      borderColor: "#d3d3d3",
                      color: "#333333",
                      textTransform: "none",
                    }}
                  >
                    Voltar à visualização padrão
                  </Button>
                </Box>
              )}
    
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ 
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: selectedMunicipio ? "#12447f" : "#d3d3d3",
                      borderWidth: selectedMunicipio ? 2 : 1,
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#12447f !important",
                    },
                  }}
                >
                  <InputLabel id="municipio-select-label">Selecione o município</InputLabel>
                  <Select
                    labelId="municipio-select-label"
                    id="municipio-select"
                    value={selectedMunicipio?.codIbge || ""}
                    onChange={handleMunicipioChange}
                    label="Selecione o município"
                  >
                    <MenuItem value="">
                      <em>Selecione...</em>
                    </MenuItem>
                    {municipios.map((municipio) => (
                      <MenuItem key={municipio.codIbge} value={municipio.codIbge}>
                        {municipio.nome}
                      </MenuItem>
                    ))}
                    <MenuItem value="all">Todas as prefeituras</MenuItem>
                  </Select>
                </FormControl>
                
                {selectedMunicipio && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedMunicipio(null);
                      setMissionPanoramaById(null);
                    }}
                    sx={{
                      minWidth: 'auto',
                      borderColor: "#d3d3d3",
                      color: "#333333",
                      mt: 1,
                      px: 1,
                    }}
                  >
                    Limpar
                  </Button>
                )}
              </Box>
              
              {selectedMunicipio && memoizedMunicipioPreview}
            </Grid>
          </Grid>
    
          {/* Mobile Legend - Only shows on mobile */}
          <MapLegend selectedMissao={selectedMissao} />
    
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
    
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Ocorreu um erro ao carregar os dados dos municípios: {error.message}
            </Alert>
          )}
    
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
            {missionCardsGrid}
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
                variant={eventFilter === "mission_completed" ? "contained" : "outlined"}
                size={isMobile ? "small" : "medium"}
                sx={{
                  bgcolor: eventFilter === "mission_completed" ? "#12447f" : "transparent",
                  borderColor: "#d3d3d3",
                  color: eventFilter === "mission_completed" ? "white" : "#333333",
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    bgcolor: eventFilter === "mission_completed" ? "#0d3666" : "rgba(0, 0, 0, 0.04)",
                    borderColor: eventFilter === "mission_completed" ? "transparent" : "#b3b3b3",
                  },
                  boxShadow: eventFilter === "mission_completed" ? 2 : 0,
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
                onClick={() => handleEventFilterChange("mission_completed")}
              >
                Missões concluídas
              </Button>
              <Button
                variant={eventFilter === "evidence_submitted" ? "contained" : "outlined"}
                size={isMobile ? "small" : "medium"}
                sx={{
                  bgcolor: eventFilter === "evidence_submitted" ? "#12447f" : "transparent",
                  borderColor: "#d3d3d3",
                  color: eventFilter === "evidence_submitted" ? "white" : "#333333",
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    bgcolor: eventFilter === "evidence_submitted" ? "#0d3666" : "rgba(0, 0, 0, 0.04)",
                    borderColor: eventFilter === "evidence_submitted" ? "transparent" : "#b3b3b3",
                  },
                  boxShadow: eventFilter === "evidence_submitted" ? 2 : 0,
                }}
                onClick={() => handleEventFilterChange("evidence_submitted")}
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
    
          {/* Pagination */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
            {loadingEventos ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : eventosError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Ocorreu um erro ao carregar os eventos: {eventosError?.message}
              </Alert>
            ) : eventos.length === 0 ? (
              <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1">
                  Nenhum evento encontrado com os filtros atuais.
                </Typography>
              </Paper>
            ) : (
              eventos.map((evento) => {
                const missionDetails = getMissionDetails(evento.description)
                return (
                  <ProgressUpdate
                    key={evento.id}
                    city={evento.municipio?.nome || "Município não encontrado"}
                    mission={missionDetails.descricao_da_missao}
                    points={missionDetails.qnt_pontos}
                    badge={missionDetails.descricao_da_categoria}
                    date={formatDate(evento.data_alteracao)}
                    isMobile={isMobile}
                  />
                )
              })
            )}
          </Box>
    
          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1} // API uses 0-based pagination
              onChange={handlePageChange}
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
        </>
      )}
    </Container>
  )
}

