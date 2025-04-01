import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LegendItem = ({ backgroundColor, count, title, description }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          bgcolor: backgroundColor,
          color: backgroundColor === "white" ? "#525252" : "white",
          border: backgroundColor === "white" ? "1px solid #d3d3d3" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 1.5,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          fontSize: "0.8rem"
        }}
      >
        {count}
      </Box>
      <Box>
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
        <Typography 
          variant="caption" 
          component="p" 
          sx={{ 
            fontSize: "0.8rem",
            lineHeight: 1.2,
            color: "#525252"
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default function MapLegend({ selectedMissao, levelDistribution }) {
  // Get counts from levelDistribution if available
  console.log({teste: levelDistribution})

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
            description="Todas etapas foram finalizadas"
          />
          <LegendItem
            backgroundColor="#72C576"
            count=""
            title="Em Andamento"
            description="Missão está em progresso"
          />
          <LegendItem
            backgroundColor="#9F9F9F"
            count=""
            title="Pendente"
            description="Missão ainda não iniciada"
          />
        </Box>
      ) : (
        // General performance legend
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <LegendItem
            backgroundColor="#707070"
            count={level0Count}
            title="Não iniciado"
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
            description="Entre 101 e 200 pontos"
          />
          <LegendItem
            backgroundColor="#12447f"
            count={level3Count}
            title="Nível 3"
            description="201 pontos ou mais"
          />
          <LegendItem
            backgroundColor="white"
            count={npCount}
            title="Não aderiu"
            description="Município não participante"
          />
        </Box>
      )}
    </Paper>
  );
} 