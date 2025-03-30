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

// Map Legend component for non-mobile
const MapLegendInternal = ({ selectedMissao }) => {
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
        borderRadius: 1,
        bgcolor: "rgba(255, 255, 255, 0.9)",
        fontSize: "0.85rem",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "medium",
          mb: 1,
          fontSize: "0.875rem",
        }}
      >
        {selectedMissao ? "Legenda de Missão" : "Legenda"}
      </Typography>
      
      {selectedMissao ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#12447F",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Missão Concluída
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#72C576",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Missão em Andamento
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#9F9F9F",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Missão Pendente
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#707070",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                mr: 1,
              }}
            >
              89
            </Box>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Não iniciado
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#50B755",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                mr: 1,
              }}
            >
              135
            </Box>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Nível 1 (1-100 pts)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#066829",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                mr: 1,
              }}
            >
              30
            </Box>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Nível 2 (101-199 pts)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#12447f",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                mr: 1,
              }}
            >
              2
            </Box>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Concluído (200+ pts)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "white",
                border: "1px solid #d3d3d3",
                color: "#525252",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                mr: 1,
              }}
            >
              10
            </Box>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Não aderiu
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

const LeafletMap = ({ municipiosData, geoJsonData, isMobile, missionPanoramaData, selectedMunicipioCode, onMunicipioSelect }) => {
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
      
      // Check if they have a codIbge property as expected by the style function
      const hasCorrectStructure = 
        (missionPanoramaData.completedMunicipios?.length > 0 && 'codIbge' in missionPanoramaData.completedMunicipios[0]) ||
        (missionPanoramaData.startedMunicipios?.length > 0 && 'codIbge' in missionPanoramaData.startedMunicipios[0]) ||
        (missionPanoramaData.pendingMunicipios?.length > 0 && 'codIbge' in missionPanoramaData.pendingMunicipios[0]);
      
      console.log('Data has correct structure with codIbge property?', hasCorrectStructure);
      
      // If structure doesn't match, log what we received
      if (!hasCorrectStructure) {
        console.warn('Mission panorama data structure doesn\'t match what the style function expects!');
        console.log('Full data received:', missionPanoramaData);
      }
    }
  }, [missionPanoramaData]);

  // Style function for the GeoJSON features
  const getFeatureStyle = (feature) => {
    const codIbge = feature.properties.id
    const municipio = municipiosData.find((m) => m.codIbge === codIbge)
    
    // Default style for municipalities not in our data
    let fillColor = "#cccccc"
    let weight = 1
    let fillOpacity = 0.7
    
    // Check if this is the selected municipality
    const isSelected = selectedMunicipioCode === codIbge
    
    // If showing mission panorama, color municipalities based on mission status
    if (missionPanoramaData) {
      console.log('Mission Panorama Data in style function:', missionPanoramaData);
      console.log('Checking municipality:', codIbge);
      
      // Default color for municipalities not in the panorama
      fillColor = "#cccccc"
      
      // Check if the municipality is in completed municipalities
      if (missionPanoramaData.completedMunicipios?.some(m => m.codIbge === codIbge)) {
        console.log(`Municipality ${codIbge} has completed the mission`);
        fillColor = "#12447F" // Blue for completed missions
      } 
      // Check if the municipality is in started municipalities
      else if (missionPanoramaData.startedMunicipios?.some(m => m.codIbge === codIbge)) {
        console.log(`Municipality ${codIbge} has started the mission`);
        fillColor = "#72C576" // Light green for started missions
      } 
      // Check if the municipality is in pending municipalities
      else if (missionPanoramaData.pendingMunicipios?.some(m => m.codIbge === codIbge)) {
        console.log(`Municipality ${codIbge} has the mission pending`);
        fillColor = "#9F9F9F" // Gray for pending missions
      }
    }
    // Otherwise, use the default styling based on points and participation
    else if (municipio) {
      // Style based on points and participation status
      if (municipio.status === "Não participante") {
        fillColor = "#FFFFFF" // White for non-participating
      } else if (municipio.points >= 200) {
        fillColor = "#12447F" // Blue for 200+ points
      } else if (municipio.points >= 101) {
        fillColor = "#066829" // Dark green for 101-199 points
      } else if (municipio.points >= 1) {
        fillColor = "#50B755" // Light green for 1-100 points
      } else {
        fillColor = "#707070" // Gray for zero points
      }
      
      // Highlight municipalities with badges
      if (municipio.badges > 0) {
        weight = 2
      }
    }
    
    // Increase opacity and weight when selected
    if (isSelected) {
      weight = 3
      fillOpacity = 1.0
    }
    
    return {
      fillColor,
      weight,
      opacity: 1,
      color: isSelected ? "#FF8000" : "#ffffff", // Orange border for selected
      fillOpacity,
      dashArray: isSelected ? "3" : null // Dashed line for selected
    }
  }

  // Function to handle feature interactions
  const onEachFeature = (feature, layer) => {
    const codIbge = feature.properties.id
    const municipio = municipiosData.find((m) => m.codIbge === codIbge)
    
    // Create tooltip content
    if (municipio) {
      // If showing mission panorama, include mission status in tooltip
      if (missionPanoramaData) {
        let missionStatus = "Não iniciada"
        
        if (missionPanoramaData.completedMunicipios?.some(m => m.codIbge === codIbge)) {
          missionStatus = "Concluída"
        } else if (missionPanoramaData.startedMunicipios?.some(m => m.codIbge === codIbge)) {
          missionStatus = "Em andamento"
        } else if (missionPanoramaData.pendingMunicipios?.some(m => m.codIbge === codIbge)) {
          missionStatus = "Pendente"
        }
        
        layer.bindTooltip(`
          <div>
            <strong>${municipio.nome}</strong>
            <br />
            Status da missão: ${missionStatus}
          </div>
        `)
      } else {
        layer.bindTooltip(`
          <div>
            <strong>${municipio.nome}</strong>
            <br />
            Status: ${municipio.status}
            <br />
            Badges: ${municipio.badges}
            <br />
            Pontos: ${municipio.points}
          </div>
        `)
      }
    } else {
      layer.bindTooltip(feature.properties.name || "")
    }
    
    // Add click handler to select a municipality
    layer.on({
      click: () => {
        if (onMunicipioSelect) {
          // Use the codIbge directly from feature properties
          // This allows selection of all municipalities, even if not in municipiosData
          onMunicipioSelect(codIbge);
          
          // Remove zoom to clicked municipality functionality
        }
      }
    });
  }

  // Refresh GeoJSON when selected municipality changes
  useEffect(() => {
    if (geoJsonRef.current) {
      console.log('Refreshing GeoJSON styles for municipality selection');
      geoJsonRef.current.setStyle(getFeatureStyle);
      
      // Remove zoom to selected municipality functionality
    }
  }, [selectedMunicipioCode]);

  // This effect ensures GeoJSON is redrawn when mission data changes
  useEffect(() => {
    if (geoJsonRef.current && missionPanoramaData) {
      console.log('Mission panorama data changed - refreshing map styles');
      // Explicitly redraw everything with a new style function to ensure closure variables are updated
      geoJsonRef.current.setStyle(feature => getFeatureStyle(feature));
    }
  }, [missionPanoramaData, municipiosData, selectedMunicipioCode]);

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
        maxHeight: isMobile ? "280px" : "600px",
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
        zoom={7} // Default zoom (will be overridden by bounds)
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        ref={mapRef}
        zoomControl={false}
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJsonData && municipiosData.length > 0 && (
          <GeoJSON 
            data={geoJsonData} 
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
            ref={geoJsonRef}
          />
        )}
      </MapContainer>
      
      {/* Show legend inside the map for non-mobile */}
      {!isMobile && <MapLegendInternal selectedMissao={missionPanoramaData ? true : null} />}
    </Box>
  )
}

