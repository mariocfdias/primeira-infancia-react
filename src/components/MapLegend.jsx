import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
const LegendItem = ({ backgroundColor, count, title, description, fontWeight, color }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5, width: "100%" }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          bgcolor: backgroundColor,
          fontWeight: fontWeight || "normal",
          color: color || "white",
          border: backgroundColor === "#ffffff" || backgroundColor === "white" ? "1px solid #000000" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 1.5,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          fontSize: "0.8rem",
          flex: "0 0 auto",
          borderRadius: 1
        }}
      >
        {count || 0}
        {title == "Concluída" ? <StarIcon /> : ""}
      </Box>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        flex: 1,
        minHeight: 40
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: "bold", 
            fontSize: "0.9rem",
            lineHeight: 1.2,
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography 
            variant="caption" 
            component="p" 
            sx={{ 
              fontSize: "0.8rem",
              lineHeight: 1.2,
              color: "#525252",
              backgroundColor: "#ffffff",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default function MapLegend({ selectedMissao, levelDistribution }) {
  // Get counts from levelDistribution if available

  const getLevelCount = (level) => {
    if (!levelDistribution) return 0;
    const levelData = levelDistribution.find(l => l.level === level);
    return levelData ? levelData.count : 0;
  };

  const npCount = getLevelCount("NP");
  const level0Count = getLevelCount(0);
  const level1Count = getLevelCount(1);
  const level2Count = getLevelCount(2);
  const level3Count = getLevelCount(3);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #d3d3d3",
        borderRadius: 1,
        bgcolor: "white",
        width: "100%",
        mb: 3
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          mb: 2,
          fontSize: "1rem"
        }}
      >
        {selectedMissao ? "Status da Missão" : "Níveis de participação"}
      </Typography>
      
      {selectedMissao ? (
        // Mission specific legend
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <LegendItem
            backgroundColor="#12447f"
            count="" 
            title="Concluída"
          />
          <LegendItem
            backgroundColor="#72C576"
            count=""
            title="Em Andamento"
          />
          <LegendItem
            backgroundColor="#9F9F9F"
            count=""
            title="Pendente"
          />
          <LegendItem
            backgroundColor="#ffffff"
            color="#525252"
            count=""
            title="Não aderiram ao Pacto"
          />
        </Box>
      ) : (
        // General performance legend
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <LegendItem
            backgroundColor="#81BBFF"
            color="#000000"
            count={level0Count}
            title="Iniciantes"
            fontWeight="bold"
            description="Município sem pontos"
          />
          <LegendItem
            backgroundColor="#50B755"
            count={level1Count}
            title="Nível 1"
            description="Entre 1 e 100 pontos"
          />
          <LegendItem
            backgroundColor="#066829"
            count={level2Count}
            title="Nível 2"
            description="Entre 101 e 199 pontos"
          />
          <LegendItem
            backgroundColor="#12447f"
            count={level3Count}
            title="Concluído"
            description="200 pontos"
          />
          <LegendItem
            backgroundColor="#ffffff"
            count={npCount}
            color="#525252"
            title="Não Aderentes"
            description="Município não participante"
          />
        </Box>
      )}
    </Paper>
  );
} 