export function isSpeechSynthesisSupported(target) {
  return Boolean(target?.speechSynthesis && target?.SpeechSynthesisUtterance);
}

export function pickSpeechVoice(voices = [], lang = 'en-US') {
  const normalizedLang = String(lang).toLowerCase();
  const baseLang = normalizedLang.split('-')[0];

  return (
    voices.find((voice) => voice.lang?.toLowerCase() === normalizedLang) ??
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(`${baseLang}-`)) ??
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(baseLang)) ??
    null
  );
}

export function getSpeechPrompt(visual) {
  if (!visual || visual.type !== 'phonics-card') {
    return null;
  }

  if (visual.keyword) {
    return {
      label: `${visual.keyword} 소리 듣기`,
      text: visual.keyword,
      lang: 'en-US',
    };
  }

  const letters = [visual.upper, visual.lower].filter(Boolean);

  if (!letters.length) {
    return null;
  }

  const uniqueLetters = letters.filter((letter, index, source) => {
    const normalizedLetter = String(letter).trim().toLowerCase();

    return source.findIndex((candidate) => String(candidate).trim().toLowerCase() === normalizedLetter) === index;
  });

  return {
    label: `${letters.join('/')} 소리 듣기`,
    text: uniqueLetters.join(' '),
    lang: 'en-US',
  };
}
