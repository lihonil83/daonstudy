# ARCHITECTURE.md

## 프로젝트 개요

초등학교 2학년 아들 1명을 위한 영어/수학 교육 웹 애플리케이션.
배포 없이 로컬 브라우저에서만 실행한다.

---

## 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | React 18 | 컴포넌트 기반으로 퀴즈/점수/게임 상태관리 용이 |
| 빌드 도구 | Vite | 설정 최소, 빌드 빠름, 정적 파일 출력 |
| 언어 | JavaScript (ES6+) | 1인 프로젝트에 TS 오버헤드 불필요 |
| 스타일링 | CSS Modules | 컴포넌트별 스타일 격리, 별도 라이브러리 불필요 |
| 데이터 저장 | localStorage | 서버 없이 브라우저에 직접 저장 |
| 라우팅 | React Router v6 (HashRouter) | 정적 파일(index.html) 기반 로컬 실행 지원 |

---

## 실행 환경

```
개발: macOS → npm run dev (Vite 개발 서버)
배포: npm run build → /dist 폴더 생성 → Windows 노트북에 복사
실행: Windows에서 dist/index.html을 브라우저로 열기
```

> **주의**: Vite 빌드 시 `base: './'` 설정 필요 (상대경로로 로컬 파일 실행 가능하게)

---

## 폴더 구조

```
src/
├── components/          # 공통 UI 컴포넌트
│   ├── Layout/          #   전체 레이아웃, 네비게이션
│   ├── Quiz/            #   퀴즈 카드, 선택지, 타이머
│   └── Reward/          #   레벨업 알림, 보상 애니메이션
├── pages/               # 라우트별 페이지
│   ├── Home/            #   메인 대시보드
│   ├── Math/            #   수학 퀴즈 페이지
│   ├── English/         #   영어 퀴즈 페이지
│   ├── Review/          #   오답 복습 페이지
│   └── Progress/        #   진도/점수 확인 페이지
├── data/                # 문제 데이터 (JSON)
│   ├── math/            #   수학 문제 뱅크
│   └── english/         #   영어 문제 뱅크
├── hooks/               # 커스텀 훅
│   ├── useQuiz.js       #   퀴즈 진행 로직
│   ├── useProgress.js   #   진도/점수 관리
│   ├── useReward.js     #   보상/레벨 시스템
│   └── useWrongAnswers.js #   오답 저장/복습 관리
├── utils/               # 유틸리티
│   ├── storage.js       #   localStorage 래퍼 함수
│   └── shuffle.js       #   문제 셔플 등 헬퍼
├── App.jsx
├── App.module.css
└── main.jsx
```

---

## 핵심 데이터 모델 (localStorage)

### 키 설계

```
eduapp_progress    → 과목별 진도 데이터
eduapp_scores      → 퀴즈 점수 히스토리
eduapp_wrong       → 오답 노트
eduapp_reward      → 레벨/경험치/보상 상태
```

### 데이터 형태 (예시)

```json
// eduapp_progress
{
  "math": {
    "units": {
      "multiplication-2": { "bestScore": 10, "bestStars": 3, "attempts": 5, "firstClear": "2026-03-25" }
    }
  },
  "english": {
    "units": {
      "alphabet-upper": { "bestScore": 9, "bestStars": 2, "attempts": 3, "firstClear": "2026-03-26" }
    }
  }
}
// 상세 구조: docs/product-specs/progress-tracker.md 참조

// eduapp_scores
[
  { "id": "score-20260328-001", "date": "2026-03-28", "subject": "math", "unit": "multiplication-3", "unitTitle": "구구단 3단", "score": 8, "total": 10, "stars": 2, "xpEarned": 85, "duration": 180 }
]
// 상세 구조: docs/product-specs/progress-tracker.md 참조

// eduapp_wrong
[
  { "id": "wrong-20260328-001", "originalQuestionId": "mul3-005", "subject": "math", "unit": "multiplication-3", "unitTitle": "구구단 3단", "question": "3 × 5 = ?", "choices": [12, 15, 18, 20], "userAnswer": 12, "correctAnswer": 15, "hints": ["3을 5번 더해봐!", "3 + 3 + 3 + 3 + 3 = ?"], "date": "2026-03-28", "reviewed": false, "reviewedDate": null, "reviewCorrect": null }
]
// 상세 구조: docs/product-specs/wrong-answer-review.md 참조

// eduapp_reward
{
  "level": 4,
  "title": "똑똑한 학습자",
  "icon": "⭐",
  "totalXp": 520,
  "xpForCurrentLevel": 500,
  "xpForNextLevel": 800,
  "badges": [
    { "id": "first-quiz", "name": "첫 걸음", "icon": "👶", "earnedDate": "2026-03-25", "hidden": false }
  ]
}
// 상세 구조: docs/product-specs/gamification.md 참조
```

---

## 핵심 흐름

```
[홈 대시보드] → 과목 선택 → [퀴즈 페이지]
                                  ↓
                           문제 풀기 (data/ JSON에서 로드)
                                  ↓
                           정답 → XP 획득 → 레벨업 체크
                           오답 → 오답노트 저장
                                  ↓
                           퀴즈 완료 → 점수 저장 → 결과 화면
                                  ↓
                    [오답 복습] ← 틀린 문제만 다시 풀기
```

---

## 설계 원칙

1. **오프라인 퍼스트**: 서버 의존 없음. 모든 데이터는 브라우저 내 저장.
2. **단순함 우선**: 라이브러리 최소화. React + React Router만.
3. **아이 친화적 UI**: 큰 버튼, 밝은 색상, 즉각적 피드백(애니메이션/사운드).
4. **데이터는 JSON**: 문제 추가/수정이 코드 변경 없이 JSON 파일 편집으로 가능.
5. **점진적 확장**: MVP는 수학 구구단 + 영어 알파벳부터. 단원을 JSON으로 추가.

---

## 크로스 플랫폼 주의사항

| 항목 | 대응 |
|------|------|
| 경로 구분자 | Vite `base: './'`로 상대경로 사용 |
| 폰트 | 웹 폰트(Google Fonts) 사용 → 오프라인 시 폰트 파일 포함 |
| 사운드 | mp3/wav를 `public/` 폴더에 포함 |
| localStorage | 브라우저 의존 → 같은 브라우저에서만 데이터 유지 |

---

## 향후 확장 가능성 (MVP 이후)

- 문제 자동 생성 (난이도 조절 알고리즘)
- 학습 통계 차트 (recharts 등)
- 음성 출력 (Web Speech API로 영어 발음)
- PWA 전환 (오프라인 캐싱 강화)
