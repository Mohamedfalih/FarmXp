import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Quiz.css';

// Mock quiz data.
// Later:
// learningService.getQuizByModuleId(id)
const QUIZZES = {
  1: {
    moduleId: 1,
    title: 'Understanding Soil pH',
    xp: 100,
    passingScore: 70,

    questions: [
      {
        id: 1,
        question: 'What does soil pH indicate?',
        options: [
          'The amount of sunlight',
          'How acidic or alkaline the soil is',
          'The amount of water in soil',
          'The temperature of the soil',
        ],
        answer: 1,
      },
      {
        id: 2,
        question: 'Which pH range is generally considered suitable for many crops?',
        options: [
          '1–2',
          '3–4',
          '6–7',
          '12–14',
        ],
        answer: 2,
      },
      {
        id: 3,
        question: 'Why is soil pH important?',
        options: [
          'It affects nutrient availability',
          'It controls rainfall',
          'It determines farm size',
          'It changes the crop variety automatically',
        ],
        answer: 0,
      },
    ],
  },

  2: {
    moduleId: 2,
    title: 'Efficient Drip Irrigation',
    xp: 150,
    passingScore: 70,

    questions: [
      {
        id: 1,
        question: 'Where does drip irrigation deliver water?',
        options: [
          'Directly near the crop root zone',
          'Only onto the leaves',
          'Only into drainage channels',
          'Into the air',
        ],
        answer: 0,
      },
      {
        id: 2,
        question: 'What is a major advantage of drip irrigation?',
        options: [
          'Increased water wastage',
          'Reduced water wastage',
          'Higher soil erosion',
          'No need for crops',
        ],
        answer: 1,
      },
      {
        id: 3,
        question: 'What should farmers regularly check in drip systems?',
        options: [
          'Emitter blockage',
          'Cloud color',
          'Farm boundary',
          'Sunrise time',
        ],
        answer: 0,
      },
    ],
  },

  3: {
    moduleId: 3,
    title: 'Making Bio-Pesticides',
    xp: 120,
    passingScore: 70,

    questions: [
      {
        id: 1,
        question: 'Which plant is commonly used in natural pest-control preparations?',
        options: [
          'Neem',
          'Rose',
          'Lotus',
          'Bamboo',
        ],
        answer: 0,
      },
      {
        id: 2,
        question: 'Why should bio-pesticides be applied carefully?',
        options: [
          'To avoid damaging crops and beneficial organisms',
          'To increase chemical usage',
          'To stop irrigation',
          'To remove all insects from the environment',
        ],
        answer: 0,
      },
      {
        id: 3,
        question: 'What is one benefit of bio-pesticides?',
        options: [
          'They can reduce dependence on synthetic pesticides',
          'They always increase pests',
          'They eliminate the need for farming',
          'They require no preparation',
        ],
        answer: 0,
      },
    ],
  },

  4: {
    moduleId: 4,
    title: 'Natural Pest Deterrents',
    xp: 110,
    passingScore: 70,

    questions: [
      {
        id: 1,
        question: 'What is companion planting?',
        options: [
          'Growing selected plants together to benefit the crop',
          'Removing all plants',
          'Flooding the field',
          'Using only chemical pesticides',
        ],
        answer: 0,
      },
      {
        id: 2,
        question: 'Why should farmers identify pests early?',
        options: [
          'To prevent the problem from spreading',
          'To increase crop damage',
          'To waste water',
          'To stop harvesting',
        ],
        answer: 0,
      },
      {
        id: 3,
        question: 'Which can be used as a natural pest-management method?',
        options: [
          'Physical barriers',
          'Ignoring pests',
          'Overwatering',
          'Removing healthy crops',
        ],
        answer: 0,
      },
    ],
  },

  5: {
    moduleId: 5,
    title: 'Crop Rotation Basics',
    xp: 130,
    passingScore: 70,

    questions: [
      {
        id: 1,
        question: 'What is crop rotation?',
        options: [
          'Growing different crops in sequence across seasons',
          'Growing only one crop forever',
          'Removing all crops',
          'Changing the farm location every day',
        ],
        answer: 0,
      },
      {
        id: 2,
        question: 'How can crop rotation benefit soil?',
        options: [
          'It can help reduce nutrient depletion',
          'It always damages soil',
          'It removes all nutrients',
          'It prevents irrigation',
        ],
        answer: 0,
      },
      {
        id: 3,
        question: 'Crop rotation can help break what?',
        options: [
          'Some pest and disease cycles',
          'The water cycle',
          'The sunrise cycle',
          'The weather cycle',
        ],
        answer: 0,
      },
    ],
  },

  6: {
    moduleId: 6,
    title: 'Composting Basics',
    xp: 90,
    passingScore: 70,

    questions: [
      {
        id: 1,
        question: 'What is compost?',
        options: [
          'Decomposed organic material',
          'Plastic waste',
          'Chemical pesticide',
          'Pure sand',
        ],
        answer: 0,
      },
      {
        id: 2,
        question: 'What is important when maintaining a compost pile?',
        options: [
          'Proper moisture',
          'Keeping it completely dry',
          'Adding plastic',
          'Preventing all decomposition',
        ],
        answer: 0,
      },
      {
        id: 3,
        question: 'What can compost improve?',
        options: [
          'Soil structure and organic matter',
          'Plastic production',
          'Fuel consumption',
          'Farm boundaries',
        ],
        answer: 0,
      },
    ],
  },
};

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quiz = QUIZZES[id];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <div className="quiz-page">
        <div className="quiz-card quiz-not-found">
          <div className="quiz-result-icon">🔍</div>

          <h2>Quiz Not Found</h2>

          <p>
            The quiz for this module does not exist.
          </p>

          <button
            className="quiz-primary-btn"
            type="button"
            onClick={() => navigate('/farmer/learning-modules')}
          >
            Back to Learning Modules
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [question.id]: optionIndex,
    });
  };

  const calculateScore = () => {
    let correct = 0;

    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateScore();

      setScore(finalScore);
      setSubmitted(true);

      // Later:
      // learningService.submitQuiz(quiz.moduleId, answers)
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const passed = score >= quiz.passingScore;

  if (submitted) {
    return (
      <div className="quiz-page">

        <div className="quiz-card quiz-result-card">

          {passed ? (
            <>
              <div className="quiz-result-icon">
                🎉
              </div>

              <h1>Quiz Passed!</h1>

              <p className="quiz-result-message">
                Excellent work! You successfully completed the quiz.
              </p>

              <div className="score-circle">
                <span>{score}%</span>
              </div>

              <div className="xp-earned">
                🏆 +{quiz.xp} XP Earned
              </div>

              <p className="completion-note">
                Your module can now be marked as completed.
              </p>

              <button
                className="quiz-primary-btn"
                type="button"
                onClick={() =>
                  navigate(
                    `/farmer/learning-modules/${quiz.moduleId}`
                  )
                }
              >
                Complete Module
              </button>
            </>
          ) : (
            <>
              <div className="quiz-result-icon">
                📚
              </div>

              <h1>Keep Learning!</h1>

              <p className="quiz-result-message">
                You scored {score}%. You need at least{' '}
                {quiz.passingScore}% to pass this quiz.
              </p>

              <div className="score-circle failed">
                <span>{score}%</span>
              </div>

              <button
                className="quiz-primary-btn"
                type="button"
                onClick={handleRetry}
              >
                🔄 Try Again
              </button>

              <button
                className="quiz-secondary-btn"
                type="button"
                onClick={() =>
                  navigate(
                    `/farmer/learning-modules/${quiz.moduleId}/start`
                  )
                }
              >
                ← Back to Module
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  const selectedAnswer = answers[question.id];
  const isLastQuestion =
    currentQuestion === quiz.questions.length - 1;

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="quiz-page">

      {/* Back */}
      <button
        className="quiz-back"
        type="button"
        onClick={() =>
          navigate(
            `/farmer/learning-modules/${quiz.moduleId}/start`
          )
        }
      >
        ← Back to Module
      </button>

      {/* Header */}
      <div className="quiz-card quiz-header">

        <div>
          <span className="quiz-label">
            MODULE QUIZ
          </span>

          <h1>{quiz.title}</h1>
        </div>

        <div className="quiz-xp">
          🏆 {quiz.xp} XP
        </div>

      </div>

      {/* Progress */}
      <div className="quiz-card quiz-progress-card">

        <div className="quiz-progress-info">
          <span>
            Question {currentQuestion + 1} of{' '}
            {quiz.questions.length}
          </span>

          <span>
            {answeredCount}/{quiz.questions.length} answered
          </span>
        </div>

        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  quiz.questions.length) *
                100
              }%`,
            }}
          />
        </div>

      </div>

      {/* Question */}
      <div className="quiz-card question-card">

        <h2>
          {currentQuestion + 1}. {question.question}
        </h2>

        <div className="quiz-options">

          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`quiz-option ${
                selectedAnswer === index
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleAnswer(index)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span>{option}</span>
            </button>
          ))}

        </div>

        <button
          className="quiz-primary-btn next-btn"
          type="button"
          disabled={selectedAnswer === undefined}
          onClick={handleNext}
        >
          {isLastQuestion
            ? 'Submit Quiz'
            : 'Next Question →'}
        </button>

      </div>

    </div>
  );
};

export default Quiz;