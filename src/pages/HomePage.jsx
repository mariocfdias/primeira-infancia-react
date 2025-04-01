import React, { useEffect, useState, useMemo, useRef } from 'react'
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
import { useLocation, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const theme = useTheme()
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const codIbgeParam = urlParams.get('codIbge');
  
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  
  // Create a ref to store all API data states to prevent unnecessary reloads
  const dataRef = useRef({
    municipios: [],
    missoes: [],
    missionPanorama: [],
    mapPanorama: null,
    eventos: [],
    missionPanoramaCache: {},
    municipioCache: {},
  });
  
  // Single instance of useApiRequest for general data fetching
  const { makeRequest, loading, error, data } = useApiRequest()
  
  // State variables with stable references
  const [municipios, setMunicipios] = useState([])
  const [selectedMunicipio, setSelectedMunicipio] = useState(null)
  const [selectedMissao, setSelectedMissao] = useState(null)
  const [missionPanoramaById, setMissionPanoramaById] = useState(null)
  const [eventos, setEventos] = useState([])
  const [missoes, setMissoes] = useState([])
  const [missionPanorama, setMissionPanorama] = useState([])
  const [mapPanorama, setMapPanorama] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [eventFilter, setEventFilter] = useState("mission_completed")
  const [showMunicipioPage, setShowMunicipioPage] = useState(false)
  const [nonParticipantMunicipio, setNonParticipantMunicipio] = useState(null);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    municipios: false,
    missoes: false,
    missionPanorama: false,
    mapPanorama: false,
    eventos: false,
    municipio: false,
    missionPanoramaById: false
  });
  
  // Error states
  const [errorStates, setErrorStates] = useState({
    municipios: null,
    missoes: null,
    missionPanorama: null,
    mapPanorama: null,
    eventos: null,
    municipio: null,
    missionPanoramaById: null
  });
  
  // Helper function to update loading state
  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({...prev, [key]: isLoading}));
  };
  
  // Helper function to update error state
  const setError = (key, error) => {
    setErrorStates(prev => ({...prev, [key]: error}));
  };
  
  // Check URL parameter on component mount
  useEffect(() => {
    if (codIbgeParam) {
      setShowMunicipioPage(true);
      
      // Find the municipio in our list if it exists
      const municipio = municipios.find(m => m.codIbge === codIbgeParam);
      if (municipio) {
        setSelectedMunicipio(municipio);
        
        // Check if we need to fetch more data for this municipality
        if (!dataRef.current.municipioCache[codIbgeParam]) {
          fetchMunicipioByIbge(codIbgeParam);
        }
      }
    }
  }, [codIbgeParam, municipios]);

  // Add useEffect to track changes to missionPanoramaById
  useEffect(() => {
    console.log('missionPanoramaById updated:', missionPanoramaById);
  }, [missionPanoramaById]);

  // Fetch municipios on component mount
  useEffect(() => {
    fetchMunicipios();
  }, []);

  // Fetch missoes data on component mount
  useEffect(() => {
    fetchMissoes();
  }, []);

  // Fetch mission panorama data
  useEffect(() => {
    fetchMissionPanorama();
  }, []);

  // Fetch map panorama data
  useEffect(() => {
    fetchMapPanorama();
  }, []);

  // Fetch eventos based on filters and pagination
  useEffect(() => {
    fetchEventos();
  }, [currentPage, eventFilter]);

  // Fetch municipios function
  const fetchMunicipios = async () => {
    try {
      setLoading('municipios', true);
      const response = await makeRequest(services.municipiosService.getAllMunicipios);
      setLoading('municipios', false);
      
      if (response && response.status === 'success' && Array.isArray(response.data)) {
        setMunicipios(response.data);
        dataRef.current.municipios = response.data;
      }
    } catch (error) {
      console.error("Error fetching municipios:", error);
      setError('municipios', error);
      setLoading('municipios', false);
    }
  };

  // Fetch missoes function
  const fetchMissoes = async () => {
    try {
      setLoading('missoes', true);
      const response = await makeRequest(services.missoesService.getAllMissoes);
      setLoading('missoes', false);
      
      if (response && response.status === 'success' && Array.isArray(response.data)) {
        setMissoes(response.data);
        dataRef.current.missoes = response.data;
      }
    } catch (error) {
      console.error("Error fetching missoes:", error);
      setError('missoes', error);
      setLoading('missoes', false);
    }
  };

  // Fetch mission panorama function
  const fetchMissionPanorama = async () => {
    try {
      setLoading('missionPanorama', true);
      const response = await makeRequest(services.dashboardService.getMissionPanorama);
      setLoading('missionPanorama', false);
      
      if (response && response.status === 'success' && Array.isArray(response.data)) {
        setMissionPanorama(response.data);
        dataRef.current.missionPanorama = response.data;
      }
    } catch (error) {
      console.error("Error fetching mission panorama:", error);
      setError('missionPanorama', error);
      setLoading('missionPanorama', false);
    }
  };

  // Fetch map panorama function
  const fetchMapPanorama = async () => {
    try {
      setLoading('mapPanorama', true);
      const response = await makeRequest(services.dashboardService.getMapPanorama);
      setLoading('mapPanorama', false);
      
      if (response && response.status === 'success' && response.data) {
        console.log('Map panorama data:', response.data);
        setMapPanorama(response.data);
        dataRef.current.mapPanorama = response.data;
      }
    } catch (error) {
      console.error("Error fetching map panorama:", error);
      setError('mapPanorama', error);
      setLoading('mapPanorama', false);
    }
  };

  // Fetch eventos function
  const fetchEventos = async () => {
    try {
      setLoading('eventos', true);
      const params = {
        page: currentPage,
        limit: 100,
        event: eventFilter,
        sortDirection: "DESC"
      };
      
      const response = await makeRequest(() => services.eventosService.getEventos(params));
      setLoading('eventos', false);
      
      if (response && response.status === 'success' && Array.isArray(response.data)) {
        setEventos(response.data);
        dataRef.current.eventos = response.data;
        
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      }
    } catch (error) {
      console.error("Error fetching eventos:", error);
      setError('eventos', error);
      setLoading('eventos', false);
    }
  };

  // Fetch municipio by IBGE code
  const fetchMunicipioByIbge = async (codIbge) => {
    if (dataRef.current.municipioCache[codIbge]) {
      return dataRef.current.municipioCache[codIbge];
    }
    
    try {
      setLoading('municipio', true);
      const response = await makeRequest(() => services.municipiosService.getMunicipioByIbge(codIbge));
      setLoading('municipio', false);
      
      if (response && response.status === 'success') {
        // Save to cache
        const updatedCache = {...dataRef.current.municipioCache, [codIbge]: response};
        dataRef.current.municipioCache = updatedCache;
        return response;
      }
    } catch (error) {
      console.error("Error fetching municipio by IBGE:", error);
      setError('municipio', error);
      setLoading('municipio', false);
    }
    
    return null;
  };

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
      if (dataRef.current.missionPanoramaCache[missionId]) {
        console.log('Using cached mission panorama data for ID:', missionId);
        setMissionPanoramaById(dataRef.current.missionPanoramaCache[missionId]);
        return;
      }
      
      setLoading('missionPanoramaById', true);
      const response = await makeRequest(() => 
        services.dashboardService.getMissionPanoramaById(missionId)
      );
      setLoading('missionPanoramaById', false);
      
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
        const updatedCache = {...dataRef.current.missionPanoramaCache, [missionId]: formattedData};
        dataRef.current.missionPanoramaCache = updatedCache;
        setMissionPanoramaById(formattedData);
      }
      
      // If there's a selected municipality, we need to refetch its data to update mission-specific information
      if (selectedMunicipio && selectedMunicipio !== "all" && selectedMunicipio !== "") {
        if (selectedMunicipio.codIbge) {
          const codIbge = selectedMunicipio.codIbge;
          // Refetch municipality data to get updated mission status
          fetchMunicipioByIbge(codIbge);
        }
      }
    } catch (error) {
      console.error("Error fetching mission panorama by ID:", error);
      setError('missionPanoramaById', error);
      setLoading('missionPanoramaById', false);
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
      fetchMunicipioByIbge(codIbge);
    }
  };

  // Handle municipality selection from map
  const handleMapMunicipioSelect = (codIbge) => {
    // If the same municipality is already selected, don't make another API call
    if (selectedMunicipio?.codIbge === codIbge && 
        (dataRef.current.municipioCache[codIbge] || nonParticipantMunicipio)) {
      return;
    }
    
    // Clear any previous non-participant data
    setNonParticipantMunicipio(null);
    
    // Find the municipio in our list
    const municipio = municipios.find(m => m.codIbge === codIbge);
    
    if (municipio) {
      // Set the selected municipio using the full object
      setSelectedMunicipio(municipio);
      fetchMunicipioByIbge(codIbge);
    } else {
      // Create a basic object for municipalities not in our list
      const basicMunicipio = {
        codIbge: codIbge,
        nome: `Município ${codIbge}`
      };
      
      setSelectedMunicipio(basicMunicipio);
      
      // Try to fetch data anyway, might be a municipality that doesn't participate yet
      fetchMunicipioByIbge(codIbge)
        .then(response => {
          if (!response) {
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
          }
        });
    }
  };

  // Handle "Ver perfil" button click
  const handleViewProfile = () => {
    // Just set the state to show the profile page
    setShowMunicipioPage(true);
  }

  // Handle back button from MunicipioPage
  const handleBackFromMunicipioPage = () => {
    // Just set the state to hide the profile page
    setShowMunicipioPage(false);
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
    if (loadingStates.missoes || loadingStates.missionPanorama) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (errorStates.missoes || errorStates.missionPanorama) {
      return (
        <Grid item xs={12}>
          <Alert severity="error">
            Erro ao carregar as missões: {(errorStates.missoes || errorStates.missionPanorama)?.message}
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
  }, [missoes, selectedMissao, loadingStates.missoes, loadingStates.missionPanorama, 
      errorStates.missoes, errorStates.missionPanorama, getMissionProgress]);

  // Memoize the MunicipioPreview component
  const memoizedMunicipioPreview = useMemo(() => {    
    return (
      <MunicipioPreview
        codIbge={selectedMunicipio?.codIbge}
        missaoId={selectedMissao}
        onViewProfile={handleViewProfile}
      />
    );
  }, [selectedMunicipio, selectedMissao]);

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
      {showMunicipioPage || codIbgeParam ? (
        <MunicipioPage 
          ibge={selectedMunicipio?.codIbge || codIbgeParam}
          onBack={handleBackFromMunicipioPage}
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
                  fontWeight: "800",
                  mr: 2,
                  color: "#12447f",
                  fontSize: { xs: "40px", sm: "48px", lg: "96px" },
                }}
              >
                {loadingStates.mapPanorama ? <CircularProgress size={24} /> : (mapPanorama?.totalParticipatingPrefeituras || municipios.length || 0)}
              </Typography>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#12447f",
                    fontSize: { xs: "16px", sm: "18px", lg: "48px" },
                    letterSpacing: "0.02em",
                    mt: -1
                  }}
                >
                  prefeituras
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333333",
                    fontSize: { xs: "14px", sm: "16px", lg: "36px" },
                    mt: -3.4,
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
                  fontSize: { xs: "40px", sm: "48px", lg: "96px" },
                }}
              >
                {loadingStates.mapPanorama ? <CircularProgress size={24} /> : `${(mapPanorama?.percentageFinishedMissions || 0).toFixed(1)}%`}
              </Typography>
              <Box>
              <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#12447f",
                    fontSize: { xs: "16px", sm: "18px", lg: "48px" },
                    mb: 0,
                    mt: -3,
                    letterSpacing: "0.02em"
                  }}
                >
                  das missões
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333333",
                    fontSize: { xs: "14px", sm: "16px", lg: "36px" },
                    mt: -3.4,
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
              fontSize: { xs: "20px", sm: "24px", lg: "32px" },
            }}
          >
            Mapa interativo
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#525252",
              mb: 2,
              fontSize: { xs: "14px", sm: "16px", lg: "20px" },
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
                  levelDistribution={mapPanorama?.desempenho?.levelDistribution}
                />
              </Paper>
              
            </Grid>

