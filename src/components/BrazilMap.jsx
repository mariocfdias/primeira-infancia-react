import { useEffect, useState, useRef } from "react"
import { Box, useTheme, useMediaQuery, Typography, Paper } from "@mui/material"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

// Legend Description component
const LegendDescription = ({ backgroundColor, color, description, number, title }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          bgcolor: backgroundColor,
          color: color || "white",
          display: "flex",
          alignItems: "center",
          borderRadius: 1,
          justifyContent: "center",
          fontSize: "1rem",
          mr: 1,
          border: backgroundColor === "white" ? "1px solid #d3d3d3" : "none",
        }}
      >
        {number}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {title && (
          <Typography variant="body2" sx={{ fontSize: "1rem", fontWeight: "medium", lineHeight: 1.2 }}>
            {title}
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontSize: "0.85rem", lineHeight: 1.2 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

// Map Legend component for non-mobile
const MapLegendInternal = ({ selectedMissao, levelDistribution }) => {
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
      elevation={1}
      sx={{
        position: "absolute",
        right: 10,
        bottom: 10,
        zIndex: 1000,
        p: 1.5,
        width: "250px",
        border: "1px solid #d3d3d3",
        borderRadius: 3,
        bgcolor: "rgba(255, 255, 255, 1)",
        fontSize: "1rem",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "medium",
          mb: 1,
          fontSize: "1rem",
        }}
      >
        {selectedMissao ? "Legenda de Missão" : "Legenda"}
      </Typography>
      
      {selectedMissao ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <LegendDescription 
            backgroundColor="#12447F"
            title="Concluída"
            description="Todas etapas foram finalizadas"
          />
          <LegendDescription 
            backgroundColor="#72C576"
            title="Em Andamento"
            description="Missão está em progresso"
          />
          <LegendDescription 
            backgroundColor="#9F9F9F"
            title="Pendente"
            description="Missão ainda não iniciada"
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <LegendDescription 
            backgroundColor="#707070"
            title="Não iniciado"
            description="Município sem pontos"
            number={level0Count}
          />
          <LegendDescription 
            backgroundColor="#50B755"
            title="Nível 1"
            description="Entre 1 e 100 pontos"
            number={level1Count}
          />
          <LegendDescription 
            backgroundColor="#066829"
            title="Nível 2"
            description="Entre 101 e 199 pontos"
            number={level2Count}
          />
          <LegendDescription 
            backgroundColor="#12447f"
            title="Concluído"
            description="200 pontos ou mais"
            number={level3Count}
          />
          <LegendDescription 
            backgroundColor="white"
            color="#525252"
            title="Não aderiu"
            description="Município não participante"
            number={npCount}
          />
        </Box>
      )}
    </Paper>
  );
};

