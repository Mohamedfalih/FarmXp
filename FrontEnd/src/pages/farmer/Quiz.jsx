import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import learningService from '../../services/learningService';
import './Quiz.css';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameIdParam = queryParams.get('gameId');

  const [module, setModule] = useState(null);
  const [game, setGame] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Mapping of questionId -> selectedOption (A,B,C,D)
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null); // The progress response from backend

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const moduleId = Number(id);
      
      // 1. Get Module and Games
      const quizData = await learningService.getQuizByModuleId(moduleId);
      if (!quizData?.module) {
        throw new Error('Module not found.');
      }
      setModule(quizData.module);
      
      let targetGame = null;
      if (gameIdParam) {
          targetGame = quizData.games?.find(g => (g.gameId || g.id).toString() === gameIdParam);
      }
      if (!targetGame) {
          targetGame = quizData.games?.[0];
      }
      if (!targetGame) {
        throw new Error('No quiz game available for this module.');
      }
      setGame(targetGame);

      // 2. Start Game
      await learningService.startQuiz(moduleId, targetGame.gameId || targetGame.id);

      // 3. Get Questions
      const questionsData = await learningService.getQuestions(targetGame.gameId || targetGame.id);
      
      const formattedQuestions = (Array.isArray(questionsData) ? questionsData : []).map(q => ({
        id: q.questionId,
        question: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
        answerKeys: ['A', 'B', 'C', 'D'].slice(0, [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean).length)
      }));

      setQuestions(formattedQuestions);

    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError(err?.response?.data?.message || err.message || 'Unable to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const question = questions[currentQuestionIndex];
  
  const handleAnswer = (optionIndex) => {
    const optionLetter = question.answerKeys[optionIndex];
    setAnswers({
      ...answers,
      [question.id]: optionLetter,
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit Quiz
      setLoading(true);
      try {
        const payload = Object.entries(answers).map(([qId, selectedOption]) => ({
          questionId: Number(qId),
          selectedOption
        }));
        
        const res = await learningService.submitQuiz(
          module.moduleId || module.id, 
          game.gameId || game.id, 
          payload
        );
        
        setResult(res);
        setSubmitted(true);
      } catch (err) {
        console.error('Failed to submit quiz:', err);
        alert(err?.response?.data?.message || 'Failed to submit quiz answers.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    loadQuiz(); // Restarting game is probably best
  };

  if (loading && !submitted) {
    return (
      <div className="quiz-page">
        <div className="quiz-card"><p style={{padding:'40px', textAlign:'center'}}>Loading quiz...</p></div>
      </div>
    );
  }

  if (error || !module || questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-card quiz-not-found">
          <div className="quiz-result-icon">🔍</div>
          <h2>Quiz Error</h2>
          <p>{error || "The quiz for this module does not exist or has no questions."}</p>
          <button className="quiz-primary-btn" onClick={() => navigate('/farmer/learning-modules')}>
            Back to Learning Modules
          </button>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    // Determine if passed based on score / totalMarks
    const scorePct = result.totalMarks > 0 ? Math.round((result.score / result.totalMarks) * 100) : 0;
    const passed = (result.status === 'COMPLETED') || (scorePct >= 70); 

    return (
      <div className="quiz-page">
        <div className="quiz-card quiz-result-card">
          {passed ? (
            <>
              <div className="quiz-result-icon">🌱</div>
              <h1>Quiz Passed!</h1>
              <p className="quiz-result-message">Excellent work! You successfully completed the quiz.</p>
              <div className="score-circle">
                <span>{scorePct}%</span>
              </div>
              <div className="xp-earned">
                🏆 +{module.xpReward || 100} XP Earned
              </div>
              <p className="completion-note">Your module is marked as completed.</p>
              <button
                className="quiz-primary-btn"
                onClick={() => navigate(`/farmer/learning-modules/${module.moduleId || module.id}`)}
              >
                Complete Module
              </button>
            </>
          ) : (
            <>
              <div className="quiz-result-icon">📚</div>
              <h1>Keep Learning!</h1>
              <p className="quiz-result-message">You scored {scorePct}%. You need at least 70% to pass.</p>
              <div className="score-circle failed">
                <span>{scorePct}%</span>
              </div>
              <button className="quiz-primary-btn" onClick={handleRetry} disabled={loading}>
                {loading ? 'Restarting...' : '🔄 Try Again'}
              </button>
              <button
                className="quiz-secondary-btn"
                onClick={() => navigate(`/farmer/learning-modules/${module.moduleId || module.id}/start`)}
              >
                ← Back to Module
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const selectedAnswerLetter = answers[question.id];
  const selectedAnswerIndex = question.answerKeys.indexOf(selectedAnswerLetter);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="quiz-page">

      <button className="quiz-back" onClick={() => navigate(`/farmer/learning-modules/${module.moduleId || module.id}/start`)}>
        ← Back to Module
      </button>

      {/* Header */}
      <div className="quiz-card quiz-header">
        <div>
          <span className="quiz-label">MODULE QUIZ</span>
          <h1>{module.title || module.moduleName}</h1>
        </div>
        <div className="quiz-xp">
          🏆 {module.xpReward || 100} XP
        </div>
      </div>

      {/* Progress */}
      <div className="quiz-card quiz-progress-card">
        <div className="quiz-progress-info">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{answeredCount}/{questions.length} answered</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="quiz-card question-card">
        <h2>{currentQuestionIndex + 1}. {question.question}</h2>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`quiz-option ${selectedAnswerIndex === index ? 'selected' : ''}`}
              onClick={() => handleAnswer(index)}
            >
              <span className="option-letter">{question.answerKeys[index]}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        <button
          className="quiz-primary-btn next-btn"
          disabled={selectedAnswerLetter === undefined || loading}
          onClick={handleNext}
        >
          {loading ? 'Submitting...' : (isLastQuestion ? 'Submit Quiz' : 'Next Question →')}
        </button>
      </div>

    </div>
  );
};

export default Quiz;