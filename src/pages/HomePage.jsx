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
  Divider,
} from "@mui/material"
import { FilterAlt, Search, KeyboardArrowLeft, KeyboardArrowRight, StarRounded } from "@mui/icons-material"
import BrazilMap from "../components/BrazilMap"
import MapLegend from "../components/MapLegend"
import MissionCard from "../components/MissionCard"
import ProgressUpdate from "../components/ProgressUpdate"
import MunicipioPreview from "../components/MunicipioPreview"
import MunicipioPage from "./MunicipioPage"
import { useTheme } from "@mui/material/styles"
import { useApiRequest, services } from "../api"
import '@fontsource/atkinson-hyperlegible/400.css';
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
    data: municipioData
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
      
      // If there's a selected municipality, we need to refetch its data to update mission-specific information
      if (selectedMunicipio && selectedMunicipio !== "all" && selectedMunicipio !== "") {
        if (selectedMunicipio.codIbge) {
          const codIbge = selectedMunicipio.codIbge;
          // Refetch municipality data to get updated mission status
          makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge));
        }
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
        // Just reuse the existing municipality data through the normal API flow
        // First, store the cached data back into the municipioCache to ensure it's available
        setMunicipioCache(prev => ({...prev, [codIbge]: municipioCache[codIbge]}));
        // Then, force a refetch to update the municipioData state through the API mechanism
        makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge));
      } else {
        // Fetch the selected municipality data if not in cache
        makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge));
      }
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
        // Just reuse the existing municipality data through the normal API flow
        // First, store the cached data back into the municipioCache to ensure it's available
        setMunicipioCache(prev => ({...prev, [codIbge]: municipioCache[codIbge]}));
        // Then, force a refetch to update the municipioData state through the API mechanism
        makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge));
      } else {
        // Fetch the selected municipality data if not in cache
        makeRequestMunicipio(() => services.municipiosService.getMunicipioByIbge(codIbge))
          .then(response => {
            if (response && response.status === 'success') {
              // Store in cache for future use
              setMunicipioCache(prev => ({...prev, [codIbge]: response}));
            }
          });
      }
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

          {/* Stats */}
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 6,
              border: "1px solid #D3D3D3",
              borderRadius: 1,
              overflow: "hidden",
              backgroundColor: "#fbfbfb",
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, sm: 3 },
                borderBottom: { xs: "1px solid #d3d3d3", sm: "none" },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center" },
              }}
            >
              <Typography
                variant="h3"
                component="span"
                textAlign={"center"}
                fontFamily={"Atkinson Hyperlegible"}
                sx={{
                  fontWeight: "600",
                  mr: 2,
                  color: "#12447f",
                  fontSize: { xs: "2.5rem", sm: "3rem", lg: "96px" },
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
                    fontSize: { xs: "1rem", sm: "1.1rem", lg: "36px" },
                    mb: 0,
                    letterSpacing: "0.02em"
                  }}
                >
                  prefeituras
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333333",
                    fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" },
                    mt: -2,
                    letterSpacing: "0.01em"
                  }}
                >
                  aderiram ao Pacto
                </Typography>
              </Box>
            </Box>
            <Divider orientation="vertical" variant='middle' color="#acacac" flexItem  />
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, sm: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center" },
              }}
            >
              <Typography
                variant="h3"
                component="span"
                textAlign={"center"}
                fontFamily={"Atkinson Hyperlegible"}
                sx={{
                  fontWeight: "600",
                  mr: 2,
                  color: "#12447f",
                  fontSize: { xs: "2.5rem", sm: "3rem", lg: "96px" },
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
                    fontSize: { xs: "1rem", sm: "1.1rem", lg: "36px" },
                    mb: 0,
                    letterSpacing: "0.02em"
                  }}
                >
                  das missões
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333333",
                    fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" },
                    mt: -2,
                    letterSpacing: "0.01em"
                  }}
                >
                  foram concluídas
                </Typography>
              </Box>
            </Box>
          </Paper>
    
          {/* Main Content */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "600",
              color: "#333333",
              mb: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "32px" },
            }}
          >
            Mapa interativo
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#525252",
              mb: 2,
              fontSize: { xs: "0.875rem", sm: "1rem", lg: "20px" },
            }}
          >
            Acesse um município no mapa abaixo ou selecione-o na caixa ao lado para ver mais detalhes sobre a participação e
            avanço de sua{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              prefeitura
            </Box>
            .
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Map Section */}

            
            <Grid item xs={12} md={8}>
              <Paper
                elevation={1}
                sx={{
                  height: { xs: 280, sm: 480, md: 600 },
                  border: "1px solid #d3d3d3",
                  borderRadius: 1,
                  overflow: "hidden",
                  alignItems: "center",
                }}
              >
                <BrazilMap 
                  missionPanoramaData={missionPanoramaById} 
                  selectedMunicipio={selectedMunicipio?.codIbge}
                  onMunicipioSelect={handleMapMunicipioSelect}
                />
              </Paper>
              
            </Grid>

