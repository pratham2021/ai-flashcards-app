import React, {useState} from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  field: {
    display: 'block'
  }
});

const FlashCardGenerationForm = () => {

  const [topic, setTopic] = useState('');

  const classes = useStyles();
  const [topicError, setTopicError] = useState(false);

  const openai = require('openai');

  openai.apiKey = process.env.OPENAI_API_KEY;

  async function generateFlashcard(topic) {
    const prompt = `Generate `;
  }


  const generateFlashcards = async (event) => {
    event.preventDefault();

    if (title == '' || !title) {
      setTopicError(true);
    }

    if (title && body) {
      setTopicError(false);

      // Generate the flashcards with OpenAI API

    }

    setTitle('');
    setBody('');
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
              <Button type="submit" variant="contained" color="primary" fullWidth onClick={generateFlashcards}>
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
