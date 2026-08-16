import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';
import './StartModule.css';

const getCategoryStyle = (category) => {
  const value = String(category || '').toLowerCase();
  if (value.includes('soil')) return { bg: 'var(--sprout-light)', tagCol: 'var(--sprout)', icon: '🌱', tag: 'SOIL HEALTH' };
  if (value.includes('water')) return { bg: 'var(--sky-light)', tagCol: 'var(--sky, #3E8FA0)', icon: '💧', tag: 'WATER MGMT' };
  if (value.includes('organic')) return { bg: 'var(--clay-light)', tagCol: 'var(--clay, #C1552E)', icon: '🧪', tag: 'ORGANIC' };
  if (value.includes('pest')) return { bg: 'var(--harvest-light)', tagCol: '#9A6A0E', icon: '🌱', tag: 'PEST CONTROL' };
  if (value.includes('crop')) return { bg: 'var(--sprout-light)', tagCol: 'var(--sprout)', icon: '🌾', tag: 'CROP CARE' };
  if (value.includes('compost')) return { bg: 'var(--harvest-light)', tagCol: '#9A6A0E', icon: '♻️', tag: 'COMPOSTING' };
  return { bg: 'var(--sprout-light)', tagCol: 'var(--sprout)', icon: '📚', tag: String(category || 'LEARNING').toUpperCase() };
};