{isTablet && (
  <Grid item xs={12} md={12}>
    <MapLegend selectedMissao={selectedMissao} />
  </Grid>
)}


    
            {/* Municipality Details */}
            <Grid item xs={12} md={4}>
              {selectedMissao && (
                <Box sx={{ p: 2, border: "1px solid #d3d3d3", borderRadius: 1, mb: 2, backgroundColor: "#F2F2F2" }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Visualizando missão no mapa
                  </Typography>
                  <Typography variant="body2" fontWeight={"400"} fontSize={"20px"} sx={{ mb: 2 }}>
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
    
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <InputLabel htmlFor="my-input" sx={{ fontWeight: "500", color: "#333333", fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" } }}>Prefeituras</InputLabel>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                >
                  <InputLabel id="municipio-select-label"
                  sx={{
                    '&.MuiInputLabel-root': {
                      color: '#000000', // <------------------ label-color by default
                      fontWeight: 500
                    },
                    '&.MuiInputLabel-root.Mui-focused': {
                      color: '#000000', // <------------------ label-color on focus
                    }
                  }}
                  >Selecione</InputLabel>
                  <Select
                    labelId="municipio-select-label"
                    id="municipio-select"
                    value={selectedMunicipio?.codIbge || ""}
                    onChange={handleMunicipioChange}
                    label="Selecione o município"
                    labelStyle={{ color: '#ff0000' }}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'pink',
                        color: '#000000',
                        borderWidth: "thin",
                        fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" },
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000000',
                        color: '#000000',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000000',
                        color: '#000000',
                      },
                      '.MuiSvgIcon-root ': {
                        backgroundColor: '#12447F',
                        borderRadius: '50%',
                        color: '#ffffff',
                      },
                      '.MuiSelect-outlined': {
                        borderColor: '#000000',
                        color: '#000000',
                      },
                      '&.MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000', // <------------------ outline-color by default
            },
            '&:hover fieldset': {
              borderColor: '#000000', // <------------------ outline-color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000', // <------------------ outline-color on focus
            },
          },
                    }}
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
              
              {memoizedMunicipioPreview}
            </Grid>
          </Grid>
    
          {/* Mobile Legend - Only shows on mobile */}
    
          {/* Interactive Map */}
         
    
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
              fontWeight: "600",
              color: "#333333",
              mb: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "32px" },
            }}
          >
            Panorama de missões
          </Typography>
          <Typography
            sx={{
              color: "#525252",
              mb: 3,
              fontSize: { xs: "0.875rem", sm: "1rem", lg: "20px" },
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
    
          <Grid container spacing={4} sx={{ mb: { xs: 4, sm: 6 }, mt: {xs: 1, sm: 2, md: 2} }}>
            {missionCardsGrid}
          </Grid>
    
          {/* Recent Progress */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "600",
              color: "#333333",
              mb: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "32px" },
            }}
          >
            Quem está avançando?
          </Typography>
          <Typography
            sx={{
              color: "#525252",
              mb: 3,
              fontSize: { xs: "0.875rem", sm: "1rem", lg: "20px" },
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
    
          <Box display="flex" flexDirection="row" alignItems="center" sx={{ mb: 3, display: "flex", flexDirection: "row", border: "1px solid #d3d3d3", borderRadius: 1, p: 2 }}>
            <Box>
            <Typography
              variant="body2"
              component="span"
              sx={{
                mr: 2,
                fontSize: { xs: "0.875rem", sm: "1rem", lg: "20px" },
                display: { xs: "block", sm: "inline" },
                mb: { xs: 1, sm: 0 },
              }}
            >
              Mostrando
            </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant={eventFilter === "mission_completed" ? "contained" : "outlined"}
                size={isMobile ? "small" : "medium"}
                sx={{
                  bgcolor: eventFilter === "mission_completed" ? "#12447f" : "transparent",
                  borderColor: "#d3d3d3",
                  color: eventFilter === "mission_completed" ? "white" : "#333333",
                  textTransform: "none",
                  fontWeight: "semibold",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "20px" },
                  "&:hover": {
                    bgcolor: eventFilter === "mission_completed" ? "#0d3666" : "rgba(0, 0, 0, 0.04)",
                    borderColor: eventFilter === "mission_completed" ? "transparent" : "#b3b3b3",
                  },
                  boxShadow: eventFilter === "mission_completed" ? 2 : 0,
                }}
                startIcon={
                  <StarRounded sx={{ color: "#FCBA38", fontSize: { xs: "16px", sm: "20px", lg: "48px" } }} />
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
                  fontWeight: "semibold",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "20px" },
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
    
          <Box container spacing={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box item xs={12} md={8}>
              <TextField
                placeholder="Município"
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
            </Box>
            <Box item xs={12} md={4}>
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
                    fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "20px" },
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
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'pink',
                        color: '#000000',
                        borderWidth: "thin",
                        fontSize: { xs: "0.875rem", sm: "1rem", lg: "24px" },
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000000',
                        color: '#000000',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000000',
                        color: '#000000',
                      },
                      '.MuiSvgIcon-root ': {
                        backgroundColor: '#12447F',
                        borderRadius: '50%',
                        color: '#ffffff',
                      },
                      '.MuiSelect-outlined': {
                        borderColor: '#000000',
                        color: '#000000',
                      },
                      '&.MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000', // <------------------ outline-color by default
            },
            '&:hover fieldset': {
              borderColor: '#000000', // <------------------ outline-color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000', // <------------------ outline-color on focus
            },
          }
                    }}
                  >
                    <MenuItem value="recent">Mais recente</MenuItem>
                    <MenuItem value="oldest">Mais antigo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
    
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