const LeafletMap = ({ geoJsonData, isMobile, missionPanoramaData, selectedMunicipioCode, onMunicipioSelect, levelDistribution }) => {
  const mapRef = useRef(null)
  const geoJsonRef = useRef(null)

  // Log when LeafletMap receives new mission panorama data
  useEffect(() => {
    console.log('LeafletMap received updated missionPanoramaData:', missionPanoramaData);
    
    // Debug function to check missionPanoramaData structure
    if (missionPanoramaData) {
      console.log('Mission panorama data structure check:');
      console.log('Has completedMunicipios?', !!missionPanoramaData.completedMunicipios);
      console.log('Has startedMunicipios?', !!missionPanoramaData.startedMunicipios);
      console.log('Has pendingMunicipios?', !!missionPanoramaData.pendingMunicipios);
      
      // Log the structure of the first item in each array if they exist
      if (missionPanoramaData.completedMunicipios?.length > 0) {
        console.log('Sample completedMunicipios item:', missionPanoramaData.completedMunicipios[0]);
      }
      if (missionPanoramaData.startedMunicipios?.length > 0) {
        console.log('Sample startedMunicipios item:', missionPanoramaData.startedMunicipios[0]);
      }
      if (missionPanoramaData.pendingMunicipios?.length > 0) {
        console.log('Sample pendingMunicipios item:', missionPanoramaData.pendingMunicipios[0]);
      }
    }
  }, [missionPanoramaData]);

  // Check if a municipality is in a specific level group
  const isMunicipioInLevel = (codIbge, levelData) => {
    if (!levelData || !levelData.municipios) return false;
    return levelData.municipios.includes(codIbge);
  };

  // Get municipality name by IBGE code
  const getMunicipioName = (codIbge, feature) => {
    // Use the name from the GeoJSON feature properties
    return feature.properties.name || `Município ${codIbge}`;
  };

  // Get mission status for a municipality
  const getMissionStatus = (codIbge) => {
    if (!missionPanoramaData) return "Não disponível";
    
    if (missionPanoramaData.completedMunicipios?.some(m => m.codIbge === codIbge)) {
      return "Concluída";
    } 
    if (missionPanoramaData.startedMunicipios?.some(m => m.codIbge === codIbge)) {
      return "Em andamento";
    } 
    if (missionPanoramaData.pendingMunicipios?.some(m => m.codIbge === codIbge)) {
      return "Pendente";
    }
    
    return "Não iniciada";
  };

  // Get level for a municipality
  const getMunicipioLevel = (codIbge) => {
    if (!levelDistribution) return null;
    
    for (const level of levelDistribution) {
      if (isMunicipioInLevel(codIbge, level)) {
        return level.level;
      }
    }
    
    return null;
  };

  // Style function for the GeoJSON features
  const getFeatureStyle = (feature) => {
    const codIbge = feature.properties.id;
    
    // Default style
    let fillColor = "#cccccc";
    let weight = 1;
    let fillOpacity = 0.7;
    
    // Check if this is the selected municipality
    const isSelected = selectedMunicipioCode === codIbge;
    console.log({missionPanoramaData, levelDistribution})

    // If showing mission panorama, color municipalities based on mission status
    if (missionPanoramaData) {
      // Default color for municipalities not in the panorama
      fillColor = "#cccccc";
      
      // Check if the municipality is in completed municipalities
      if (missionPanoramaData.completedMunicipios?.some(m => m.codIbge === codIbge)) {
        fillColor = "#12447F"; // Blue for completed missions
      } 
      // Check if the municipality is in started municipalities
      else if (missionPanoramaData.startedMunicipios?.some(m => m.codIbge === codIbge)) {
        fillColor = "#72C576"; // Light green for started missions
      } 
      // Check if the municipality is in pending municipalities
      else if (missionPanoramaData.pendingMunicipios?.some(m => m.codIbge === codIbge)) {
        fillColor = "#9F9F9F"; // Gray for pending missions
      }
    }
    // Check if we have levelDistribution data to use
    else if (levelDistribution) {
      // Get the level for this municipality
      const level = getMunicipioLevel(codIbge);
      
      if (level === "NP") {
        fillColor = "#FFFFFF"; // White for non-participating
      } else if (level === 3) {
        fillColor = "#12447F"; // Blue for level 3 (highest)
      } else if (level === 2) {
        fillColor = "#066829"; // Dark green for level 2
      } else if (level === 1) {
        fillColor = "#50B755"; // Light green for level 1
      } else if (level === 0) {
        fillColor = "#707070"; // Gray for level 0 (no points)
      }
    }
    
    // Increase opacity and weight when selected
    if (isSelected) {
      weight = 3;
      fillOpacity = 1.0;
    }
    
    return {
      fillColor,
      weight,
      opacity: 1,
      color: isSelected ? "#FF8000" : "#333333", // Orange border for selected
      fillOpacity,
      dashArray: isSelected ? "3" : null // Dashed line for selected
    };
  };

  // Function to handle feature interactions
  const onEachFeature = (feature, layer) => {
    const codIbge = feature.properties.id;
    const municipioName = getMunicipioName(codIbge, feature);
    
    // Create tooltip content
    if (missionPanoramaData) {
      // If showing mission panorama, include mission status in tooltip
      const missionStatus = getMissionStatus(codIbge);
      
      layer.bindTooltip(`
        <div>
          <strong>${municipioName}</strong>
          <br />
          Status da missão: ${missionStatus}
        </div>
      `);
    } else if (levelDistribution) {
      // If showing level distribution, include level information
      const level = getMunicipioLevel(codIbge);
      let status = "Não disponível";
      let points = "0";
      
      if (level === "NP") {
        status = "Não participante";
      } else if (level !== null) {
        status = "Participante";
        
        // Show points range based on level
        if (level === 0) {
          points = "0";
        } else if (level === 1) {
          points = "1-100";
        } else if (level === 2) {
          points = "101-200";
        } else if (level === 3) {
          points = "201+";
        }
      }
      
      layer.bindTooltip(`
        <div>
          <strong>${municipioName}</strong>
          <br />
          Status: ${status}
          <br />
          Pontos: ${points}
        </div>
      `);
    } else {
      // Fallback tooltip with just the name
      layer.bindTooltip(municipioName);
    }
    
    // Add click handler to select a municipality
    layer.on({
      click: () => {
        if (onMunicipioSelect) {
          onMunicipioSelect(codIbge);
        }
      }
    });
  };

  // Refresh GeoJSON when selected municipality changes
  useEffect(() => {
    if (geoJsonRef.current) {
      console.log('Refreshing GeoJSON styles for municipality selection');
      geoJsonRef.current.setStyle(getFeatureStyle);
    }
  }, [selectedMunicipioCode]);

  // This effect ensures GeoJSON is redrawn when mission data changes or levelDistribution changes
  useEffect(() => {
    if (geoJsonRef.current) {
      console.log('Mission panorama data or level distribution changed - refreshing map styles');
      // When mission data becomes null, log it explicitly
      if (missionPanoramaData === null) {
        console.log('Mission panorama data is null - reverting to level distribution view');
      }
      // Explicitly redraw everything with a new style function to ensure closure variables are updated
      geoJsonRef.current.setStyle(feature => getFeatureStyle(feature));
    }
  }, [missionPanoramaData, selectedMunicipioCode, levelDistribution]);

  // Add a specific effect to handle when missionPanoramaData is set to null
  useEffect(() => {
    if (geoJsonRef.current && missionPanoramaData === null && levelDistribution) {
      console.log('Mission panorama data reset to null - reverting to level distribution view' + {levelDistribution});
      
      // Force a redraw to show level distribution data
      geoJsonRef.current.setStyle(feature => getFeatureStyle(feature));
    }
  }, [missionPanoramaData, levelDistribution]);

  // Fit map to GeoJSON bounds when data is loaded or screen size changes
  useEffect(() => {
    if (!geoJsonRef.current || !mapRef.current) return;

    // Remove fit bounds functionality 
  }, [geoJsonData, isMobile]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: isMobile ? "400px" : "600px",
        position: "relative",
        "& .leaflet-container": {
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
        }
      }}
    >
      <MapContainer 
        center={[-5.5, -39.3]} // Default center (will be overridden by bounds)
        zoom={7.3} // Default zoom (will be overridden by bounds)
        style={{ width: "100%", height: "100%" }}
        zoomDelta={0.25}
        zoomSnap={0.25}
        zoomScale={1.25}
        zoomScaleDelta={0.25}
        zoomScaleMax={1.25}
        zoomScaleMin={0.25}
        zoomScaleStep={0.25}

        attributionControl={false}
        ref={mapRef}
        zoomControl={true}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          opacity={0.5}
          crossOrigin={true}
        />
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData} 
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
            ref={geoJsonRef}
          />
        )}
      </MapContainer>
      
      {/* Show legend inside the map for non-mobile */}
      {!isMobile && <MapLegendInternal selectedMissao={missionPanoramaData ? true : null} levelDistribution={levelDistribution} />}
    </Box>
  );
};

