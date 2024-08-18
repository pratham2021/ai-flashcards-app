"use client";
import { Box, Typography } from "@mui/material";
import "../styles/cards.css";
import { useState } from "react";

export default function Cards({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Box className="container">
      <Box className={`card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
        <Box className="front">
          <Typography variant="h2">{front}</Typography>
        </Box>
        <Box className="back">
          <Typography variant="h3">{back}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
