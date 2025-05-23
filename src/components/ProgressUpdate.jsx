import { Box, Typography, Paper, Chip, Avatar } from "@mui/material"
import { Star, StarRounded } from "@mui/icons-material"
import PropTypes from 'prop-types'

const getCategoryColor = (category) => {
  if (category.includes("AMPLIAÇÃO")) return "linear-gradient(to right, #1C434F, #0A5166)"
  if (category.includes("FORTALECIMENTO")) return "linear-gradient(to right, #3D5E85, #5E7DA0)"
  if (category.includes("MELHORIA")) return "linear-gradient(to right, #256F93, #5B97B5)"
  return "#333333"
}

const getOrgaoName = (codIbge) => {
  if (codIbge && codIbge.includes("PREFEITURA")) return "Prefeitura"
  if (codIbge && codIbge.includes("CAMARA")) return "Câmara"
  return "Prefeitura" // default fallback
}

export default function ProgressUpdate({ 
  city, 
  mission, 
  points, 
  badge, 
  date, 
  url,
  eventType = "mission_completed", 
  orgaoCode,
  isMobile = false 
}) {  
  console.log({orgaoCode, mission})
  const orgaoName = getOrgaoName(orgaoCode)
  
  const renderMessage = () => {
    switch(eventType) {
      case "participante_evento":
        return (
          <>
            {orgaoName} de{" "}
            <Typography component="span" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" } }}>
              {city}
            </Typography>{" "}
            está participando do Pacto da Primeira Infância
          </>
        )
      case "mission_started":
        return (
          <>
            {orgaoName} de{" "}
            <Typography component="span" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" } }}>
              {city}
            </Typography>{" "}
            progrediu no compromisso "
            <Typography component="span" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" } }}>
              {mission}
            </Typography>
            "
          </>
        )
      case "mission_completed":
      default:
        return (
          <>
            {orgaoName} de{" "}
            <Typography component="span" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" } }}>
              {city}
            </Typography>{" "}
            concluiu o compromisso "
            <Typography component="span" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" } }}>
              {mission}
            </Typography>
            " e ganhou{" "}
            <Box
              component="span"
              sx={{
                color: "#E79D0D",
                fontWeight: "medium",
                display: "inline-flex",
                alignItems: "center",
                fontSize: { xs: "16px", sm: "16px", md: "20px" },
              }}
            >
              <StarRounded
                sx={{
                  color: "#E79D0D",
                  mr: 0.25,
                }}
              />
              {points} pontos
            </Box>{" "}
            e um emblema de{" "}
            <Chip
              label={badge}
              size="small"
              sx={{
                background: getCategoryColor(badge.toUpperCase()),
                color: "white",
                fontSize: { xs: "16px", sm: "16px", md: "20px" },
                height: "auto",
                py: 0.25,
                fontWeight: "medium",
                ml: 0.5,
              }}
            />
          </>
        )
    }
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 0.5, sm: 1 },
        borderRadius: 1,
        backgroundColor: "#FAFAFA",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "flex-start" },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Avatar
          variant="square"
          src={formatImageUrl(url)}
          sx={{
            bgcolor: "#12447f",
            color: "white",
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            width: { xs: 28, sm: 32, md: 40 },
            height: { xs: 28, sm: 32, md: 40 },
            mr: { xs: 0, sm: 1.5 },
            mt: { xs: 0, sm: 0.5 },
            borderRadius: 1,
            flexShrink: 0,
          }}
        >
          {city.substring(0, 2).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              mb: 0.5,
              fontSize: { xs: "12px", sm: "16px", lg: "18px" },
              lineHeight: 1.5,
            }}
          >
            {renderMessage()}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#8d8d8d",
              display: "block",
              textAlign: "right",
              fontSize: { xs: "16px", sm: "16px", md: "20px" },
            }}
          >
            {date}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

ProgressUpdate.propTypes = {
  city: PropTypes.string.isRequired,
  mission: PropTypes.string,
  points: PropTypes.number,
  badge: PropTypes.string,
  date: PropTypes.string.isRequired,
  eventType: PropTypes.oneOf(['participante_evento', 'mission_started', 'mission_completed']),
  orgaoCode: PropTypes.string,
  isMobile: PropTypes.bool
}


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
    return `https://lh3.google.com/u/0/d/${imageId}`;
  }

  // If not a Drive URL, return the original URL
  return imageUrl;
};