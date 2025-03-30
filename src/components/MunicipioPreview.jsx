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

  useEffect(() => {
    console.log({municipioData});
  }, [municipioData]);

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          bgcolor: "#333333",
          color: "white",
          p: { xs: 2, sm: 3 },
          borderRadius: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200
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
          overflow: "hidden",
          height: "100%",
        }}
      >
        <Box p={{ xs: 2, sm: 3 }}>
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
              <Typography variant="h5" fontWeight="bold" mb={0.5}>
                {municipio.nome}
              </Typography>
              
              <Box mt={1} mb={2}>
                <Chip
                  label="Não participante"
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333333",
                  }}
                />
              </Box>
              
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
    if (points >= 200) return "#12447F"; // Blue
    if (points >= 101) return "#066829"; // Dark green
    if (points >= 1) return "#50B755"; // Light green
    return "#707070"; // Gray
  };

  // Calculate progress for progress bar (max 100%)
  const getProgressPercentage = (points) => {
    if (points >= 200) return 100;
    if (points >= 101) return (points - 101) / 0.99 + 50; // 50-99%
    if (points >= 1) return points / 2; // 0.5-50%
    return 0;
  };

  // Get the most recent mission
  const getRecentMission = () => {
    if (!municipio.desempenhos || municipio.desempenhos.length === 0) return null;
    
    // If a mission ID is selected, try to find it first
    if (selectedMissionId) {
      const selectedMission = municipio.desempenhos.find(d => 
        d.missao.id === selectedMissionId
      );
      if (selectedMission) return selectedMission;
    }
    
    // Otherwise get the first mission with VALID status, or the first mission if none are valid
    const validMission = municipio.desempenhos.find(d => d.validation_status === "VALID");
    return validMission || municipio.desempenhos[0];
  };

  const recentMission = getRecentMission();
  const evidenceItems = recentMission ? 
    JSON.parse(recentMission.missao.evidencias) : [];
  
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
        height: "100%",
      }}
    >
      <Box p={{ xs: 2, sm: 3 }}>
        {/* Header with image and title */}
        <Box display="flex" gap={2} mb={2}>
          <Box 
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "#444444",
              position: "relative"
            }}
          >
            {imageUrl && !imgError ? (
              <Avatar
                src={imageUrl}
                alt={`${nome} logo`}
                variant="square"
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
              <Typography color={levelColor} variant="subtitle1">
                {level}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography color={levelColor} variant="subtitle1" fontWeight="medium">
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
                  height: 8,
                  borderRadius: 1,
                  bgcolor: "#dedede",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: levelColor,
                    borderRadius: 1,
                  }
                }}
              />
            </Box>

            {/* Stats */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                icon={<StarOutlined />}
                label={`${points} pontos`}
                sx={{
                  bgcolor: "#fdf9de",
                  color: "#333333",
                  "& .MuiChip-icon": {
                    color: "#fcba38"
                  }
                }}
              />
              <Chip
                icon={<EmojiEventsOutlined />}
                label={`${badges} emblemas`}
                sx={{
                  bgcolor: "#e7eef8",
                  color: "#333333",
                  "& .MuiChip-icon": {
                    color: "#1f5bb4"
                  }
                }}
              />
              <Chip
                label={status}
                sx={{
                  bgcolor: status === "Participante" ? "#e8f5e9" : "#f5f5f5",
                  color: "#333333",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Evidence section - only show if we have a selected mission and a recent mission */}
        {selectedMissionId && recentMission && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              {recentMission.missao.descricao_da_missao}
            </Typography>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
            <Typography variant="body2" color="text.secondary" mb={2} sx={{ color: "#cccccc" }}>
              Evidências necessárias:
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={1}>
              {evidenceItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "white",
                    color: "black",
                    borderRadius: "20px",
                    py: 1,
                    px: 2
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {index + 1}. {item.titulo}
                  </Typography>
                  <Tooltip 
                    title={item.descricao || "Evidência necessária para concluir a missão"} 
                    arrow 
                    placement="top"
                  >
                    <InfoOutlined
                      sx={{
                        ml: "auto",
                        color: "#1f5bb4",
                        fontSize: 18,
                        cursor: "pointer"
                      }}
                    />
                  </Tooltip>
                </Box>
              ))}
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
          VER PERFIL
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