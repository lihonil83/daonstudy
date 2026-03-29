import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM, GRADES, SUBJECTS, getCurriculumByGrade } from '../../data/curriculum';
import { useProgress } from '../../hooks/useProgress';
import { useGeneratedQuiz } from '../../hooks/useGeneratedQuiz';
import { getGeminiApiKey, saveGeminiApiKey } from '../../services/geminiService';
import { isLocalGeneratorSupported } from '../../utils/localGenerator';
import styles from './Roadmap.module.css';

// 단원 완료 여부 판단
function isUnitCompleted(unitItem, getUnitProgress) {
  if (!unitItem.unitId) {
    const unitKey = `gen_${unitItem.id}`;
    return getUnitProgress(unitItem.subject, unitKey).bestStars >= 1;
  }
  return getUnitProgress(unitItem.subject, unitItem.unitId).bestStars >= 1;
}

// 오류 팝업
function ErrorModal({ message, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>⚠️ 문제 생성 실패</h3>
        <p className={styles.modalDesc}>{message}</p>
        <div className={styles.modalActions}>
          <button className={styles.modalSave} onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}

// 공급자 라벨
const PROVIDER_LABEL = {
  khan: '📺 Khan Academy',
  ebs: '📺 EBS',
  phet: '🔬 PhET',
  scratch: '🐱 Scratch',
};

// ── 리소스 선택 팝업 ──
function ResourceModal({ item, onQuiz, onEmbed, onExternal, onClose }) {
  const hasResources = item.resources && item.resources.length > 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}>{item.icon}</span>
          <div>
            <h3 className={styles.modalTitle}>{item.title}</h3>
            <p className={styles.modalDesc}>{item.description}</p>
          </div>
        </div>

        <div className={styles.resourceList}>
          {/* 퀴즈 버튼 (항상 표시) */}
          <button className={styles.resourceBtn} onClick={onQuiz} type="button">
            <span className={styles.resourceIcon}>🎯</span>
            <div className={styles.resourceBody}>
              <strong>퀴즈 풀기</strong>
              <span>{item.unitId ? '문제 풀기 시작' : 'AI가 문제를 만들어줘요'}</span>
            </div>
            <span className={styles.resourceArrow}>→</span>
          </button>

          {/* 외부 리소스 버튼들 */}
          {hasResources && item.resources.map((res, i) => (
            <button
              key={i}
              className={styles.resourceBtn}
              type="button"
              onClick={() => res.embedable ? onEmbed(res) : onExternal(res)}
            >
              <span className={styles.resourceIcon}>
                {res.type === 'simulation' ? '🔬' : '📺'}
              </span>
              <div className={styles.resourceBody}>
                <strong>{PROVIDER_LABEL[res.provider] || res.label}</strong>
                <span>{res.embedable ? '앱 안에서 체험' : '새 탭에서 열기'}</span>
              </div>
              <span className={styles.resourceArrow}>{res.embedable ? '→' : '↗'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── API 키 입력 팝업 ──
function ApiKeyModal({ onSave, onClose }) {
  const [keyInput, setKeyInput] = useState('');
  const handleSave = () => {
    if (!keyInput.trim()) return;
    saveGeminiApiKey(keyInput.trim());
    onSave();
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>🔑 Gemini API 키 입력</h3>
        <p className={styles.modalDesc}>
          3~6학년 문제를 AI가 즉석으로 만들어줘요.<br />
          <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className={styles.modalLink}>
            Google AI Studio
          </a>
          에서 무료로 발급받을 수 있어요.
        </p>
        <input
          className={styles.modalInput}
          type="password"
          placeholder="AIzaSy..."
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <div className={styles.modalActions}>
          <button className={styles.modalSave} onClick={handleSave}>저장하기</button>
          <button className={styles.modalCancel} onClick={onClose}>나중에</button>
        </div>
      </div>
    </div>
  );
}

// ── 문제 생성 중 로딩 팝업 ──
function GeneratingModal({ unitTitle }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.spinner} />
        <h3 className={styles.modalTitle}>✨ 문제 만드는 중...</h3>
        <p className={styles.modalDesc}>
          AI가 <strong>{unitTitle}</strong> 문제 10개를 만들고 있어요.<br />
          잠깐만 기다려줘요!
        </p>
      </div>
    </div>
  );
}

// ── 단원 노드 ──
function UnitNode({ item, completed, hasResources, isInfinite, hasCache, onClick }) {
  const subjectStyle = item.subject === 'math' ? styles.nodeMath : styles.nodeEnglish;
  return (
    <button
      className={`${styles.unitNode} ${subjectStyle} ${completed ? styles.nodeCompleted : ''}`}
      onClick={() => onClick(item)}
      type="button"
    >
      <span className={styles.nodeIcon}>{item.icon}</span>
      <span className={styles.nodeTitle}>{item.title}</span>
      {completed && <span className={styles.checkBadge}>✅</span>}
      {isInfinite && <span className={styles.infiniteBadge}>⚡ 무한</span>}
      {!isInfinite && hasCache && !completed && <span className={styles.cacheBadge}>⚡ 생성됨</span>}
      {hasResources && !completed && <span className={styles.resourceBadge}>+</span>}
    </button>
  );
}

export default function Roadmap() {
  const [selectedGrade, setSelectedGrade] = useState(2);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [generatingItem, setGeneratingItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { getUnitProgress } = useProgress();
  const { generateQuiz, error: quizError } = useGeneratedQuiz();
  const navigate = useNavigate();

  const gradeUnits = useMemo(() => getCurriculumByGrade(selectedGrade), [selectedGrade]);
  const mathUnits = gradeUnits.filter(u => u.subject === 'math');
  const englishUnits = gradeUnits.filter(u => u.subject === 'english');

  // 노드 클릭 → 리소스가 있으면 선택 팝업, 없으면 바로 퀴즈
  const handleNodeClick = useCallback((item) => {
    const hasResources = item.resources && item.resources.length > 0;
    if (hasResources) {
      setSelectedItem(item);
    } else {
      handleStartQuiz(item);
    }
  }, []);

  // 퀴즈 시작 처리
  const handleStartQuiz = useCallback(async (item) => {
    setSelectedItem(null);
    setErrorMessage(null);

    if (item.linkTo) {
      navigate(item.linkTo);
      return;
    }

    if (item.unitId) {
      navigate(`/${item.subject}/${item.unitId}`);
      return;
    }

    // Gemini 생성
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setPendingItem(item);
      setShowApiKeyModal(true);
      return;
    }

    setGeneratingItem(item);
    try {
      const result = await generateQuiz(item.id, item.promptTemplate);
      if (result.success && result.questions && result.questions.length > 0) {
        sessionStorage.setItem('generatedQuizData', JSON.stringify({
          curriculumId: item.id,
          title: item.title,
          description: item.description,
          subject: item.subject,
          questions: result.questions,
        }));
        navigate('/quiz/generated');
      } else {
        setErrorMessage(result.errorMessage || '문제를 생성하지 못했어요.');
      }
    } catch (err) {
      if (err.message === 'GEMINI_API_KEY_MISSING') {
        setPendingItem(item);
        setShowApiKeyModal(true);
      } else {
        setErrorMessage(`오류: ${err.message || '알 수 없는 오류가 발생했어요.'}`);
      }
    } finally {
      setGeneratingItem(null);
    }
  }, [generateQuiz, navigate, quizError]);

  // PhET 임베드 시작
  const handleEmbed = useCallback((res) => {
    setSelectedItem(null);
    const providerLabel = PROVIDER_LABEL[res.provider] || res.label;
    sessionStorage.setItem('embedActivityData', JSON.stringify({
      url: res.url,
      title: res.label,
      providerLabel,
    }));
    navigate('/activity/embed');
  }, [navigate]);

  // 외부 링크 새 탭 열기
  const handleExternal = useCallback((res) => {
    window.open(res.url, '_blank', 'noreferrer');
    setSelectedItem(null);
  }, []);

  const handleApiKeySaved = async () => {
    setShowApiKeyModal(false);
    if (pendingItem) {
      const item = pendingItem;
      setPendingItem(null);
      await handleStartQuiz(item);
    }
  };

  const gradeProgress = useMemo(() =>
    GRADES.map(grade => {
      const units = getCurriculumByGrade(grade);
      const completed = units.filter(u => isUnitCompleted(u, getUnitProgress)).length;
      return { grade, total: units.length, completed };
    }), [getUnitProgress]);

  const renderUnitGroup = (units, subject) => (
    <div className={styles.subjectGroup}>
      <div className={styles.subjectLabel}>
        <span className={styles.subjectIcon}>{SUBJECTS[subject].icon}</span>
        <span>{SUBJECTS[subject].label}</span>
      </div>
      <div className={styles.nodeRow}>
        {units.map((item) => {
          const isCompleted = isUnitCompleted(item, getUnitProgress);
          const hasResources = item.resources && item.resources.length > 0;
          const hasCache = !!localStorage.getItem(`eduapp_generated_quiz_${item.id}`);
          const isInfinite = isLocalGeneratorSupported(item.id);
          
          return (
            <div key={item.id} className={styles.nodeWrapper}>
              <UnitNode 
                item={item} 
                completed={isCompleted} 
                hasResources={hasResources}
                isInfinite={isInfinite}
                hasCache={hasCache}
                onClick={handleNodeClick} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.kicker}>학습 여행 지도</p>
        <h2 className={styles.heading}>🗺️ 내 학습 로드맵</h2>
        <p className={styles.subheading}>단원을 클릭하면 퀴즈, 영상, 시뮬레이션 중 선택할 수 있어요!</p>
      </div>

      <div className={styles.gradeTabBar}>
        {gradeProgress.map(({ grade, total, completed }) => (
          <button
            key={grade}
            type="button"
            className={`${styles.gradeTab} ${selectedGrade === grade ? styles.gradeTabActive : ''}`}
            onClick={() => setSelectedGrade(grade)}
          >
            <span className={styles.gradeLabel}>{grade}학년</span>
            <span className={styles.gradeCount}>{completed}/{total}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {mathUnits.length > 0 && renderUnitGroup(mathUnits, 'math')}
        {englishUnits.length > 0 && renderUnitGroup(englishUnits, 'english')}
      </div>

      {/* 리소스 선택 팝업 */}
      {selectedItem && (
        <ResourceModal
          item={selectedItem}
          onQuiz={() => handleStartQuiz(selectedItem)}
          onEmbed={handleEmbed}
          onExternal={handleExternal}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* 오류 팝업 */}
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      {showApiKeyModal && (
        <ApiKeyModal
          onSave={handleApiKeySaved}
          onClose={() => { setShowApiKeyModal(false); setPendingItem(null); }}
        />
      )}
      {generatingItem && <GeneratingModal unitTitle={generatingItem.title} />}
    </section>
  );
}
