# 🧬 학습 유형 진단 (32-Type Mentee Quiz)

멘토와 멘티를 위한 32가지 학습 유형 진단 웹앱입니다.  
Vercel + Notion API로 배포하고 데이터를 수집합니다.

## 🚀 빠른 시작

### 1단계: Notion 설정

#### 1-1. Notion Integration 만들기
1. [Notion Integrations](https://www.notion.so/my-integrations) 접속
2. **+ New integration** 클릭
3. 이름: `Quiz Data Collector`
4. Type: **Internal** 선택
5. **Submit** 클릭
6. **Internal Integration Secret** 복사 → 이것이 `NOTION_API_KEY`

#### 1-2. Notion Database 만들기
1. Notion에서 새 페이지 생성
2. `/database` 입력 → **Full page database** 선택
3. 아래 속성들 추가:

| 속성 이름 | 타입 | 설명 |
|----------|------|------|
| Session ID | Title (제목) | 자동 생성됨 |
| Quiz Type | Select | 옵션: `멘토용`, `멘티용` |
| Type Code | Text | 예: TFIAD |
| Type Title | Text | 예: 심층 연구자 |
| Score L (T↔P) | Number | -3 ~ +3 |
| Score S (F↔S) | Number | -3 ~ +3 |
| Score M (I↔E) | Number | -3 ~ +3 |
| Score R (A↔C) | Number | -3 ~ +3 |
| Score G (D↔W) | Number | -3 ~ +3 |
| Answers | Text | 각 질문별 답변 |
| Duration (sec) | Number | 소요 시간 |
| Completed At | Date | 완료 일시 |

#### 1-3. Database에 Integration 연결
1. Database 페이지 오른쪽 상단 **⋯** 클릭
2. **Connections** 또는 **Add connections** 클릭
3. 방금 만든 `Quiz Data Collector` 선택

#### 1-4. Database ID 찾기
1. Database 페이지 URL 확인:
   ```
   https://www.notion.so/yourworkspace/1234567890abcdef1234567890abcdef?v=...
   ```
2. `yourworkspace/` 뒤의 32자리 문자열이 `NOTION_DATABASE_ID`
   ```
   1234567890abcdef1234567890abcdef
   ```

---

### 2단계: Vercel 배포

#### 2-1. GitHub에 코드 업로드
```bash
# 이 폴더를 GitHub repo로 푸시
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mentee-quiz.git
git push -u origin main
```

#### 2-2. Vercel에서 배포
1. [Vercel](https://vercel.com) 접속 → GitHub 로그인
2. **Add New Project** → 방금 만든 repo 선택
3. **Framework Preset**: Next.js (자동 감지됨)
4. **Environment Variables** 추가:
   - `NOTION_API_KEY` = `secret_xxxx...`
   - `NOTION_DATABASE_ID` = `1234567890abcdef...`
5. **Deploy** 클릭

#### 2-3. 완료!
배포된 URL (예: `https://mentee-quiz.vercel.app`)에서 바로 사용 가능합니다.

---

## 📊 데이터 확인

Notion Database에서 수집된 데이터를 확인할 수 있습니다:

- **Session ID**: 익명 사용자 식별 (UUID)
- **Quiz Type**: 멘토용 / 멘티용
- **Type Code & Title**: 진단 결과 (예: TFIAD - 심층 연구자)
- **Scores**: 각 차원별 점수 (-3 ~ +3)
- **Answers**: 각 질문별 응답 (예: Q1(L): -1, Q2(L): 0, ...)
- **Duration**: 소요 시간 (초)
- **Completed At**: 완료 일시

### 점수 해석
- **음수(-3 ~ -1)**: 왼쪽 성향 (T, F, I, A, D)
- **0**: 중간 / 상황에 따라 다름
- **양수(+1 ~ +3)**: 오른쪽 성향 (P, S, E, C, W)

---

## 🛠 로컬 개발

```bash
# 의존성 설치
npm install

# .env.local 파일 생성
cp .env.example .env.local
# 그리고 NOTION_API_KEY, NOTION_DATABASE_ID 입력

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

---

## 📁 프로젝트 구조

```
mentee-quiz-app/
├── app/
│   ├── api/submit/route.ts   # Notion API 연동
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # 메인 페이지 (역할 선택)
├── components/
│   └── Quiz.tsx              # 퀴즈 컴포넌트 (3단계 선택지)
├── lib/
│   └── notion.ts             # Notion API 헬퍼
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.example
└── README.md
```

---

## ✨ 주요 기능

### 3단계 선택지
기존 2개 선택지 대신 3개 선택지로 더 정밀한 진단:
- **왼쪽 (-1점)**: 확실히 이 성향
- **중간 (0점)**: 상황에 따라 다름 / 둘 다 해당
- **오른쪽 (+1점)**: 확실히 이 성향

### 상황 기반 질문
"이론 vs 실전" 같은 추상적 질문 대신:
> "새로운 프레임워크를 배울 때, 첫 1시간을 어떻게 사용하나요?"
>
> - 공식 문서의 개념과 구조 파악
> - 상황에 따라 다름
> - 튜토리얼 따라 바로 코드 작성

### 멘토용 / 멘티용 분리
- **멘티용**: 나의 학습 스타일, 멘토 선택 가이드
- **멘토용**: 멘티 유형별 지도 전략, 위기 대응법

---

## 📝 라이선스

MIT License