{isTablet && (
  <Grid item xs={12} md={12}>
    <MapLegend 
      selectedMissao={selectedMissao}
      levelDistribution={mapPanorama?.desempenho?.levelDistribution} 
    />
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
              <InputLabel htmlFor="my-input" sx={{ fontWeight: "500", color: "#333333", fontSize: { xs: "14px", sm: "16px", lg: "24px" } }}>Prefeituras</InputLabel>
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
                        fontSize: { xs: "14px", sm: "16px", lg: "24px" },
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
         
    
          {errorStates.municipios && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Ocorreu um erro ao carregar os dados dos municípios: {errorStates.municipios.message}
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
              fontSize: { xs: "20px", sm: "24px", lg: "32px" },
            }}
          >
            Panorama de missões
          </Typography>
          <Typography
            sx={{
              color: "#525252",
              mb: 3,
              fontSize: { xs: "14px", sm: "16px", lg: "20px" },
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
              fontSize: { xs: "20px", sm: "24px", lg: "32px" },
            }}
          >
            Quem está avançando?
          </Typography>
          <Typography
            sx={{
              color: "#525252",
              mb: 3,
              fontSize: { xs: "14px", sm: "16px", lg: "20px" },
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
                fontSize: { xs: "14px", sm: "16px", lg: "20px" },
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
                  fontSize: { xs: "12px", sm: "14px", lg: "20px" },
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
                  fontSize: { xs: "12px", sm: "14px", lg: "20px" },
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
    
          <Box container spacing={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3,backgroundColor: "#FFFFFF" }}>
            <Box width={"30%"} sx={{minWidth: "150px"}}>
              <InputLabel 
                htmlFor="municipio-search" 
                sx={{ 
                  fontWeight: "400", 
                  color: "#333333", 
                  fontSize: { xs: "14px", sm: "16px", lg: "20px" },
                  mb: 1
                }}
              >
                Busque por município
              </InputLabel>
              <TextField
                id="municipio-search"
                fullWidth
                variant="outlined"
                placeholder="Município"
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#9f9f9f", fontSize: isMobile ? "1rem" : "20px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& input::placeholder': {
                    color: 'black',
                    opacity: 0.8,
                    fontSize: { xs: "14px", sm: "16px", lg: "20px" },
                  },
                  '.MuiTextField-notchedOutline': {
                    borderColor: 'pink',
                    color: '#000000',
                    borderWidth: "thin",
                    fontSize: { xs: "14px", sm: "16px", lg: "24px" },
                  },
                  '&.Mui-focused .MuiTextField-notchedOutline': {
                    borderColor: '#000000',
                    color: '#000000',
                  },
                  '&:hover .MuiTextField-notchedOutline': {
                    borderColor: '#000000',
                    color: '#000000',
                  },
                  '.MuiTextField-outlined': {
                    borderColor: '#000000',
                    color: '#000000',
                  },
                  '&.MuiTextField-root': {
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
                    fontSize: { xs: "12px", sm: "14px", lg: "20px" },
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
                        fontSize: { xs: "14px", sm: "16px", lg: "24px" },
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
                        margin: "4px",

                      },
                      '.MuiSelect-outlined': {
                        borderColor: '#000000',
                        color: '#000000',
                        marginRight: "4px",

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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4}}>
            {loadingStates.eventos ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : errorStates.eventos ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Ocorreu um erro ao carregar os eventos: {errorStates.eventos.message}
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
                    fontSize: { xs: "12px", sm: "14px" },
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

