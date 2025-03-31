import { useEffect, useState } from 'react';
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Avatar, 
  Chip, 
  Button, 
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Tooltip
} from '@mui/material';
import { InfoOutlined, StarOutlined, Star, OpenInNew, EmojiEventsOutlined } from '@mui/icons-material';
import EvidenceItem from './EvidenceItem'
import { useApiRequest, services } from '../api';

const MunicipioPreview = ({ 
  municipioData, 
  loading = false, 
  selectedMissionId = null, 
  isNonParticipant = false,
  onViewProfile = () => {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imgError, setImgError] = useState(false);
  const { makeRequest, loading: fetchingMission } = useApiRequest();
  const [missionInfo, setMissionInfo] = useState(null);
  const [evidenceItems, setEvidenceItems] = useState([]);

  console.log({municipioData, selectedMissionId})
  // Handle image load error
  const handleImageError = () => {
    setImgError(true);
  };

  // Extract municipio data correctly
  const municipio = municipioData?.data || {};

  // Format Google Drive image URL if it's a drive URL
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Check if it's a Google Drive link
    const driveMatch = imageUrl.match(/drive\.google\.com\/file\/d\/(.*?)\/view/);
    if (driveMatch && driveMatch[1]) {
      const imageId = driveMatch[1];
      return `https://drive.google.com/thumbnail?id=${imageId}`;
    }
    
    // If not a Drive URL, return the original URL
    return imageUrl;
  };

  // Fetch mission data when selectedMissionId changes
  useEffect(() => {
    const fetchMissionData = async () => {
      if (!selectedMissionId || !municipio.codIbge) {
        setMissionInfo(null);
        setEvidenceItems([]);
        return;
      }
      
      try {
        const response = await makeRequest(() => 
          services.desempenhosService.getDesempenhoByMunicipioAndMissao(
            municipio.codIbge,
            selectedMissionId
          )
        );

        console.log({response})

        if (response && response.status === 'success' && response.data) {
          // Set mission info
          setMissionInfo(response.data);
          
          // Process evidence items
          let items = [];
          
          try {
            // Simply use the evidence array directly from the API response
            if (response.data.evidence && Array.isArray(response.data.evidence)) {
              items = response.data.evidence;
            }
          } catch (e) {
            console.error("Failed to process evidence items:", e);
          }
          
          setEvidenceItems(items);
        } else {
          setMissionInfo(null);
          setEvidenceItems([]);
        }
      } catch (error) {
        console.error("Error fetching mission data:", error);
        setMissionInfo(null);
        setEvidenceItems([]);
      }
    };

    fetchMissionData();
  }, [selectedMissionId, municipio.codIbge, makeRequest]);

  useEffect(() => {
    console.log({municipioData});
  }, [municipioData]);

  if (loading || fetchingMission) {
    return (
      <Paper
        elevation={2}
        sx={{
          bgcolor: "#333333",
          color: "white",
          p: { xs: 2, sm: 3 },
          borderRadius: 1,
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress color="inherit" size={28} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Carregando dados do município...
        </Typography>
      </Paper>
    );
  }

  if (!municipioData) {
    return (
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
    );
  }
  
  // Special render for non-participating municipalities
  if (isNonParticipant || municipio.status === "Não participante") {
    return (
      <Paper
        elevation={2}
        sx={{
          bgcolor: "#333333",
          color: "white",
          borderRadius: 1,
          minHeight: "fit-content"
        }}
      >
        <Box 
          p={{ xs: 2, sm: 3 }}
          sx={{
            display: "flex", 
            flexDirection: "column"
          }}
        >
          {/* Header with initial and title */}
          <Box display="flex" gap={2} mb={2}>
            <Box 
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                borderRadius: 1,
                overflow: "hidden",
                flexShrink: 0,
                bgcolor: "#555555",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: "2rem", sm: "2.5rem" },
                fontWeight: "bold",
                color: "#ffffff",
                opacity: 0.7
              }}
            >
              {municipio.nome ? municipio.nome.charAt(0) : "?"}
            </Box>

            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" mb={0.5} sx={{fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "20px" }}}>
                {municipio.nome}
              </Typography>
              
              
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  "& .MuiAlert-icon": {
                    color: "#ffffff"
                  },
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff"
                }}
              >
                Este município ainda não aderiu ao Pacto pela Primeira Infância. 
              </Alert>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Calculate level based on points
  const getLevel = (points) => {
    if (points >= 200) return "Nível 3";
    if (points >= 101) return "Nível 2";
    if (points >= 1) return "Nível 1";
    return "Não iniciado";
  };

  // Get color based on level
  const getLevelColor = (points) => {
    if (points >= 1) return "#FFCA61"; 
    return "#707070";
  };

  // Calculate progress for progress bar (max 100%)
  const getProgressPercentage = (points) => {
    if (points >= 200) return 100;
    if (points >= 101) return (points - 101) / 0.99 + 50; // 50-99%
    if (points >= 1) return points / 2; // 0.5-50%
    return 0;
  };
  
  // Safely access properties with default values
  const points = municipio.points || 0;
  const badges = municipio.badges || 0;
  const status = municipio.status || "Desconhecido";
  const nome = municipio.nome || "Município";
  
  const level = getLevel(points);
  const levelColor = getLevelColor(points);
  const progressPercentage = getProgressPercentage(points);
  const imageUrl = formatImageUrl(municipio.imagemAvatar);

  return (
    <Paper
      elevation={2}
      sx={{
        bgcolor: "#333333",
        color: "white",
        borderRadius: 1,
        overflow: "hidden",
        minHeight: "fit-content"
      }}
    >
      <Box 
        p={{ xs: 2, sm: 3 }} 
        sx={{
          display: "flex", 
          flexDirection: "column"
        }}
      >
        {/* Header with image and title */}
        <Box display="flex" gap={2} mb={2} >
          <Box 
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100, lg: 140 },
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "#444444",
              position: "relative"                        }}
          >
            {imageUrl && !imgError ? (
              <Avatar
                src={imageUrl}
                alt={`${nome} logo`}
                height={"100%"}
                sx={{ 
                  width: "100%",
                  height: "100%"
                }}
                onError={handleImageError}
              />
            ) : (
              <Box 
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  fontWeight: "bold",
                  color: "#ffffff",
                  opacity: 0.7
                }}
              >
                {nome.charAt(0)}
              </Box>
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold" mb={0.5}>
              {nome}
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color={levelColor} fontFamily={"Atkinson Hyperlegible"} sx={{fontSize: { xs: "0.875rem", sm: "1rem", lg: "20px" }}}>
                {level}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography color={levelColor} variant="subtitle1" fontWeight="medium"                 
                fontFamily={"Atkinson Hyperlegible"}
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem", lg: "20px" }}}> 
                  {points}/100
                </Typography>
                <Star sx={{ color: levelColor }} />
              </Box>
            </Box>

            {/* Progress bar */}
            <Box mt={1} mb={2}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 16,
                  borderRadius: 10,
                  bgcolor: "#dedede",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: levelColor,
                    borderRadius: 1,
                  }
                }}
              />
            </Box>

            {/* Stats */}
            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
       
              <Box display="flex" alignItems="center" gap={0.5} bgcolor="#FDF9DE" borderRadius={2} p={0.5}>
              <StarOutlined sx={{ color: "#FCBA38", fontSize: "24px" }} />
              </Box>
              <Typography variant="body2" fontWeight="400" fontSize={"16px"} fontFamily={"Atkinson Hyperlegible"} color="#ffffff">
                    {points} pontos
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5} bgcolor="#E7EEF8" borderRadius={2} p={0.5}>
              <EmojiEventsOutlined sx={{ color: "#0076B1", fontSize: "24px" }} />
              </Box>
              <Typography variant="body2" fontWeight="400" fontSize={"16px"} fontFamily={"Atkinson Hyperlegible"} color="#ffffff">
              {badges} emblemas
                  </Typography>
              
            </Box>
          </Box>


        </Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{fontSize: { xs: "12px", sm: "14px", lg: "20px" }}}>
        Missões
        </Typography>
        <Box display="flex"  gap={1} justifyContent="flex-start">
              <Chip
                avatar={<Avatar sx={{ bgcolor: "#1f5bb4", color: "#ffffff", fontSize: "0.75rem", width: 24, height: 24 }}>
                  <Typography variant="body2" fontWeight="bold" color="#ffffff">{badges}</Typography>
                </Avatar>}
                label={`Concluídas`}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#333333"
                }}
              />
              <Chip
                avatar={<Avatar sx={{ bgcolor: "#27884A", color: "#ffffff", fontSize: "0.75rem", width: 24, height: 24 }}>
                  <Typography variant="body2" fontWeight="bold" color="#ffffff">{badges}</Typography>
                </Avatar>}
                label={`Em ação`}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#333333"
                }}
              />
              <Chip
                avatar={<Avatar sx={{ bgcolor: "#000000", color: "#ffffff", fontSize: "0.75rem", width: 24, height: 24 }}>
                  <Typography variant="body2" fontWeight="bold" color="#ffffff">{badges}</Typography>
                </Avatar>}
                label={`Pendentes`}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#333333"
                }}
              />
          </Box>
        {/* Evidence section - only show if we have mission data */}
        {selectedMissionId && missionInfo && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{fontSize: { xs: "12px", sm: "14px", lg: "18px", letterSpacing: "0.5px" }}}>
              {missionInfo.missao?.descricao_da_missao}
            </Typography>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
            <Typography variant="body2" color="text.secondary" mb={2} sx={{ color: "#ffffff", fontWeight: "400", fontSize: { xs: "12px", sm: "14px", lg: "20px" } }}>
              Evidências desta missão:
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={1}>
              {console.log({evidenceItems})}
              {evidenceItems.length > 0 && (
                evidenceItems.map((item, index) => {
                  // Map API status to component status
                  let itemStatus = "pending";
                  if (missionInfo.validation_status === "VALID") {
                    itemStatus = "completed";
                  }
                  return (
                    <EvidenceItem
                      key={index}
                      id={index + 1}
                      title={item.titulo}
                      description={item.descricao}
                      evidence={item.evidencia}
                      status={itemStatus}
                    />
                  );
                })
              )}
              {evidenceItems.length === 0 && (
                <Typography variant="body2" sx={{ color: "#999999" }}>
                  Nenhuma evidência encontrada para esta missão.
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* View Profile button */}
        <Button
          variant="contained"
          fullWidth
          onClick={onViewProfile}
          sx={{
            mt: 3,
            bgcolor: "#1f5bb4",
            color: "white",
            py: 1.5,
            fontSize: "0.9rem",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#12447f"
            }
          }}
          endIcon={<OpenInNew />}
        >
          <Typography  fontWeight="bold" fontSize={"16px"} sx={{letterSpacing: "2px"}} color="#ffffff">
            VER PERFIL
          </Typography>
        </Button>
      </Box>
    </Paper>
  );
};

// Use React.memo with a custom comparison function to optimize re-renders
export default React.memo(MunicipioPreview, (prevProps, nextProps) => {
  // Only re-render if relevant props have changed
  const dataChanged = prevProps.municipioData?.data?.codIbge !== nextProps.municipioData?.data?.codIbge;
  const loadingChanged = prevProps.loading !== nextProps.loading;
  const missionChanged = prevProps.selectedMissionId !== nextProps.selectedMissionId;
  const participantStatusChanged = prevProps.isNonParticipant !== nextProps.isNonParticipant;
  const viewProfileChanged = prevProps.onViewProfile !== nextProps.onViewProfile;
  
  // If any important prop changed, we should re-render
  return !(dataChanged || loadingChanged || missionChanged || participantStatusChanged || viewProfileChanged);
}); 