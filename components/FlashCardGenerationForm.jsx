import React, {useState} from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { generateFlashcard, generateFlashcards } from '../app/api/generation.js'
import page from '../app/dashboard/page.jsx';

const useStyles = makeStyles({
  field: {
    display: 'block'
  }
});

const FlashCardGenerationForm = () => {

  const [topic, setTopic] = useState('');
  const [numberOfFlashcards, setNumberOfFlashcards] = useState(1);

  const classes = useStyles();

  const [topicError, setTopicError] = useState(false);
  const [numberOfFlashcardsError, setNumberOfFlashcardsError] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!topic) {
      setTopicError(true);
    }

    if (!numberOfFlashcards) {
      setNumberOfFlashcardsError(true);
    }

    if (topic && numberOfFlashcards) {
      setTopicError(false);
      setNumberOfFlashcardsError(false);

      // Generate the flashcards with the OpenAI API
      try {
        const generatedFlashcards = await createFlashcards(topic, numberOfFlashcards);
        
      } catch (error) {
        console.error(error.message);
      }
    }

    setTitle('');
    setBody('');
  };

  async function createFlashcards(topic, n) {
    const response = await fetch('../app/api/route.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, n }),
    });

    const data = await response.json();
    if (response.ok) {
        return data.flashcards;
    } else {
        throw new Error(data.error || 'Failed to generate flashcards.');
    }
  };
  
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh', transform: `translateX(1.25%)`,}} align='center'>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={10} style={{ padding: 24 }}>
          <Typography variant="h4" style={{ paddingBottom: 10 }}>
            Flashcard Content
          </Typography>
          
          <Grid container spacing={2} style={{transform: `translateX(2.5%)`,}}>
          
            <Grid item xs={12}>
                <TextField className={classes.field} label="Topic" onChange={(e) => setTopic(e.target.value)} variant="outlined" color="primary" fullWidth value={topic} placeholder='Enter Title' autoComplete="off" required error={topicError}/>
            </Grid>

            <Grid item xs={12}>
                <TextField className={classes.field} type="number" label="Number" onChange={(e) => setNumberOfFlashcards(e.target.value)} variant="outlined" color="primary" fullWidth value={numberOfFlashcards} placeholder='Enter a number' autoComplete="off" required error={numberOfFlashcardsError}/>
            </Grid>


            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleGenerate}>
                {'Generate'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default FlashCardGenerationForm
