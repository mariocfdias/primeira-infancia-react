import { Box, Typography, Tooltip, Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from "@mui/material"
import { Info, OpenInNew, ArrowDropDown } from "@mui/icons-material"
import PropTypes from 'prop-types'
import { useState, useRef } from 'react'

export default function EvidenceItem({
  id,
  title,
  description,
  evidence,
  status = "pending",
  showId = true
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log({evidence})

  const getEvidenceUrls = () => {
    if (!evidence) return [];
    if (evidence.includes(',')) {
      return evidence.split(',').map(link => link.trim());
    }
    return [evidence];
  };

  const evidenceUrls = getEvidenceUrls();

  const handleEvidenceClick = (url) => {
    console.log({url})
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleMainButtonClick = () => {
    if (evidenceUrls.length === 1) {
      handleEvidenceClick(evidenceUrls[0]);
    } else if (evidenceUrls.length > 1) {
      handleEvidenceClick(evidenceUrls[selectedIndex]);
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    handleEvidenceClick(evidenceUrls[index]);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }
    setOpen(false);
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

  if (evidenceUrls.length > 1) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          border: "1px solid #d3d3d3",
          borderRadius: 5,
          backgroundColor: "#12447F",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            opacity: 0.9,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
          },
        }}
      >
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label={`Evidências para ${title}`}
          sx={{
            backgroundColor: "#12447F",
            width: "100%",
            "& .MuiButton-root": {
              backgroundColor: "#12447F",
              border: "none",
              color: "white",
              fontSize: { xs: "1rem", sm: "1.2rem", lg: "20px" },
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0f3a6b",
              },
              "&:focus": {
                backgroundColor: "#0f3a6b",
                outline: "2px solid #ffffff",
                outlineOffset: "2px",
              }
            }
          }}
        >
          <Button
            onClick={handleMainButtonClick}
            aria-label={`Abrir evidência principal: ${title}`}
            sx={{
              flex: 1,
              justifyContent: "flex-start",
              mr: 1,
            }}
          >
            {title}
          </Button>
          <Button
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="Mostrar mais evidências"
            aria-haspopup="menu"
            onClick={handleToggle}
            sx={{
              minWidth: "auto",
              p: 0.5,
            }}
          >
            <ArrowDropDown />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{ zIndex: 10001 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem={false}>
                    {evidenceUrls.map((url, index) => (
                      <Tooltip
                        sx={{zIndex: 10000}}
                        disablePortal
                        title={
                          <Typography sx={{
                            backgroundColor: "#333333",
                            zIndex: 10000,
                            fontSize: { xs: "1rem", sm: "1.2rem", lg: "20px" },
                            width: {xs: "200px", lg: "360px"}
                          }}>
                            {getTooltipTitle()}
                          </Typography>
                        }
                        arrow
                        placement="left"
                      >
                        <MenuItem
                          key={index}
                          onClick={(event) => handleMenuItemClick(event, index)}
                          role="menuitem"
                          tabIndex={0}
                          aria-label={`Abrir evidência ${index + 1}: ${description || 'Evidência necessária para concluir a missão'}`}
                          sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem", lg: "20px" },
                            textTransform: "none",
                            minWidth: { xs: "200px", sm: "250px", lg: "300px" },
                            px: 3,
                            py: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            "&:hover": {
                              backgroundColor: "#12447F",
                              color: "white",
                              transform: "scale(1.02)",
                              transition: "all 0.2s ease",
                            }
                          }}
                        >
                          Evidência {index + 1}
                          <OpenInNew sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem", lg: "20px" },
                            ml: 1
                          }} />
                        </MenuItem>
                      </Tooltip>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    );
  }

  return (
    <Box
      onClick={(e) => {
        console.log({title, evidence, description})
        const linkToOpen = evidence;
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