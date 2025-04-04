import { Box, Typography, Tooltip, Button } from "@mui/material"
import { Info, OpenInNew } from "@mui/icons-material"
import PropTypes from 'prop-types'

export default function EvidenceItem({
  id,
  title,
  description,
  evidence,
  status = "pending",
  showId = true
}) {
  console.log({evidence})
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

  const getIcon = (evidence) => {
    // Use evidenceLink if provided, otherwise fall back to evidence
    const hasLink = evidence;
    
    if (hasLink) {
      return (
        <OpenInNew sx={{ 
          color: "#ffffff", 
          fontSize: { xs: "0.9rem", sm: "1rem", lg: "24px" }, 
          ml: "auto",
          cursor: "pointer" 
        }} />
      );
    }

    return (
      <Info sx={{ 
        color: "#12447f", 
        fontSize: { xs: "0.9rem", sm: "1rem", lg: "28px" }, 
        ml: "auto", 
        cursor: "pointer" 
      }} />
    );
  };

  return (
    <Box
      onClick={(e) => {
        console.log({title, evidence, description})
        const linkToOpen =  evidence;
        linkToOpen && handleEvidenceClick(linkToOpen);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        border: "1px solid #d3d3d3",
        borderRadius: 5,
        backgroundColor: (evidence) ? "#12447F" : "#FFFFFF",
        color: (evidence) ? "white" : "#333333",
        cursor: (evidence) ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": (evidence) ? {
          opacity: 0.9,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
        } : {},
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.2rem", lg: "20px" },
          mr: 1,
        }}
      >
        {title}
      </Typography>
      <Tooltip sx={{zIndex: 1000}} disablePortal color={(evidence) ? "#ffffff" : "#333333"} title={<Typography sx={{backgroundColor: "#333333", zIndex: 1000, fontSize: { xs: "1rem", sm: "1.2rem", lg: "20px", width: {xs: "200px", lg: "360px"} }}}>{getTooltipTitle()}</Typography>} arrow placement="top">
        {getIcon(evidence)}
      </Tooltip>
    </Box>
  );
}

EvidenceItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  evidence: PropTypes.string,
  status: PropTypes.oneOf(['pending', 'completed']),
  showId: PropTypes.bool
}; 