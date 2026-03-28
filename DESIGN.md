# DESIGN.md — UI 디자인 가이드

## 디자인 철학

> 8살 아이가 "이거 게임이야?"라고 물어보는 화면을 만든다.

- 밝고 친근한 톤, 민트색 기반
- 큰 버튼, 큰 글씨, 넉넉한 여백
- 한 화면에 하나의 행동만 요구
- 읽기보다 보기 — 아이콘과 색상으로 의미 전달

---

## 색상 시스템

### 메인 컬러

| 용도 | 이름 | HEX | 사용처 |
|------|------|-----|--------|
| Primary | 민트 | `#2EC4B6` | 주요 버튼, 헤더, 강조 |
| Primary Light | 연민트 | `#A8E6CF` | 배경 포인트, 진행률 바 |
| Primary Dark | 짙은 민트 | `#1B9E8F` | 버튼 hover, 활성 상태 |

### 피드백 컬러

| 용도 | 이름 | HEX | 사용처 |
|------|------|-----|--------|
| 정답 | 초록 | `#4CAF50` | 정답 표시, 성공 이펙트 |
| 오답 | 코랄 | `#FF6B6B` | 오답 표시 (빨강보다 부드러움) |
| 힌트 | 노랑 | `#FFD93D` | 힌트 말풍선, 경고 |
| 보상 | 골드 | `#FFB800` | XP, 레벨업, 뱃지 |

### 배경 & 중립

| 용도 | 이름 | HEX | 사용처 |
|------|------|-----|--------|
| 배경 | 크림 | `#F8F9FA` | 전체 페이지 배경 |
| 카드 배경 | 흰색 | `#FFFFFF` | 카드, 모달 |
| 텍스트 | 차콜 | `#2D3436` | 본문 텍스트 |
| 보조 텍스트 | 그레이 | `#636E72` | 설명, 날짜 |
| 구분선 | 연그레이 | `#DFE6E9` | 섹션 구분 |

### 과목 구분 컬러

| 과목 | HEX | 아이콘 |
|------|-----|--------|
| 수학 | `#74B9FF` (하늘) | 🔢 |
| 영어 | `#FDA7DF` (분홍) | 🔤 |

### CSS 변수

```css
:root {
  /* 메인 */
  --color-primary: #2EC4B6;
  --color-primary-light: #A8E6CF;
  --color-primary-dark: #1B9E8F;

  /* 피드백 */
  --color-correct: #4CAF50;
  --color-wrong: #FF6B6B;
  --color-hint: #FFD93D;
  --color-reward: #FFB800;

  /* 배경 & 중립 */
  --color-bg: #F8F9FA;
  --color-card: #FFFFFF;
  --color-text: #2D3436;
  --color-text-sub: #636E72;
  --color-border: #DFE6E9;

  /* 과목 */
  --color-math: #74B9FF;
  --color-english: #FDA7DF;
}
```

---

## 폰트

### 추천 조합

| 용도 | 폰트 | 이유 |
|------|------|------|
| 한글 본문 | **Pretendard** | 깔끔하고 가독성 좋음, 무료 |
| 숫자/영문 | **Nunito** | 둥글둥글하고 친근한 느낌, 무료 |
| 이모지 대체 | 시스템 이모지 | 별도 아이콘 라이브러리 불필요 |

