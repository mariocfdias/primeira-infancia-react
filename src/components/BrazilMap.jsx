import { useEffect, useState, useRef } from "react"
import { Box, useTheme, useMediaQuery, Typography, Paper } from "@mui/material"
import StarIcon from '@mui/icons-material/Star';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from "react-leaflet"
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
    <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
      <Box
        sx={{
          minWidth: 30,
          height: 30,
          bgcolor: backgroundColor,
          color: color || "white",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          borderRadius: 1,
          fontSize: "1rem",
          mr: 1,
          border: backgroundColor === "white" || backgroundColor === "#ffffff" ? "1px solid #000000" : "none",
          px: 1,
          whiteSpace: "nowrap",
          flex: "0 0 auto",
        }}
      >
          {number}
          {(title === "Concluída" || title === "Nível 3" || title === "Concluído") ? <StarIcon style={{ color: "#FCBA38" }}/> : ""}
      </Box>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        flex: 1,
        minHeight: 40
      }}>
        {title && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: "1rem", 
              fontWeight: "medium", 
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            {title}
          </Typography>
        )}
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: "0.85rem", 
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

// Map Legend component for non-mobile
const MapLegendInternal = ({ selectedMissao, levelDistribution, missionPanoramaData }) => {
  // Get counts from levelDistribution if available
  const getLevelCount = (level) => {
    if (!levelDistribution) return 0;
    const levelData = levelDistribution.find(l => l.level === level);
    return levelData ? levelData.count : 0;
  };

  // Get counts for mission status
  const getMissionCounts = () => {
    if (!missionPanoramaData) return { completed: 0, inProgress: 0, pending: 0, notParticipating: 0 };
    
    console.log('Mission Panorama Data:', missionPanoramaData);
    
    // Check data structure
    const completedMunicipios = Array.isArray(missionPanoramaData.completedMunicipios) ? 
      missionPanoramaData.completedMunicipios : 
      missionPanoramaData.completed || [];
      
    const startedMunicipios = Array.isArray(missionPanoramaData.startedMunicipios) ?
      missionPanoramaData.startedMunicipios :
      missionPanoramaData.started || [];
      
    const pendingMunicipios = Array.isArray(missionPanoramaData.pendingMunicipios) ?
      missionPanoramaData.pendingMunicipios :
      missionPanoramaData.pending || [];
    
    console.log('Completed municipalities:', completedMunicipios);
    console.log('Started municipalities:', startedMunicipios);
    console.log('Pending municipalities:', pendingMunicipios);
    
    const completed = completedMunicipios.length;
    const inProgress = startedMunicipios.length;
    const pending = pendingMunicipios.length;
    
    // Get not participating count directly from levelDistribution
    const notParticipating = levelDistribution?.find(l => l.level === "NP")?.count || 0;

    const counts = { completed, inProgress, pending, notParticipating };
    console.log('Final counts:', counts);
    
    return counts;
  };

  const npCount = getLevelCount("NP");
  const level0Count = getLevelCount(0);
  const level1Count = getLevelCount(1);
  const level2Count = getLevelCount(2);
  const level3Count = getLevelCount(3);

  const missionCounts = getMissionCounts();

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
        {selectedMissao ? "Legenda do Compromisso" : "Legenda"}
      </Typography>
      
      {selectedMissao ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <LegendDescription 
            backgroundColor="#12447F"
            title="Concluído"
            number={missionCounts.completed}
          />
          <LegendDescription 
            backgroundColor="#72C576"
            title="Em Ação"
            number={missionCounts.inProgress}
          />
          <LegendDescription 
            backgroundColor="#9F9F9F"
            title="Não Iniciado"
            number={missionCounts.pending}
          />
          <LegendDescription 
            backgroundColor="#ffffff"
            color="#525252"
            title="Não aderiram o Pacto"
            number={missionCounts.notParticipating}
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
            description="200 pontos"
            number={level3Count}
          />
          <LegendDescription 
            backgroundColor="white"
            color="#525252"
            title="Não aderiram o Pacto"
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
  const [completedMarkers, setCompletedMarkers] = useState([])

  // Create a simpler icon for testing
  const starIcon = L.divIcon({
    className: 'custom-star-icon',
    html: '<div style="width: 18px; height: 18px; color: #FCBA38; display: flex; align-items: center; justify-content: center; border-radius: 50%;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FCBA38"/></svg></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  // Function to get municipality center coordinates from GeoJSON feature
  const getMunicipalityCenter = (feature) => {
    if (!feature || !feature.geometry) {
      console.log('Invalid feature:', feature);
      return null;
    }
    try {
      const bounds = L.geoJSON(feature).getBounds();
      const center = bounds.getCenter();
      console.log('Municipality center calculated:', center);
      return center;
    } catch (error) {
      console.error('Error calculating municipality center:', error);
      return null;
    }
  };

  // Update markers when mission panorama data changes or level distribution changes
  useEffect(() => {
    console.log('Mission panorama data or level distribution changed:', missionPanoramaData, levelDistribution);
    console.log('GeoJSON data available:', !!geoJsonData);

    if (!geoJsonData) return;

    // Clear existing markers
    setCompletedMarkers([]);

    // Add markers for completed municipalities in mission panorama
    if (missionPanoramaData?.completedMunicipios) {
      console.log('Number of completed municipalities:', missionPanoramaData.completedMunicipios.length);
      const newMarkers = [];
      
      missionPanoramaData.completedMunicipios.forEach(({ codIbge }) => {
        console.log('Processing completed municipality:', codIbge);
        const feature = geoJsonData.features.find(f => f.properties.id === codIbge);
        
        if (feature) {
          console.log('Found matching feature for municipality:', codIbge);
          const center = getMunicipalityCenter(feature);
          if (center) {
            console.log('Adding marker for municipality:', codIbge, 'at position:', center);
            newMarkers.push({
              position: [center.lat, center.lng],
              id: codIbge
            });
          }
        } else {
          console.log('No matching feature found for municipality:', codIbge);
        }
      });

      console.log('Setting new markers for completed missions:', newMarkers);
      setCompletedMarkers(newMarkers);
    }
    // Add markers for level 3 municipalities when showing level distribution
    else if (levelDistribution && !missionPanoramaData) {
      console.log('Adding markers for level 3 municipalities');
      const level3Data = levelDistribution.find(l => l.level === 3);
      
      if (level3Data && level3Data.municipios) {
        console.log('Number of level 3 municipalities:', level3Data.municipios.length);
        const newMarkers = [];
        
        level3Data.municipios.forEach(codIbge => {
          console.log('Processing level 3 municipality:', codIbge);
          const feature = geoJsonData.features.find(f => f.properties.id === codIbge);
          
          if (feature) {
            console.log('Found matching feature for level 3 municipality:', codIbge);
            const center = getMunicipalityCenter(feature);
            if (center) {
              console.log('Adding marker for level 3 municipality:', codIbge, 'at position:', center);
              newMarkers.push({
                position: [center.lat, center.lng],
                id: codIbge
              });
            }
          } else {
            console.log('No matching feature found for level 3 municipality:', codIbge);
          }
        });
        
        console.log('Setting new markers for level 3 municipalities:', newMarkers);
        setCompletedMarkers(newMarkers);
      }
    }
  }, [missionPanoramaData, geoJsonData, levelDistribution]);

  // Log when markers are updated
  useEffect(() => {
    console.log('Completed markers updated:', completedMarkers);
  }, [completedMarkers]);

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
    let color = "#333333";
    let weight = 0.5;
    let fillOpacity = 1;
    
    // Check if this is the selected municipality
    const isSelected = selectedMunicipioCode === codIbge;

    // If showing mission panorama, color municipalities based on mission status
    if (missionPanoramaData) {
      console.log('Styling municipality:', codIbge);
      
      // Check data structure
      const completedMunicipios = Array.isArray(missionPanoramaData.completedMunicipios) ? 
        missionPanoramaData.completedMunicipios : 
        missionPanoramaData.completed || [];
        
      const startedMunicipios = Array.isArray(missionPanoramaData.startedMunicipios) ?
        missionPanoramaData.startedMunicipios :
        missionPanoramaData.started || [];
        
      const pendingMunicipios = Array.isArray(missionPanoramaData.pendingMunicipios) ?
        missionPanoramaData.pendingMunicipios :
        missionPanoramaData.pending || [];
      console.log({completedMunicipios, startedMunicipios, pendingMunicipios})
      // First check if municipality is completed
      if (completedMunicipios.some(m => m.codIbge === codIbge || m === codIbge)) {
        console.log('Municipality is completed:', codIbge);
        fillColor = "#12447F"; // Blue for completed missions
        color = "#ffffff";
        
      } 
      // Then check if it's in progress
      else if (startedMunicipios.some(m => m.codIbge === codIbge || m === codIbge)) {
        console.log('Municipality is in progress:', codIbge);
        fillColor = "#72C576"; // Light green for started missions
      } 
      // Then check if it's pending
      else if (pendingMunicipios.some(m => m.codIbge === codIbge || m === codIbge)) {
        console.log('Municipality is pending:', codIbge);
        const level = levelDistribution ? getMunicipioLevel(codIbge) : null;
        fillColor = level && level !== "NP" ? "#9F9F9F" : "#FFFFFF"; // Gray for pending missions
      }
      // If not in any of the above, it's not participating
      else {
        console.log('Municipality is not participating:', codIbge);
        fillColor = "#FFFFFF"; // White for non-participating
      }
    }
    // Only check levelDistribution if we're not showing mission data
    else if (levelDistribution) {
      // Get the level for this municipality
      const level = getMunicipioLevel(codIbge);
      
      if (level === "NP") {
        fillColor = "#FFFFFF"; // White for non-participating
      } else if (level === 3) {
        fillColor = "#12447F"; // Blue for level 3 (highest)
        color = "#ffffff"; // White border for level 3
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
      color: isSelected ? "#E79D0D" : color, // Orange border for selected
      fillOpacity,
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

  // Component to handle markers
  const MarkersList = () => {
    console.log('Renderizando MarkersList com marcadores:', completedMarkers);
    return (
      <>
        {completedMarkers.map((marker) => {
          // Encontrar o nome do município para o tooltip
          const feature = geoJsonData.features.find(f => f.properties.id === marker.id);
          const municipioName = feature ? feature.properties.name : `Município ${marker.id}`;
          
          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={starIcon}
              eventHandlers={{
                click: () => {
                  if (onMunicipioSelect) {
                    onMunicipioSelect(marker.id);
                  }
                }
              }}
            >
              <Tooltip>{municipioName}</Tooltip>
            </Marker>
          );
        })}
      </>
    );
  };

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
        },
        "& .custom-star-icon": {
          background: 'transparent !important',
          border: 'none !important',
          boxShadow: 'none !important',
          zIndex: 1000
        }
      }}
    >
      <MapContainer 
        center={[-5.5, -39.3]}
        zoom={7.3}
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
          opacity={1}
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
        <MarkersList />
      </MapContainer>
      
      {/* Show legend inside the map for non-mobile */}
      {!isMobile && <MapLegendInternal 
        selectedMissao={missionPanoramaData ? true : null} 
        levelDistribution={levelDistribution}
        missionPanoramaData={missionPanoramaData}
      />}
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

