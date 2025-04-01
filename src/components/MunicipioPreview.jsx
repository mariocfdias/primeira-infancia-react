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
  codIbge,
  missaoId,
  onViewProfile = () => {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imgError, setImgError] = useState(false);
  const { makeRequest, loading } = useApiRequest();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Handle image load error
  const handleImageError = (e) => {
    console.error("Image loading error:", e.target.src, e);
    setImgError(true);
  };

  // Format Google Drive image URL if it's a drive URL
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Check if it's a Google Drive link (file/d/ format)
    const driveMatch = imageUrl.match(/drive\.google\.com\/file\/d\/(.*?)\/view/);
    if (driveMatch && driveMatch[1]) {
      const imageId = driveMatch[1];
      return `https://lh3.google.com/u/0/d/${imageId}`;
    }
    
    // Check if it's a Google Drive link (uc?export=view&id= format)
    const ucMatch = imageUrl.match(/drive\.google\.com\/uc\?export=view&id=(.*?)(?:&|$)/);
    if (ucMatch && ucMatch[1]) {
      const imageId = ucMatch[1];
      console.log({imageId})
      return `https://lh3.google.com/u/0/d/${imageId}`;
    }
    
    // If not a Drive URL, return the original URL
    return imageUrl;
  };

  // Fetch data when codIbge or missaoId changes
  useEffect(() => {
    const fetchData = async () => {
      if (!codIbge) {
        setData(null);
        setError(null);
        return;
      }
      
      try {
        let response;
        if (missaoId) {
          // Fetch mission-specific data
          response = await makeRequest(() => 
            services.desempenhosService.getDesempenhoByMunicipioAndMissao(
              codIbge,
              missaoId
            )
          );
        } else {
          // Fetch general panorama data
          response = await makeRequest(() => 
            services.dashboardService.getMapPanoramaByIbge(codIbge)
          );
        }

        if (response && response.status === 'success' && response.data) {
          setData(response.data);
          setError(null);
        } else {
          setData(null);
          setError('Failed to fetch data');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
        setError(error.message);
      }
    };

    fetchData();
  }, [codIbge, missaoId, makeRequest]);

  if (loading) {
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

  if (error) {
    return (
      <Paper
        elevation={2}
        sx={{
          bgcolor: "#333333",
          color: "white",
          p: { xs: 2, sm: 3 },
          borderRadius: 1,
        }}
      >
        <Alert severity="error">
          Erro ao carregar dados: {error}
        </Alert>
      </Paper>
    );
  }

  if (!codIbge) {
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "1rem", sm: "1.2rem", lg: "1.5rem" },
              textAlign: "center"
            }}
          >
            Selecione o município para visualizar os detalhes da{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              prefeitura
            </Box>
            .
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Extract data based on the type of response
  let municipio, evidence, missao, points, badges, status, nome;
  
  if (missaoId) {
    // Mission-specific data
    municipio = data?.municipio || {};
    evidence = data?.evidence || [];
    missao = data?.missao || {};
    points = municipio?.points || 0;
    badges = municipio?.badges || 0;
    status = municipio?.status || "Desconhecido";
    nome = municipio?.nome || "Município";
  } else {
    // General panorama data
    municipio = data?.mapPanorama?.municipio || {};
    points = data?.totalPoints || 0;
    badges = municipio?.badges || 0;
    status = municipio?.status || "Desconhecido";
    nome = municipio?.nome || "Município";
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
  
  const level = getLevel(points);
  const levelColor = getLevelColor(points);
  const progressPercentage = getProgressPercentage(points);
  const imageUrl = formatImageUrl(municipio?.imagemAvatar);

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
        {
          console.log({imgError, imageUrl})
        }
        <Box display="flex" gap={2} mb={2} >
          <Box 
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100, lg: 140 },
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "#444444",
              position: "relative"
            }}
          >
            {imageUrl ? (
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
        <Box display="flex" gap={1} justifyContent="flex-start">
          <Chip
            avatar={<Avatar sx={{ bgcolor: "#1f5bb4", color: "#ffffff", fontSize: "0.75rem", width: 24, height: 24 }}>
              <Typography variant="body2" fontWeight="bold" color="#ffffff">{data?.mapPanorama?.countValid || 0}</Typography>
            </Avatar>}
            label={`Concluídas`}
            sx={{
              bgcolor: "#ffffff",
              color: "#333333"
            }}
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: "#27884A", color: "#ffffff", fontSize: "0.75rem", width: 24, height: 24 }}>
              <Typography variant="body2" fontWeight="bold" color="#ffffff">{data?.mapPanorama?.countStarted || 0}</Typography>
            </Avatar>}
            label={`Em ação`}
            sx={{
              bgcolor: "#ffffff",
              color: "#333333"
            }}
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: "#000000", color: "#ffffff", fontSize: "0.75rem", width: 24, height: 24 }}>
              <Typography variant="body2" fontWeight="bold" color="#ffffff">{data?.mapPanorama?.countPending || 0}</Typography>
            </Avatar>}
            label={`Pendentes`}
            sx={{
              bgcolor: "#ffffff",
              color: "#333333"
            }}
          />
        </Box>

        {/* Evidence section - only show if we have mission data */}
        {missaoId && missao && evidence && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{fontSize: { xs: "12px", sm: "14px", lg: "18px", letterSpacing: "0.5px" }}}>
              {missao.descricao_da_missao}
            </Typography>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
            <Typography variant="body2" color="text.secondary" mb={2} sx={{ color: "#ffffff", fontWeight: "400", fontSize: { xs: "12px", sm: "14px", lg: "20px" } }}>
              Evidências desta missão:
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={1}>
              {evidence.length > 0 && (
                evidence.map((item, index) => {
                  console.log({item})
                  let itemStatus = "pending";
                  if (data.validation_status === "VALID") {
                    itemStatus = "completed";
                  }
                  return (
                    <EvidenceItem
                      key={index}
                      id={index + 1}
                      title={item.titulo}
                      description={item.descricao}
                      evidence={item.evidence}
                      status={itemStatus}
                    />
                  );
                })
              )}
              {evidence.length === 0 && (
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
          <Typography fontWeight="bold" fontSize={"16px"} sx={{letterSpacing: "2px"}} color="#ffffff">
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
  const codIbgeChanged = prevProps.codIbge !== nextProps.codIbge;
  const missaoIdChanged = prevProps.missaoId !== nextProps.missaoId;
  const viewProfileChanged = prevProps.onViewProfile !== nextProps.onViewProfile;
  
  // If any important prop changed, we should re-render
  return !(codIbgeChanged || missaoIdChanged || viewProfileChanged);
}); 