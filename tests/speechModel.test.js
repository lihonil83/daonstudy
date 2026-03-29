import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getSpeechPrompt,
  isSpeechSynthesisSupported,
  pickSpeechVoice,
} from '../src/models/speechModel.js';

test('isSpeechSynthesisSupported requires speech synthesis pieces', () => {
  assert.equal(isSpeechSynthesisSupported({}), false);
  assert.equal(
    isSpeechSynthesisSupported({
      speechSynthesis: {},
      SpeechSynthesisUtterance: function MockUtterance() {},
    }),
    true,
  );
});

test('pickSpeechVoice prefers exact language before broader english matches', () => {
  const voices = [
    { name: 'English UK', lang: 'en-GB' },
    { name: 'English US', lang: 'en-US' },
    { name: 'Korean', lang: 'ko-KR' },
  ];

  assert.equal(pickSpeechVoice(voices, 'en-US')?.name, 'English US');
  assert.equal(pickSpeechVoice(voices, 'en-AU')?.name, 'English UK');
  assert.equal(pickSpeechVoice(voices, 'fr-FR'), null);
});

test('getSpeechPrompt builds prompts for phonics cards only', () => {
  assert.equal(getSpeechPrompt({ type: 'clock', hour: 3, minute: 30 }), null);

  assert.deepEqual(
    getSpeechPrompt({
      type: 'phonics-card',
      keyword: 'apple',
    }),
    {
      label: 'apple 소리 듣기',
      text: 'apple',
      lang: 'en-US',
    },
  );

  assert.deepEqual(
    getSpeechPrompt({
      type: 'phonics-card',
      upper: 'A',
      lower: 'a',
    }),
    {
      label: 'A/a 소리 듣기',
      text: 'A',
      lang: 'en-US',
    },
  );
});