export default function BrazilMap({ missionPanoramaData, selectedMunicipio, onMunicipioSelect }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [municipiosData, setMunicipiosData] = useState([])
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWindow, setHasWindow] = useState(false)

  // Log mission panorama data when it changes
  useEffect(() => {
    console.log('BrazilMap received missionPanoramaData:', missionPanoramaData);
  }, [missionPanoramaData]);

  // Check if window is available
  useEffect(() => {
    setHasWindow(true)
  }, [])

  useEffect(() => {
    // Create sample data for testing
    const sampleMunicipios = [
      { codIbge: "2300101", nome: "Abaiara", status: "Participante", badges: 2, points: 75 },
      { codIbge: "2300200", nome: "Acaraú", status: "Participante", badges: 1, points: 150 },
      { codIbge: "2300309", nome: "Acopiara", status: "Participante", badges: 3, points: 210 },
      { codIbge: "2300408", nome: "Aiuaba", status: "Participante", badges: 0, points: 0 },
      { codIbge: "2300507", nome: "Alcântaras", status: "Não participante", badges: 0, points: 0 },
      { codIbge: "2300606", nome: "Altaneira", status: "Participante", badges: 1, points: 45 },
      // Additional municipalities can be added here
    ];
    
    setMunicipiosData(sampleMunicipios);
    
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
            municipiosData={municipiosData} 
            geoJsonData={geoJsonData} 
            isMobile={isMobile}
            missionPanoramaData={missionPanoramaData}
            selectedMunicipioCode={selectedMunicipio}
            onMunicipioSelect={onMunicipioSelect}
          />
        </>
      )}
    </Box>
  )
}

