import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { getAdminModules, getModuleGames, createGame, updateGame, deleteGame, getGameQuestions, createQuestion, deleteQuestion } from '../../services/adminService';
import './AdminManagement.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminModuleDetails = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleDetails, setModuleDetails] = useState(null);
  const [games, setGames] = useState([]);
  
  // Game Dialog
  const [openGameDialog, setOpenGameDialog] = useState(false);
  const [gameFormData, setGameFormData] = useState({ title: '', description: '', gameType: 'QUIZ', passingScore: 70, displayOrder: 1 });
  const [editGameId, setEditGameId] = useState(null);

  // Question Dialog
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({ 
    questionText: '', questionType: 'MULTIPLE_CHOICE', 
    optionA: '', optionB: '', optionC: '', optionD: '', 
    correctOption: 'A', explanation: '', marks: 10 
  });
  const [activeGameId, setActiveGameId] = useState(null);

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      const allModules = await getAdminModules();
      const mod = allModules.find(m => m.moduleId === parseInt(moduleId));
      setModuleDetails(mod);
      
      const gamesData = await getModuleGames(moduleId);
      // Fetch questions for each game
      const gamesWithQuestions = await Promise.all(
        gamesData.map(async (game) => {
          const questions = await getGameQuestions(game.gameId);
          return { ...game, questions };
        })
      );
      setGames(gamesWithQuestions);
    } catch (error) {
      console.error('Error fetching module details:', error);
    }
  };

  // --- Games Handlers ---
  const handleOpenGame = (game = null) => {
    if (game) {
      setGameFormData(game);
      setEditGameId(game.gameId);
    } else {
      setGameFormData({ title: '', description: '', gameType: 'QUIZ', passingScore: 70, displayOrder: games.length + 1 });
      setEditGameId(null);
    }
    setOpenGameDialog(true);
  };

  const handleSaveGame = async () => {
    try {
      if (editGameId) {
        await updateGame(editGameId, gameFormData);
      } else {
        await createGame(moduleId, gameFormData);
      }
      fetchModuleData();
      setOpenGameDialog(false);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm("Delete this game and all its questions?")) {
      try {
        await deleteGame(gameId);
        fetchModuleData();
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  // --- Questions Handlers ---
  const handleOpenQuestion = (gameId) => {
    setActiveGameId(gameId);
    setQuestionFormData({ 
      questionText: '', questionType: 'MULTIPLE_CHOICE', 
      optionA: '', optionB: '', optionC: '', optionD: '', 
      correctOption: 'A', explanation: '', marks: 10 
    });
    setOpenQuestionDialog(true);
  };

  const handleSaveQuestion = async () => {
    try {
      await createQuestion(activeGameId, questionFormData);
      fetchModuleData();
      setOpenQuestionDialog(false);
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Delete this question?")) {
      try {
        await deleteQuestion(questionId);
        fetchModuleData();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  if (!moduleDetails) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box className="admin-management-header" sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin/learning')}><ArrowBackIcon /></IconButton>
          <Typography variant="h5" fontWeight="bold">{moduleDetails.title} - Games & Content</Typography>
        </Box>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpenGame()}>
          Add Game
        </Button>
      </Box>

      {games.length === 0 ? (
        <Typography>No games found for this module. Create one to get started.</Typography>
      ) : (
        games.map(game => (
          <Accordion key={game.gameId} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold" sx={{ flexGrow: 1 }}>{game.title} ({game.gameType})</Typography>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenGame(game); }}><EditIcon /></IconButton>
              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteGame(game.gameId); }}><DeleteIcon /></IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">{game.description}</Typography>
                <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenQuestion(game.gameId)}>
                  Add Question
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Options</TableCell>
                      <TableCell>Correct</TableCell>
                      <TableCell>Marks</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {game.questions && game.questions.map(q => (
                      <TableRow key={q.questionId}>
                        <TableCell>{q.questionText}</TableCell>
                        <TableCell>
                          A: {q.optionA}, B: {q.optionB}, C: {q.optionC}, D: {q.optionD}
                        </TableCell>
                        <TableCell fontWeight="bold">{q.correctOption}</TableCell>
                        <TableCell>{q.marks}</TableCell>
                        <TableCell align="right">
                          <IconButton color="error" size="small" onClick={() => handleDeleteQuestion(q.questionId)}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!game.questions || game.questions.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No questions added yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Game Dialog */}
      <Dialog open={openGameDialog} onClose={() => setOpenGameDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editGameId ? 'Edit Game' : 'Add Game'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField label="Title" value={gameFormData.title} onChange={e => setGameFormData({ ...gameFormData, title: e.target.value })} fullWidth />
          <TextField label="Description" value={gameFormData.description} onChange={e => setGameFormData({ ...gameFormData, description: e.target.value })} fullWidth />
          <TextField select label="Game Type" value={gameFormData.gameType} onChange={e => setGameFormData({ ...gameFormData, gameType: e.target.value })} fullWidth>
            <MenuItem value="QUIZ">Quiz</MenuItem>
            <MenuItem value="FLASHCARDS">Flashcards</MenuItem>
            <MenuItem value="SIMULATION">Simulation</MenuItem>
          </TextField>
          <TextField type="number" label="Passing Score" value={gameFormData.passingScore} onChange={e => setGameFormData({ ...gameFormData, passingScore: e.target.value })} fullWidth />
          <TextField type="number" label="Display Order" value={gameFormData.displayOrder} onChange={e => setGameFormData({ ...gameFormData, displayOrder: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGameDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveGame} variant="contained" color="success">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Question</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField label="Question Text" value={questionFormData.questionText} onChange={e => setQuestionFormData({ ...questionFormData, questionText: e.target.value })} fullWidth multiline rows={2} />
          <TextField label="Option A" value={questionFormData.optionA} onChange={e => setQuestionFormData({ ...questionFormData, optionA: e.target.value })} fullWidth />
          <TextField label="Option B" value={questionFormData.optionB} onChange={e => setQuestionFormData({ ...questionFormData, optionB: e.target.value })} fullWidth />
          <TextField label="Option C" value={questionFormData.optionC} onChange={e => setQuestionFormData({ ...questionFormData, optionC: e.target.value })} fullWidth />
          <TextField label="Option D" value={questionFormData.optionD} onChange={e => setQuestionFormData({ ...questionFormData, optionD: e.target.value })} fullWidth />
          <TextField select label="Correct Option" value={questionFormData.correctOption} onChange={e => setQuestionFormData({ ...questionFormData, correctOption: e.target.value })} fullWidth>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </TextField>
          <TextField label="Explanation" value={questionFormData.explanation} onChange={e => setQuestionFormData({ ...questionFormData, explanation: e.target.value })} fullWidth />
          <TextField type="number" label="Marks" value={questionFormData.marks} onChange={e => setQuestionFormData({ ...questionFormData, marks: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuestionDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained" color="success">Save</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminModuleDetails;
