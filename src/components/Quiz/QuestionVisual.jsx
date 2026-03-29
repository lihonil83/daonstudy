import { getClockHandAngles } from '../../models/clockModel.js';
import styles from './QuestionVisual.module.css';

function ClockFace({ visual }) {
  const { hourAngle, minuteAngle } = getClockHandAngles(visual.hour, visual.minute);
  const hourRadians = ((hourAngle - 90) * Math.PI) / 180;
  const minuteRadians = ((minuteAngle - 90) * Math.PI) / 180;
  const center = 100;
  const hourLength = 42;
  const minuteLength = 66;
  const numbers = Array.from({ length: 12 }, (_, index) => index + 1);
  const ticks = Array.from({ length: 12 }, (_, index) => index);

  const hourHand = {
    x: center + hourLength * Math.cos(hourRadians),
    y: center + hourLength * Math.sin(hourRadians),
  };
  const minuteHand = {
    x: center + minuteLength * Math.cos(minuteRadians),
    y: center + minuteLength * Math.sin(minuteRadians),
  };

  return (
    <div className={styles.frame}>
      <div className={styles.label}>시계 그림</div>
      <svg viewBox="0 0 200 200" className={styles.clock} role="img" aria-label="시계 그림">
        <defs>
          <radialGradient id="clock-face-fill" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fff3c9" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="88" fill="url(#clock-face-fill)" stroke="#213547" strokeWidth="4" />
        {ticks.map((tick) => {
          const angle = (tick * 30 * Math.PI) / 180;
          const outerX = center + 78 * Math.sin(angle);
          const outerY = center - 78 * Math.cos(angle);
          const innerX = center + 68 * Math.sin(angle);
          const innerY = center - 68 * Math.cos(angle);

          return (
            <line
              key={`tick-${tick}`}
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
              stroke="#213547"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        {numbers.map((number) => {
          const angle = ((number % 12) * 30 * Math.PI) / 180;
          const x = center + 56 * Math.sin(angle);
          const y = center - 56 * Math.cos(angle) + 6;

          return (
            <text
              key={`number-${number}`}
              x={x}
              y={y}
              textAnchor="middle"
              className={styles.number}
            >
              {number}
            </text>
          );
        })}
        <line
          x1="100"
          y1="100"
          x2={hourHand.x}
          y2={hourHand.y}
          stroke="#213547"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke="#ff8f5a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="7" fill="#213547" />
      </svg>
      <p className={styles.hint}>긴 바늘과 짧은 바늘을 보고 시간을 골라보세요.</p>
    </div>
  );
}

function PhonicsCard({ visual }) {
  return (
    <div className={`${styles.frame} ${styles.phonicsFrame}`}>
      <div className={styles.label}>파닉스 카드</div>
      {visual.upper && visual.lower ? (
        <div className={styles.phonicsLetters} aria-label={`${visual.upper}와 ${visual.lower}`}>
          <span className={styles.phonicsLetterPrimary}>{visual.upper}</span>
          <span className={styles.phonicsLetterSecondary}>{visual.lower}</span>
        </div>
      ) : null}
      {visual.keyword ? (
        <div className={styles.phonicsWordRow}>
          <span className={styles.phonicsEmoji} aria-hidden="true">
            {visual.emoji ?? '🔤'}
          </span>
          <div className={styles.phonicsWordCopy}>
            <strong>{visual.keyword}</strong>
            {visual.translation ? <span>{visual.translation}</span> : null}
          </div>
        </div>
      ) : null}
      {visual.soundLabel ? <div className={styles.phonicsChip}>{visual.soundLabel}</div> : null}
      <p className={styles.hint}>{visual.guide ?? '글자와 낱말의 첫소리를 이어 보세요.'}</p>
    </div>
  );
}

function MeasurementCard({ visual }) {
  return (
    <div className={`${styles.frame} ${styles.measurementFrame}`}>
      <div className={styles.label}>{visual.subtitle ?? '단위 카드'}</div>
      <div className={styles.measurementRow}>
        <span className={styles.measurementEmoji} aria-hidden="true">
          {visual.emoji ?? '📐'}
        </span>
        <div className={styles.measurementCopy}>
          <strong>{visual.title}</strong>
          {visual.caption ? <span>{visual.caption}</span> : null}
        </div>
      </div>
      <div className={styles.measurementChip}>
        {visual.category === 'weight' ? '무게 단위 생각하기' : '길이 단위 생각하기'}
      </div>
      <p className={styles.hint}>{visual.guide ?? '단위를 바꿔서 생각해보세요.'}</p>
    </div>
  );
}

function EquationCard({ visual }) {
  const chipText =
    visual.chip ??
    (visual.category === 'multiplication'
      ? '곱셈 생각하기'
      : visual.category === 'division'
        ? '나눗셈 생각하기'
        : '식 생각하기');

  return (
    <div className={`${styles.frame} ${styles.equationFrame}`}>
      <div className={styles.label}>{visual.label ?? '계산 카드'}</div>
      <div className={styles.equationExpression}>{visual.expression}</div>
      <div className={styles.equationChip}>{chipText}</div>
      <p className={styles.hint}>{visual.guide ?? '식을 보고 머릿속으로 계산해보세요.'}</p>
    </div>
  );
}

export default function QuestionVisual({ visual }) {
  if (!visual) {
    return null;
  }

  if (visual.type === 'clock') {
    return <ClockFace visual={visual} />;
  }

  if (visual.type === 'phonics-card') {
    return <PhonicsCard visual={visual} />;
  }

  if (visual.type === 'measurement-card') {
    return <MeasurementCard visual={visual} />;
  }

  if (visual.type === 'equation-card') {
    return <EquationCard visual={visual} />;
  }

  return null;
}
