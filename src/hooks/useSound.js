import { useCallback } from 'react';

/**
 * 학습 앱 전반에서 소리 효과를 재생하기 위한 커스텀 훅입니다.
 * public/sounds/ 폴더의 오디오 파일을 사용합니다.
 */
export function useSound() {
  const playSound = useCallback((fileName) => {
    // 파일 경로 설정 (public 폴더 기준)
    const audioPath = `./sounds/${fileName}`;
    const audio = new Audio(audioPath);

    audio.play().catch((error) => {
      // 소리 파일이 없거나 브라우저 정책(Autoplay)으로 차단된 경우 조용히 처리합니다.
      console.warn(`소리 재생 실패: ${fileName}`, error.message);
    });
  }, []);

  // 공통적으로 자주 쓰이는 소리들을 미리 정의합니다.
  const playClick = useCallback(() => playSound('click.mp3'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct.mp3'), [playSound]);
  const playWrong = useCallback(() => playSound('wrong.mp3'), [playSound]);
  const playFanfare = useCallback(() => playSound('fanfare.mp3'), [playSound]);
  const playLevelUp = useCallback(() => playSound('level-up.mp3'), [playSound]);

  return {
    playSound,
    playClick,
    playCorrect,
    playWrong,
    playFanfare,
    playLevelUp,
  };
}
