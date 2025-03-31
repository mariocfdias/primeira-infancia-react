import { Box, Typography, Tooltip, Button } from "@mui/material"
import { Info, OpenInNew } from "@mui/icons-material"
import PropTypes from 'prop-types'

export default function EvidenceItem({
  id,
  title,
  description,
  evidence,
  evidenceLink,
  status = "pending",
  showId = true
}) {
  console.log({evidenceLink, evidence})
  const handleEvidenceClick = (url) => {
    console.log({url})
    if (!url) return;
    window.open(url, '_blank');
  };

  const getTooltipTitle = () => {
    if (description) return description;
    return status === "pending" 
      ? "Clique para ver detalhes da evidência"
      : "Evidência necessária para concluir a missão";
  };

  const getIcon = () => {
    // Use evidenceLink if provided, otherwise fall back to evidence
    const hasLink = evidenceLink || evidence;
    
    if (hasLink) {
      return (
        <OpenInNew sx={{ 
          color: "#12447f", 
          fontSize: { xs: "0.9rem", sm: "1rem" }, 
          ml: "auto",
          cursor: "pointer" 
        }} />
      );
    }

    return (
      <Info sx={{ 
        color: "#12447f", 
        fontSize: { xs: "0.9rem", sm: "1rem" }, 
        ml: "auto", 
        cursor: "pointer" 
      }} />
    );
  };

  return (
    <Box
      onClick={(e) => {
        console.log({title, evidenceLink, evidence, description})
        const linkToOpen = evidenceLink || evidence;
        linkToOpen && handleEvidenceClick(linkToOpen);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        border: "1px solid #d3d3d3",
        borderRadius: 5,
        backgroundColor: (evidenceLink || evidence) ? "#12447F" : "#FFFFFF",
        color: (evidenceLink || evidence) ? "white" : "#333333",
        cursor: (evidenceLink || evidence) ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": (evidenceLink || evidence) ? {
          opacity: 0.9,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
        } : {},
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.7rem", sm: "0.8rem" },
          mr: 1,
        }}
      >
        {title}
      </Typography>
      <Tooltip color={(evidenceLink || evidence) ? "white" : "#333333"} title={getTooltipTitle()} arrow placement="top">
        {getIcon()}
      </Tooltip>
    </Box>
  );
}

EvidenceItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  evidence: PropTypes.string,
  evidenceLink: PropTypes.string,
  status: PropTypes.oneOf(['pending', 'completed']),
  showId: PropTypes.bool
}; 