import { useEffect, useMemo, useState } from 'react';
import {
  isSpeechSynthesisSupported,
  pickSpeechVoice,
} from '../models/speechModel.js';

export function useSpeechSynthesis() {
  const browserWindow = typeof window === 'undefined' ? null : window;
  const isSupported = useMemo(
    () => isSpeechSynthesisSupported(browserWindow),
    [browserWindow],
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupported || !browserWindow) {
      return undefined;
    }

    return () => {
      browserWindow.speechSynthesis.cancel();
    };
  }, [browserWindow, isSupported]);

  const stop = () => {
    if (!isSupported || !browserWindow) {
      return;
    }

    browserWindow.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speak = ({ text, lang = 'en-US', rate = 0.88, pitch = 1 } = {}) => {
    if (!isSupported || !browserWindow || !text) {
      setError('이 브라우저에서는 영어 소리 듣기를 사용할 수 없어요.');
      return false;
    }

    const utterance = new browserWindow.SpeechSynthesisUtterance(text);
    const voices = browserWindow.speechSynthesis.getVoices?.() ?? [];
    const voice = pickSpeechVoice(voices, lang);

    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setError('');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('소리를 재생하지 못했어요. 잠시 뒤 다시 시도해보세요.');
    };

    browserWindow.speechSynthesis.cancel();
    browserWindow.speechSynthesis.speak(utterance);

    return true;
  };

  return {
    error,
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
}