export default function BrazilMap({ missionPanoramaData, selectedMunicipio, onMunicipioSelect, levelDistribution }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWindow, setHasWindow] = useState(false)

  // Log mission panorama data and level distribution when they change
  useEffect(() => {
    console.log('BrazilMap received missionPanoramaData:', missionPanoramaData);
    console.log('BrazilMap received levelDistribution:', levelDistribution);
    
    // Log when reverting from mission panorama to level distribution view
    if (missionPanoramaData === null && levelDistribution) {
      console.log('Reverting from mission view to level distribution view');
    }
  }, [missionPanoramaData, levelDistribution]);

  // Check if window is available
  useEffect(() => {
    setHasWindow(true)
  }, [])

  useEffect(() => {
    // Fetch GeoJSON data
    fetch("/ceara_municipalities.json")
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON data:", error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9f9f9f",
        }}
      >
        Carregando mapa...
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasWindow && (
        <>
          <Box 
            sx={{ 
              position: "absolute", 
              top: 10, 
              left: 10, 
              zIndex: 1000,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              border: "1px solid #d3d3d3",
              boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              pointerEvents: "none"
            }}
          >
            <Typography variant="caption" sx={{ display: "flex", alignItems: "center" }}>
              <Box 
                component="span" 
                sx={{ 
                  display: "inline-block", 
                  width: 10, 
                  height: 10, 
                  borderRadius: "50%", 
                  backgroundColor: "#12447f",
                  mr: 1
                }} 
              />
              Clique em um município para selecioná-lo
            </Typography>
          </Box>
          <LeafletMap 
            geoJsonData={geoJsonData} 
            isMobile={isMobile}
            missionPanoramaData={missionPanoramaData}
            selectedMunicipioCode={selectedMunicipio}
            onMunicipioSelect={onMunicipioSelect}
            levelDistribution={levelDistribution}
          />
        </>
      )}
    </Box>
  )
}