const parseObjectives = (objectives) => {
  if (!objectives) return [];
  if (Array.isArray(objectives)) return objectives;
  const value = String(objectives).trim();
  if (!value) return [];
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
  }
  if (value.includes('\n')) {
    return value.split('\n').map(item => item.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  }
  if (value.includes(',')) {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [value];
};

const getEmbedUrl = (url) => {
  if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
  if (url.includes('youtube.com/embed/')) return url;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
};


const StartModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [content, setContent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadModuleData();
  }, [id]);

  const loadModuleData = async () => {
    setLoading(true);
    setError('');
    try {
      const moduleId = Number(id);
      
      const [moduleData, contentData, progressData] = await Promise.all([
        learningService.getModuleById(moduleId),
        learningService.getModuleContent(moduleId).catch(() => null),
        learningService.getModuleProgress().catch(() => [])
      ]);

      setModule(moduleData);
      
      // ModuleContent contains videoUrl, games, etc.
      setContent(contentData);

      let currentProgress = 0;
      const pList = Array.isArray(progressData) ? progressData : (progressData?.modules || progressData?.progress || []);
      const currentP = pList.find(p => Number(p.moduleId ?? p.id) === moduleId);
      if (currentP) {
        currentProgress = Number(currentP.completionPercentage ?? currentP.progressPercentage ?? currentP.progress ?? 0);
      }
      setProgress(Math.min(100, Math.max(0, currentProgress)));

    } catch (err) {
      console.error('Failed to load module start data:', err);
      setError('Unable to load module content.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/farmer/learning-modules/${id}`);
  };

  const handleTakeQuiz = (gameId) => {
    navigate(`/farmer/learning-modules/${id}/quiz?gameId=${gameId}`);
  };

  const handleCompleteModule = async () => {
    setLoading(true);
    try {
      await learningService.completeModule(module.moduleId || module.id);
      await loadModuleData();
    } catch(err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to complete module');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="start-module-page">
        <button className="start-module-back" onClick={handleBack}>← Back</button>
        <div className="start-module-card"><p style={{padding:'20px', textAlign:'center'}}>Loading module content...</p></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="start-module-page">
        <button className="start-module-back" onClick={() => navigate('/farmer/learning-modules')}>← Back to Learning Modules</button>
        <div className="start-module-card not-found">
          <div className="not-found-icon" aria-hidden="true">🔍</div>
          <h2>Module Not Found</h2>
          <p>{error || "The learning module you're looking for doesn't exist or may have been removed."}</p>
          <button className="start-btn" onClick={() => navigate('/farmer/learning-modules')}>Back to Learning Modules</button>
        </div>
      </div>
    );
  }

  const style = getCategoryStyle(module.category);
  const objectives = parseObjectives(module.objectives);
  const rawVideoUrl = module?.videoUrl || content?.module?.videoUrl || content?.videoUrl;
  const videoUrl = getEmbedUrl(rawVideoUrl);
  const gamesCount = content?.games?.length || 1;
  const questionsCount = content?.games?.[0]?.questions?.length || 3;

  return (
    <div className="start-module-page">

      {/* Back */}
      <button className="start-module-back" onClick={handleBack}>
        ← Back to Module Details
      </button>

      {/* Module Header */}
      <div className="start-module-card module-header-card">
        <div className="module-header-icon" style={{ background: style.bg }} aria-hidden="true">
          {module.icon || style.icon}
        </div>

        <div className="module-header-content">
          <span className="module-category">{style.tag}</span>
          <h1>{module.title || module.moduleName}</h1>
          <div className="module-meta">
            <span>🌱 {module.durationMinutes || 10} min</span>
            <span>🏆 {module.xpReward || 100} XP</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="start-module-card progress-card">
        <div className="progress-header">
          <strong>Your Progress</strong>
          <span>{progress}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-value" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Video */}
      <div className="start-module-card">
        <h2 className="content-title">🌱 Learn Through Video</h2>
        <div className="video-wrapper">
          <iframe
            src={videoUrl}
            title={`${module.title} learning video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="video-note">
          Watch the video carefully and review the learning material before attempting the quiz.
        </p>
      </div>

      {/* About */}
      <div className="start-module-card">
        <h2 className="content-title">📚 About This Module</h2>
        <p className="module-description">{module.description || "No description provided."}</p>
      </div>

      {/* Objectives */}
      <div className="start-module-card">
        <h2 className="content-title">🎯 What You'll Learn</h2>
        {objectives.length > 0 ? (
          <ul className="learning-objectives">
            {objectives.map((objective, index) => (
              <li key={index}>
                <span className="objective-check">✓</span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No specific objectives listed.</p>
        )}
      </div>

      {/* Quiz Gate */}
      {!content?.games || content.games.length === 0 ? (
          <div className="start-module-card quiz-gate-card">
            <div className="quiz-gate-header">
              <div className="quiz-gate-icon">✅</div>
              <div>
                <span className="quiz-gate-label">MODULE COMPLETION</span>
                <h2>You've finished the material!</h2>
                <p>
                  Mark this module as complete to unlock your <strong>{module.xpReward || 100} XP</strong> reward.
                </p>
              </div>
            </div>
            <div className="quiz-gate-footer">
              <div className="quiz-requirement">
                🔐 Complete to earn XP
              </div>
              <button className="quiz-btn" type="button" onClick={handleCompleteModule}>
                ✅ Complete Module
              </button>
            </div>
          </div>
      ) : (
          content.games.map((g, idx) => (
              <div className="start-module-card quiz-gate-card" key={g.gameId || g.id || idx} style={{marginTop: '20px'}}>
                <div className="quiz-gate-header">
                  <div className="quiz-gate-icon">🏆</div>
                  <div>
                    <span className="quiz-gate-label">MODULE CHALLENGE {content.games.length > 1 ? `(${idx + 1}/${content.games.length})` : ''}</span>
                    <h2>{g.title || `Ready to Test Your Knowledge?`}</h2>
                    <p>
                      Complete the quiz to prove what you've learned.
                    </p>
                  </div>
                </div>

                <div className="quiz-info-grid">
                  <div className="quiz-info-item">
                    <span className="quiz-info-icon">🌱</span>
                    <div>
                      <strong>{g.questions?.length || questionsCount} Questions</strong>
                      <span>Quick assessment</span>
                    </div>
                  </div>
                  <div className="quiz-info-item">
                    <span className="quiz-info-icon">🎯</span>
                    <div>
                      <strong>70% Required</strong>
                      <span>Passing score</span>
                    </div>
                  </div>
                  <div className="quiz-info-item">
                    <span className="quiz-info-icon">🏆</span>
                    <div>
                      <strong>Reward</strong>
                      <span>XP Boost</span>
                    </div>
                  </div>
                </div>

                <div className="quiz-gate-footer">
                  <div className="quiz-requirement">
                    🔐 Pass the quiz to complete this section
                  </div>
                  <button className="quiz-btn" type="button" onClick={() => handleTakeQuiz(g.gameId || g.id)}>
                    🌱 Start Quiz {content.games.length > 1 ? `${idx + 1}` : ''} →
                  </button>
                </div>
              </div>
          ))
      )}

    </div>
  );
};

export default StartModule;