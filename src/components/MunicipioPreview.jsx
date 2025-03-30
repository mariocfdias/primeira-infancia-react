import { useState } from 'react';
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
  useMediaQuery
} from '@mui/material';
import { InfoOutlined, StarOutlined, Star, OpenInNew, EmojiEventsOutlined } from '@mui/icons-material';

const MunicipioPreview = ({ municipioData, loading = false, selectedMissionId = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imgError, setImgError] = useState(false);

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
    if (!municipioData.desempenhos || municipioData.desempenhos.length === 0) return null;
    
    // If a mission ID is selected, try to find it first
    if (selectedMissionId) {
      const selectedMission = municipioData.desempenhos.find(d => 
        d.missao.id === selectedMissionId
      );
      if (selectedMission) return selectedMission;
    }
    
    // Otherwise get the first mission with VALID status, or the first mission if none are valid
    const validMission = municipioData.desempenhos.find(d => d.validation_status === "VALID");
    return validMission || municipioData.desempenhos[0];
  };

  const recentMission = getRecentMission();
  const evidenceItems = recentMission ? 
    JSON.parse(recentMission.missao.evidencias) : [];
  
  const level = getLevel(municipioData.points);
  const levelColor = getLevelColor(municipioData.points);
  const progressPercentage = getProgressPercentage(municipioData.points);

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
            {municipioData.imagemAvatar && !imgError ? (
              <Avatar
                src={municipioData.imagemAvatar}
                alt={`${municipioData.nome} logo`}
                variant="square"
                sx={{ 
                  width: "100%",
                  height: "100%"
                }}
                onError={() => setImgError(true)}
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
                {municipioData.nome ? municipioData.nome.charAt(0) : "?"}
              </Box>
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold" mb={0.5}>
              {municipioData.nome}
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color={levelColor} variant="subtitle1">
                {level}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography color={levelColor} variant="subtitle1" fontWeight="medium">
                  {municipioData.points}/200
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
                label={`${municipioData.points} pontos`}
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
                label={`${municipioData.badges} emblemas`}
                sx={{
                  bgcolor: "#e7eef8",
                  color: "#333333",
                  "& .MuiChip-icon": {
                    color: "#1f5bb4"
                  }
                }}
              />
              <Chip
                label={municipioData.status}
                sx={{
                  bgcolor: municipioData.status === "Participante" ? "#e8f5e9" : "#f5f5f5",
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
                  <InfoOutlined
                    sx={{
                      ml: "auto",
                      color: "#1f5bb4",
                      fontSize: 18
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* View Profile button */}
        <Button
          variant="contained"
          fullWidth
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

export default MunicipioPreview; 