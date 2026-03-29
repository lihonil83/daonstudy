import { useEffect, useRef, useState } from 'react';
import { addStudyTime, getTodayStudyMinutes, loadStudyLog } from '../models/studyLogModel';

/**
 * 앱 사용 시간을 백그라운드에서 추적하는 커스텀 훅.
 * 실시간 UI 업데이트와 30초 단위 저장 기능을 제공합니다.
 */
export function useStudyLogger() {
  const [storedMinutes, setStoredMinutes] = useState(() => getTodayStudyMinutes());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const timerRef = useRef(null);
  const bufferedSecondsRef = useRef(0);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
      bufferedSecondsRef.current += 1;

      // 30초마다 localStorage에 저장
      if (bufferedSecondsRef.current >= 30) {
        saveToStorage();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      saveToStorage();
    };
  }, []);

  const saveToStorage = () => {
    if (bufferedSecondsRef.current > 0) {
      addStudyTime(bufferedSecondsRef.current);
      bufferedSecondsRef.current = 0;
      setStoredMinutes(getTodayStudyMinutes());
      setSessionSeconds(0); // 세션 초 초기화 (저장되었으므로)
    }
  };

  // UI에는 저장된 분 + 현재 세션의 분을 합쳐서 표시
  const displayMinutes = storedMinutes + Math.floor(sessionSeconds / 60);

  return {
    todayMinutes: displayMinutes,
    refreshStudyLog: () => {
      setStoredMinutes(getTodayStudyMinutes());
      setSessionSeconds(0);
    },
  };
}
