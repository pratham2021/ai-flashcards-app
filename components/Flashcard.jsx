import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Flashcard({ question, answer }) {

  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped); 
  };

  return (
    <Box onClick={handleClick} sx={{ width: 300, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: flipped ? '#f0f0f0' : '#fff', border: '1px solid #000', padding: 2, margin: 1, cursor: 'pointer', boxShadow: 1, transition: 'transform 0.6s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', position: 'relative', }}>
      <Paper elevation={3} sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'inherit', borderRadius: 1, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.6s', }}>
          <Typography variant="body1">
            {flipped ? answer : question}
          </Typography>
      </Paper>
    </Box>
  );
}

export default Flashcard;
