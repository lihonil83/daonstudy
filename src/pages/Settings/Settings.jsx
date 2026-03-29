import { useState, useEffect } from 'react';
import { getGeminiApiKey, saveGeminiApiKey, testGeminiConnection, getAvailableModels } from '../../services/geminiService';
import styles from './Settings.module.css';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [isListingModels, setIsListingModels] = useState(false);
  const [testResult, setTestResult] = useState({ success: null, message: '' });
  const [error, setError] = useState('');

  // 컴포넌트 마운트 시 저장된 API 키 로드
  useEffect(() => {
    const savedKey = getGeminiApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    setError('');
    setIsSaved(false);

    if (!apiKey.trim()) {
      setError('Gemini API 키를 입력해 주세요.');
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      setError('올바른 Gemini API 키 형식이 아닌 것 같아요. 다시 확인해 주세요.');
      return;
    }

    try {
      saveGeminiApiKey(apiKey.trim());
      setIsSaved(true);
      setError('');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setError('API 키 저장 중 오류가 발생했습니다.');
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError('테스트할 API 키를 입력해 주세요.');
      return;
    }

    setIsTesting(true);
    setTestResult({ success: null, message: '' });
    setError('');

    try {
      const response = await testGeminiConnection(apiKey.trim());
      setTestResult({
        success: true,
        message: `연결 성공! (AI 응답: "${response}")`
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: `연결 실패: ${err.message || 'API 키를 다시 확인해 주세요.'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleListModels = async () => {
    if (!apiKey.trim()) {
      setError('모델 목록을 조회할 API 키를 입력해 주세요.');
      return;
    }

    setIsListingModels(true);
    setAvailableModels([]);
    setError('');

    try {
      const models = await getAvailableModels(apiKey.trim());
      setAvailableModels(models);
    } catch (err) {
      setError(`모델 목록 조회 실패: ${err.message}`);
    } finally {
      setIsListingModels(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.section}>
          <h2 className={styles.title}>⚙️ 설정</h2>
          <p className={styles.description}>
            다온 학습의 AI 기능을 사용하기 위해 필요한 설정을 관리합니다.
          </p>
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="api-key-input">Gemini API 키</label>
          <div className={styles.inputGroup}>
            <input
              id="api-key-input"
              type="password"
              className={styles.input}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult({ success: null, message: '' });
              }}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              autoComplete="off"
            />
            <p className={styles.inputHint}>
              입력하신 API 키는 브라우저의 안전한 저장소(localStorage)에만 저장되며, 복사가 차단되어 안전합니다.
            </p>
          </div>
        </div>

        {testResult.message && (
          <div className={`${styles.statusMessage} ${testResult.success ? styles.statusSuccess : styles.statusError}`}>
            {testResult.success ? '✅' : '❌'} {testResult.message}
          </div>
        )}

        {isSaved && (
          <div className={`${styles.statusMessage} ${styles.statusSuccess}`}>
            ✅ API 키가 안전하게 저장되었습니다! 이제 AI 퀴즈를 생성할 수 있어요.
          </div>
        )}

        {error && (
          <div className={`${styles.statusMessage} ${styles.statusError}`} style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' }}>
            ⚠️ {error}
          </div>
        )}

        <div className={styles.actions}>
          <button 
            className={styles.testOutlineButton} 
            onClick={handleListModels}
            disabled={isListingModels}
          >
            {isListingModels ? '모델 조회 중...' : '지원 모델 확인'}
          </button>
          <button 
            className={styles.testButton} 
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? '연결 확인 중...' : '연결 테스트'}
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            저장하기
          </button>
        </div>

        {availableModels.length > 0 && (
          <div className={styles.modelListCard}>
            <span className={styles.infoTitle}>✅ 내 키로 사용 가능한 모델 목록</span>
            <div className={styles.modelTags}>
              {availableModels.map(m => (
                <span key={m.name} className={styles.modelTag} title={m.description}>
                  {m.name.replace('models/', '')}
                </span>
              ))}
            </div>
            <p className={styles.inputHint}>
              목록에 gemini-1.5-flash나 gemini-pro가 있는지 확인해 보세요.
            </p>
          </div>
        )}

        <div className={styles.infoCard}>
          <span className={styles.infoTitle}>💡 API 키가 없으신가요?</span>
          <ul className={styles.infoList}>
            <li>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.link}
              >
                Google AI Studio
              </a>
              에서 무료로 API 키를 발급받을 수 있습니다.
            </li>
            <li>발급받은 키를 복사해서 위 입력란에 붙여넣고 [저장하기]를 눌러주세요.</li>
            <li>키는 한번만 설정하면 계속 사용할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