### Google Fonts 임포트

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
```

Pretendard는 CDN 사용:
```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
```

> **오프라인 대응**: 빌드 시 폰트 파일을 `public/fonts/`에 포함시켜서 인터넷 없이도 작동하게 한다.

### 폰트 크기

| 요소 | 크기 | 굵기 | 사용처 |
|------|------|------|--------|
| 제목 (h1) | 32px | 800 (ExtraBold) | 페이지 타이틀 |
| 부제목 (h2) | 24px | 700 (Bold) | 섹션 헤딩 |
| 문제 텍스트 | 28px | 700 (Bold) | 퀴즈 문제 |
| 선택지 | 22px | 600 (SemiBold) | 퀴즈 버튼 |
| 본문 | 18px | 400 (Regular) | 설명, 안내 |
| 캡션 | 14px | 400 (Regular) | 날짜, 보조 정보 |

```css
:root {
  --font-primary: 'Pretendard', 'Nunito', sans-serif;

  --text-h1: 32px;
  --text-h2: 24px;
  --text-question: 28px;
  --text-choice: 22px;
  --text-body: 18px;
  --text-caption: 14px;
}
```

---

## 간격 & 레이아웃

### 간격 단위 (8px 기반)

| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `--space-xs` | 4px | 아이콘 간격 |
| `--space-sm` | 8px | 텍스트 사이 |
| `--space-md` | 16px | 요소 간격 |
| `--space-lg` | 24px | 섹션 간격 |
| `--space-xl` | 32px | 페이지 패딩 |
| `--space-2xl` | 48px | 큰 섹션 분리 |

### 페이지 레이아웃

```
최대 너비: 480px (모바일 우선, 노트북에서도 중앙 정렬)
좌우 패딩: 24px
```

- 480px로 제한하면 노트북 화면에서도 중앙에 모바일앱처럼 보임
- 아이가 큰 화면에서 시선이 분산되지 않게

### 카드 스타일

```css
.card {
  background: var(--color-card);
  border-radius: 16px;
  padding: var(--space-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

---

## 버튼

### 크기

| 타입 | 높이 | 폰트 | 사용처 |
|------|------|------|--------|
| 대형 (선택지) | 64px | 22px SemiBold | 퀴즈 선택지 |
| 중형 (액션) | 52px | 18px SemiBold | 시작, 다음, 홈으로 |
| 소형 (보조) | 40px | 16px Regular | 더보기, 취소 |

### 스타일

```css
.btnPrimary {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

.btnPrimary:hover {
  background: var(--color-primary-dark);
}

.btnPrimary:active {
  transform: scale(0.96);
}
```

- 모든 버튼에 `border-radius: 12px` (둥글둥글)
- 누를 때 살짝 줄어드는 효과 (`scale(0.96)`) → 터치감
- 선택지 버튼 간격: 12px

### 퀴즈 선택지 버튼 상태

| 상태 | 배경 | 테두리 | 효과 |
|------|------|--------|------|
| 기본 | 흰색 | 2px `--color-border` | — |
| 호버 | 연민트 | 2px `--color-primary` | — |
| 정답 | 초록 | 없음 | 🎉 바운스 |
| 오답 | 코랄 | 없음 | 흔들림 |
| 비활성 | 연그레이 | 없음 | opacity 0.5 |

---

## 애니메이션

### 기본 원칙

- 빠르고 가벼운 애니메이션 (200~400ms)
- 과하지 않게 — 학습 흐름을 방해하지 않는 수준
- 정답/오답/레벨업 등 핵심 순간에만 사용

### 정의할 애니메이션

| 이름 | 용도 | 지속시간 |
|------|------|----------|
| `bounce` | 정답 시 버튼 바운스 | 300ms |
| `shake` | 오답 시 버튼 흔들림 | 400ms |
| `fadeIn` | 페이지/카드 등장 | 200ms |
| `slideUp` | 결과 화면 올라옴 | 300ms |
| `confetti` | 레벨업/만점 축하 | 2000ms |
| `pulse` | XP 바 증가 | 500ms |

```css
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
```

---

## 힌트 말풍선

```css
.hintBubble {
  background: var(--color-hint);
  color: var(--color-text);
  border-radius: 16px;
  padding: 12px 20px;
  font-size: var(--text-body);
  position: relative;
  animation: fadeIn 0.2s ease;
}

/* 말풍선 꼬리 */
.hintBubble::after {
  content: '';
  position: absolute;
  top: -8px;
  left: 24px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--color-hint);
}
```

---

## XP 진행 바

```
████████░░░░ 520/800 XP

채워진 부분: var(--color-primary)
빈 부분: var(--color-border)
높이: 12px
border-radius: 6px
```

- XP 증가 시 부드러운 애니메이션 (transition: width 0.5s)
- 80% 이상 차면 색상 변화 (골드로) → "거의 다 왔어!" 느낌

---

## 반응형 기준

| 환경 | 너비 | 대응 |
|------|------|------|
| 노트북 (주 사용) | 1024px+ | 480px 중앙 정렬 |
| 태블릿 | 768px | 480px 중앙 정렬 |
| 모바일 (혹시) | ~480px | 풀 너비, 패딩 16px |

```css
@media (max-width: 480px) {
  :root {
    --space-xl: 16px;
    --text-h1: 28px;
    --text-question: 24px;
  }
}
```

---

## 아이콘 & 이미지

- 이모지 우선 사용 (추가 라이브러리 불필요)
- 필요 시 SVG 아이콘 직접 제작
- 외부 이미지 CDN 사용 금지 (오프라인 대응)
- 이미지 필요 시 `public/images/`에 포함
