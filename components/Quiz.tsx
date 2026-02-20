'use client';

import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface QuizProps {
  role: 'mentor' | 'mentee';
  menteeName?: string;
  onBack: () => void;
}

interface Question {
  id: number;
  dim: number;
  text: string;
  context?: string;
  leftLabel: string;
  rightLabel: string;
  leftDesc?: string;
  rightDesc?: string;
}

interface Answer {
  questionId: number;
  dimension: string;
  choice: -1 | 0 | 1;
}

interface TypeInfo {
  emoji: string;
  title: string;
  desc: string;
  strengths: string[];
  weaknesses: string[];
  studyStyle: string;
  bestMethods: string[];
  avoidMethods: string[];
  slumpSign: string;
  slumpRecovery: string;
  idealMentor: string;
  mentorRequest: string;
  growthPath: string;
  resources: string[];
  weeklyRoutine: string;
  mentoringStyle: string;
  sessionFormat: string;
  doList: string[];
  dontList: string[];
  crisisSignal: string;
  recoveryStrategy: string;
  thisWeekActions: string[];
  thirtyDayChallenge: string;
  dailyHabit: string;
  recommendedBooks: string[];
  communityTip: string;
}

const DIMENSIONS = [
  { id: 'L', name: '학습방식', left: '이론 (T)', right: '실전 (P)', colors: ['#6366f1', '#f59e0b'] },
  { id: 'S', name: '진행속도', left: '신속 (F)', right: '정밀 (S)', colors: ['#ef4444', '#10b981'] },
  { id: 'M', name: '동기부여', left: '내적 (I)', right: '외적 (E)', colors: ['#8b5cf6', '#ec4899'] },
  { id: 'R', name: '문제해결', left: '독립 (A)', right: '협력 (C)', colors: ['#0ea5e9', '#f97316'] },
  { id: 'G', name: '성장방향', left: '깊이 (D)', right: '넓이 (W)', colors: ['#14b8a6', '#e11d48'] },
];

const QUESTIONS: Question[] = [
  { id: 1, dim: 0, text: '새로운 프레임워크를 배울 때, 첫 1시간을 어떻게 사용하나요?', leftLabel: '공식 문서의 개념과 구조 파악', rightLabel: '튜토리얼 따라 바로 코드 작성' },
  { id: 2, dim: 0, text: '버그가 발생했을 때, 해결 접근 방식은?', leftLabel: '에러 메시지와 스택 트레이스 분석', rightLabel: '여러 해결책을 빠르게 시도' },
  { id: 3, dim: 0, text: '기술 면접 준비 방식으로 더 가까운 것은?', leftLabel: 'CS 기초 개념을 체계적으로 정리', rightLabel: '실제 코딩 테스트 문제 풀기' },
  { id: 4, dim: 1, text: '프로젝트의 첫 번째 버전을 만들 때...', leftLabel: '핵심 기능만 빠르게 MVP 완성', rightLabel: '설계와 구조를 충분히 고민 후 시작' },
  { id: 5, dim: 1, text: '학습 진도에 대한 나의 스타일은?', leftLabel: '80% 이해하면 다음으로 진행', rightLabel: '100% 확실해야 넘어감' },
  { id: 6, dim: 1, text: '코드 리뷰에서 "이 정도면 됐다"의 기준은?', leftLabel: '기능이 정상 동작하면 OK', rightLabel: '코드 품질까지 완벽해야 OK' },
  { id: 7, dim: 2, text: '늦은 밤까지 코딩하게 만드는 원동력은?', leftLabel: '문제 해결의 짜릿함, 만드는 재미', rightLabel: '데드라인, 성과 목표, 인정' },
  { id: 8, dim: 2, text: '사이드 프로젝트를 완성까지 이끄는 것은?', leftLabel: '만들고 싶은 것에 대한 순수한 호기심', rightLabel: '포트폴리오, 수익화, 사용자 반응' },
  { id: 9, dim: 2, text: '학습 중 지칠 때 에너지를 회복하는 방법은?', leftLabel: '재미있는 토이 프로젝트로 기분 전환', rightLabel: '완료한 것들 정리하며 성취감 느끼기' },
  { id: 10, dim: 3, text: '막히는 문제를 만났을 때 첫 30분의 행동은?', leftLabel: '혼자서 검색하고 문서를 파헤침', rightLabel: '동료나 커뮤니티에 바로 질문' },
  { id: 11, dim: 3, text: '가장 효과적인 학습 환경은?', leftLabel: '혼자 조용히 집중하는 시간', rightLabel: '함께 토론하고 피드백 주고받는 시간' },
  { id: 12, dim: 3, text: '코드 리뷰에 대한 선호도는?', leftLabel: '비동기로 코멘트 주고받기', rightLabel: '실시간으로 함께 보며 토론' },
  { id: 13, dim: 4, text: '1년 후 나의 모습으로 더 원하는 것은?', leftLabel: '한 분야에서 깊은 전문성 보유', rightLabel: '다양한 기술을 넓게 다룰 수 있음' },
  { id: 14, dim: 4, text: '새로운 기술 트렌드가 등장했을 때...', leftLabel: '기존 기술을 더 깊이 파는 게 우선', rightLabel: '새로운 것을 빨리 배워보고 싶다' },
  { id: 15, dim: 4, text: '이상적인 시니어 개발자의 모습은?', leftLabel: '특정 도메인의 압도적 전문가', rightLabel: '풀스택으로 뭐든 만들 수 있는 사람' },
];

const C = {
  bg: '#0a0a16', card: '#111127', cardBorder: '#1c1c3a',
  accent: '#6366f1', accent2: '#ec4899', accent3: '#10b981',
  text: '#e0e0f0', textDim: '#8888aa', textMute: '#555566', dark: '#0d0d1a',
};

function getTypeCode(scores: number[]): string {
  let code = '';
  code += scores[0] <= 0 ? 'T' : 'P';
  code += scores[1] <= 0 ? 'F' : 'S';
  code += scores[2] <= 0 ? 'I' : 'E';
  code += scores[3] <= 0 ? 'A' : 'C';
  code += scores[4] <= 0 ? 'D' : 'W';
  return code;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ width: '100%', height: 6, background: C.dark, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${(current / total) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, borderRadius: 3, transition: 'width 0.5s' }} />
    </div>
  );
}

function ThreeChoiceSelector({ leftLabel, rightLabel, value, onChange, disabled }: {
  leftLabel: string; rightLabel: string; value: -1 | 0 | 1 | null; onChange: (v: -1 | 0 | 1) => void; disabled: boolean;
}) {
  const choices: { value: -1 | 0 | 1; label: string }[] = [
    { value: -1, label: leftLabel },
    { value: 0, label: '상황에 따라 다름' },
    { value: 1, label: rightLabel },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {choices.map((choice, idx) => {
        const isSelected = value === choice.value;
        const isMiddle = choice.value === 0;
        return (
          <button key={idx} onClick={() => !disabled && onChange(choice.value)} disabled={disabled}
            style={{ padding: isMiddle ? '14px 20px' : '18px 20px', fontSize: isMiddle ? 13 : 14, fontWeight: 500, color: isSelected ? '#fff' : isMiddle ? C.textMute : C.textDim, background: isSelected ? (isMiddle ? '#2a2a4a' : `linear-gradient(135deg, ${C.accent}, #7c3aed)`) : (isMiddle ? '#0d0d1a' : C.dark), border: `1.5px solid ${isSelected ? (isMiddle ? '#4a4a6a' : C.accent) : (isMiddle ? '#1a1a35' : '#2a2a4a')}`, borderRadius: 14, cursor: disabled ? 'default' : 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.25s ease', opacity: disabled ? 0.6 : 1 }}>
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}

function RadarChart({ scores }: { scores: number[] }) {
  const size = 240, center = size / 2, maxR = 90;
  const labels = ['학습방식', '진행속도', '동기부여', '문제해결', '성장방향'];
  const angles = labels.map((_, i) => (Math.PI * 2 * i) / 5 - Math.PI / 2);
  const normalized = scores.map(s => Math.max(0.15, (s + 3) / 6));
  const points = normalized.map((s, i) => ({ x: center + Math.cos(angles[i]) * maxR * s, y: center + Math.sin(angles[i]) * maxR * s }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.33, 0.66, 1].map((level, li) => (<polygon key={li} points={angles.map(a => `${center + Math.cos(a) * maxR * level},${center + Math.sin(a) * maxR * level}`).join(' ')} fill="none" stroke="#1e1e3e" strokeWidth={1} />))}
      {angles.map((a, i) => (<g key={i}><line x1={center} y1={center} x2={center + Math.cos(a) * maxR} y2={center + Math.sin(a) * maxR} stroke="#1e1e3e" strokeWidth={1} /><text x={center + Math.cos(a) * (maxR + 22)} y={center + Math.sin(a) * (maxR + 22)} textAnchor="middle" dominantBaseline="middle" fill={C.textDim} fontSize={10}>{labels[i]}</text></g>))}
      <path d={pathD} fill="rgba(99,102,241,0.18)" stroke={C.accent} strokeWidth={2.5} />
      {points.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r={4.5} fill={C.accent} stroke="#fff" strokeWidth={1.5} />))}
    </svg>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: C.card, borderRadius: 20, padding: '24px 20px', border: `1px solid ${C.cardBorder}`, marginBottom: 16, ...style }}>{children}</div>;
}

function SectionTitle({ icon, color, children }: { icon: string; color: string; children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, color, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}><span>{icon}</span>{children}</h3>;
}

function Tag({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return <span style={{ display: 'inline-block', padding: '5px 12px', margin: '3px 4px 3px 0', background: `${color}18`, color, borderRadius: 8, fontSize: 12, fontWeight: 500 }}>{children}</span>;
}

function ListItem({ children, icon = '→', color = C.accent }: { children: React.ReactNode; icon?: string; color?: string }) {
  return <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: C.textDim, lineHeight: 1.7 }}><span style={{ color, flexShrink: 0 }}>{icon}</span><span>{children}</span></div>;
}

function ShareButtons({ typeCode, typeTitle, emoji }: { typeCode: string; typeTitle: string; emoji: string }) {
  const [copied, setCopied] = useState(false);
  const shareText = `나의 학습 유형은 ${emoji} ${typeCode} - ${typeTitle}!\n32가지 유형으로 알아보는 학습 DNA 🧬`;
  const copyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    await navigator.clipboard.writeText(`${shareText}\n\n진단 받기: ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareTwitter = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
      <button onClick={copyLink} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: copied ? '#fff' : C.accent, background: copied ? C.accent3 : `${C.accent}15`, border: `1px solid ${copied ? C.accent3 : C.accent}40`, borderRadius: 10, cursor: 'pointer' }}>
        {copied ? '✓ 복사됨!' : '🔗 링크 복사'}
      </button>
      <button onClick={shareTwitter} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#1DA1F2', background: '#1DA1F215', border: '1px solid #1DA1F240', borderRadius: 10, cursor: 'pointer' }}>
        𝕏 공유하기
      </button>
    </div>
  );
}


const TYPE_DATA: Record<string, TypeInfo> = {
  "TFIAD": {
    emoji: "🔬", title: "심층 연구자",
    desc: "이론과 원리를 깊이 파고드는 학자형. 혼자서 한 분야를 완벽하게 이해하려 합니다.",
    strengths: ["깊은 기술 이해력", "자기주도 학습", "원리 파악 속도", "꾸준한 내적 동기"],
    weaknesses: ["실전 적용 지연", "완벽주의", "협업 경험 부족", "이론 매몰 위험"],
    studyStyle: "공식 문서, 기술 논문, 깊이 있는 서적을 선호합니다.",
    bestMethods: ["공식 문서 정독", "개념 블로그 정리", "오픈소스 코드 분석"],
    avoidMethods: ["따라하기만 하는 튜토리얼", "이해 없이 복붙"],
    slumpSign: "학습은 하지만 아무것도 만들지 못하는 '분석 마비' 상태",
    slumpRecovery: "아주 작은 실습 프로젝트 시작",
    idealMentor: "해당 분야의 깊은 전문성 + 자율성을 존중하는 멘토",
    mentorRequest: "격주로 깊이 있는 세션, 미리 토론 주제 공유",
    growthPath: "이론 학습 → 기술 블로그 → 오픈소스 기여 → 컨퍼런스 발표",
    resources: ["공식 문서/RFC", "기술 논문", "아키텍처 케이스 스터디"],
    weeklyRoutine: "주 3-4일 혼자 깊이 파기. 주 1일 정리 글쓰기",
    mentoringStyle: "지적 자극을 주는 토론 파트너형 멘토링",
    sessionFormat: "격주 60-90분, 기술 토론 중심",
    doList: ["깊이 있는 질문으로 사고 자극", "자율성 존중", "실습 과제 부여"],
    dontList: ["잦은 체크인", "표면적 진도 압박", "협업 강요"],
    crisisSignal: "이론만 계속하고 결과물이 없을 때",
    recoveryStrategy: "작은 실습 과제 부여",
    thisWeekActions: ["배우는 개념을 코드 20줄로 구현", "TIL 블로그 1개 작성", "오픈소스 코드 30분 분석"],
    thirtyDayChallenge: "30일간 매일 '오늘 배운 개념 → 미니 코드'로 실습 일지 작성",
    dailyHabit: "학습 마무리 전 5분간 '오늘 배운 것을 한 문장으로' 정리",
    recommendedBooks: ["Clean Code", "도메인 주도 설계", "Designing Data-Intensive Apps"],
    communityTip: "기술 블로그에 학습 내용을 정리하면 면접에서 큰 자산이 됩니다!",
  },
  "TFIAW": {
    emoji: "📚", title: "이론 탐험가",
    desc: "다양한 분야의 이론을 섭렵하는 지식 수집가. 호기심이 넓고 새로운 개념을 빠르게 흡수합니다.",
    strengths: ["폭넓은 기술 이해", "자기주도 학습", "빠른 개념 흡수", "다양한 관점"],
    weaknesses: ["깊이 부족", "관심사 자주 변경", "실전 경험 부족"],
    studyStyle: "다양한 분야의 입문 자료와 개념서 선호",
    bestMethods: ["다양한 입문 강의", "기술 간 연결점 정리", "T자형 인재 목표"],
    avoidMethods: ["하나만 파라는 압박", "범위 없이 무한 확장"],
    slumpSign: "'전문 분야가 없다'는 불안감",
    slumpRecovery: "가장 관심 간 분야 하나를 3개월간 집중",
    idealMentor: "다양한 경험을 가진 제너럴리스트형 시니어",
    mentorRequest: "다양한 학습 공유 + 주력 분야 정하기",
    growthPath: "폭넓은 탐색 → 핵심 2-3개 선정 → 하나를 주력으로",
    resources: ["기술 뉴스레터", "분야별 입문 강의", "크로스 도메인 사례"],
    weeklyRoutine: "주 2일 주력 분야. 주 2일 탐색. 주 1일 정리",
    mentoringStyle: "관심사를 인정하면서 방향 잡아주는 가이드형",
    sessionFormat: "격주, 다양한 학습 공유 + 주력 분야 논의",
    doList: ["관심사 전환을 긍정적으로", "주력 분야 함께 선정"],
    dontList: ["산만하다고 지적", "한 가지만 강요"],
    crisisSignal: "새로운 것만 시작하고 완성이 없을 때",
    recoveryStrategy: "'이번 달은 이것 하나만' 함께 정하기",
    thisWeekActions: ["관심 분야 TOP 3 선정", "TOP 1로 이번 주 집중", "배운 기술 연결점 마인드맵 정리"],
    thirtyDayChallenge: "30일간 하나의 주력 분야만 파기",
    dailyHabit: "새 기술 발견해도 '북마크만', 지금 것 먼저",
    recommendedBooks: ["T자형 인재", "소프트 스킬", "개발자의 글쓰기"],
    communityTip: "넓은 지식은 장점이에요. 하지만 면접에서는 '깊이'도 필요해요.",
  },
  "TFICD": {
    emoji: "🧪", title: "학술 토론가",
    desc: "이론적 깊이를 추구하면서 동료와의 토론을 통해 성장합니다.",
    strengths: ["이론을 토론으로 내재화", "그룹 학습 리더십", "다양한 관점 수용"],
    weaknesses: ["혼자 집중 시간 부족", "토론에만 시간 과다"],
    studyStyle: "스터디 그룹에서 발표하고 토론하는 것 선호",
    bestMethods: ["스터디 발표자 역할", "배운 내용 가르치기", "기술 토론 커뮤니티"],
    avoidMethods: ["항상 혼자만 학습", "결론 없는 토론 반복"],
    slumpSign: "토론은 활발하지만 코드 산출물이 없을 때",
    slumpRecovery: "'토론 내용을 코드로 구현' 규칙 만들기",
    idealMentor: "토론을 즐기면서 실전 경험도 풍부한 멘토",
    mentorRequest: "토론 형식 세션 + 실습 숙제",
    growthPath: "이론 토론 → 기술 세미나 발표 → 팀 기술 리더",
    resources: ["기술 토론 커뮤니티", "컨퍼런스 발표 영상", "페어 학습 파트너"],
    weeklyRoutine: "주 2회 스터디/토론. 주 2일 개인 실습",
    mentoringStyle: "소크라테스식 질문으로 사고를 이끄는 대화형",
    sessionFormat: "주 1회, 토론 중심 + 실습 숙제 병행",
    doList: ["함께 토론하며 개념 정리", "실습 과제 반드시 병행"],
    dontList: ["일방적 강의", "토론 없이 과제만"],
    crisisSignal: "말로만 알고 코드로 못 쓸 때",
    recoveryStrategy: "세션 마무리에 반드시 코드 과제",
    thisWeekActions: ["배운 개념으로 스터디 발표자료 만들기", "토론 후 코드로 구현", "동료에게 5분 설명하기"],
    thirtyDayChallenge: "30일간 '토론 1회 = 코드 1개' 규칙",
    dailyHabit: "학습 후 '다른 사람에게 어떻게 설명할까?' 생각",
    recommendedBooks: ["함께 자라기", "페어 프로그래밍", "실용주의 프로그래머"],
    communityTip: "스터디 그룹에서 발표자 역할을 자주 맡아보세요!",
  },
  "TFICW": {
    emoji: "🌐", title: "지식 네트워커",
    desc: "넓은 이론적 기반 위에 협업을 통해 지식을 확장합니다.",
    strengths: ["뛰어난 커뮤니케이션", "넓은 기술 시야", "팀 학습 촉진"],
    weaknesses: ["깊이 부족", "소통에 시간 과다"],
    studyStyle: "커뮤니티 활동, 스터디 그룹에서 에너지 얻음",
    bestMethods: ["다양한 커뮤니티 활동", "스터디 그룹 운영", "기술 모임 발표"],
    avoidMethods: ["항상 혼자만 학습", "소통 시간 무조건 줄이기"],
    slumpSign: "소통만 하고 실질적 기술 성장 멈춤",
    slumpRecovery: "일주일에 하루는 '혼자 깊이 파는 날'",
    idealMentor: "넓은 네트워크 + 깊이도 챙겨주는 멘토",
    mentorRequest: "커뮤니티 활동 공유 + 주력 분야 정하기",
    growthPath: "넓은 탐색 + 소통 → 기술 에반젤리스트 → DevRel",
    resources: ["기술 컨퍼런스", "온라인 커뮤니티", "크로스펑셔널 프로젝트"],
    weeklyRoutine: "주 2회 커뮤니티. 주 2일 혼자 깊이 파기",
    mentoringStyle: "네트워크 인정 + 깊이 보완 균형형",
    sessionFormat: "격주, 활동 공유 + 깊이 보완 과제",
    doList: ["커뮤니티 활동 긍정적으로", "혼자 학습 시간 확보 유도"],
    dontList: ["소통을 시간 낭비로 취급"],
    crisisSignal: "많이 아는 것 같지만 전문 분야 없음",
    recoveryStrategy: "3개월 집중 분야 함께 정하기",
    thisWeekActions: ["기술 밋업 1개 참석", "밋업에서 만난 사람과 연결", "'딥워크 데이' 하루 잡기"],
    thirtyDayChallenge: "30일간 주 2일 '혼자 깊이 파는 날' 지정",
    dailyHabit: "네트워킹 전 '오늘 공유할 것 1가지' 준비",
    recommendedBooks: ["네트워크 이펙트", "개발자 원칙", "커뮤니티 빌딩"],
    communityTip: "DevRel이나 에반젤리스트 역할에 적합해요!",
  },
  "TFEAD": {
    emoji: "🎯", title: "전략적 전문가",
    desc: "명확한 목표를 위해 한 분야를 체계적으로 정복하는 전략가형.",
    strengths: ["명확한 목표 의식", "체계적 학습", "깊은 전문성", "높은 실행력"],
    weaknesses: ["유연성 부족", "번아웃 가능성", "학습 즐거움 상실 위험"],
    studyStyle: "목표 연결 로드맵 선호. 마일스톤 달성에서 동기 얻음",
    bestMethods: ["명확한 마일스톤", "커리어 연결 학습 계획", "전문 자격증 도전"],
    avoidMethods: ["목표 없이 배회", "재미만 추구"],
    slumpSign: "목표만 쫓다 번아웃. 성취해도 공허함",
    slumpRecovery: "일주일간 '목표와 무관하게 재미있는 것' 하기",
    idealMentor: "해당 분야 성공 커리어 + 전략 함께 짤 수 있는 멘토",
    mentorRequest: "역산 로드맵 함께 짜기 + '재미 체크'도",
    growthPath: "목표 설정 → 체계적 학습 → 전문가 인증 → 분야 리더",
    resources: ["분야별 로드맵 가이드", "기술 인증 시험", "업계 리더 인터뷰"],
    weeklyRoutine: "주 4일 로드맵 기반 학습. 주 1일 '재미' 시간",
    mentoringStyle: "목표 기반 전략적 코칭형",
    sessionFormat: "격주, 진척 리뷰 + 다음 마일스톤",
    doList: ["명확한 마일스톤 함께 설정", "번아웃 징후 체크"],
    dontList: ["목표 없이 흘러가기", "재미를 완전 무시"],
    crisisSignal: "번아웃 징후, 성취해도 공허함",
    recoveryStrategy: "목표 외 '재미있는 것' 권유",
    thisWeekActions: ["3개월 후 목표 구체적으로 적기", "이번 주 마일스톤 3개 설정", "금요일은 '재미있는 코딩' 시간"],
    thirtyDayChallenge: "30일 로드맵 작성 + 매주 금요일 '재미 데이'",
    dailyHabit: "하루 끝에 '목표 달성률' + '재미있었던 것' 기록",
    recommendedBooks: ["이펙티브 엔지니어", "커리어 스킬", "딥 워크"],
    communityTip: "목표 지향은 강점이지만 번아웃 주의! 쉬어가세요.",
  },
  "TFEAW": {
    emoji: "📋", title: "체계적 커리어 빌더",
    desc: "취업/이직을 위해 다양한 기술을 전략적으로 학습합니다.",
    strengths: ["전략적 학습", "시장 트렌드 민감성", "다양한 기술 스택"],
    weaknesses: ["깊이보다 범위", "트렌드에 휘둘림"],
    studyStyle: "채용 공고 분석, 필요 기술 전략적 학습",
    bestMethods: ["채용 시장 분석 기반 학습", "포트폴리오 프로젝트 중심"],
    avoidMethods: ["스펙만 쌓고 실력 제자리", "깊이 없이 넓히기만"],
    slumpSign: "스펙은 쌓이는데 면접 깊이 질문에 막힘",
    slumpRecovery: "포트폴리오 하나 정말 깊이 완성",
    idealMentor: "채용/현업 경험 풍부한 멘토",
    mentorRequest: "포트폴리오 리뷰 + 기술 면접 연습",
    growthPath: "시장 분석 → 핵심 기술 습득 → 포트폴리오 → 취업",
    resources: ["채용 공고 트렌드", "포트폴리오 레퍼런스", "면접 문제집"],
    weeklyRoutine: "주 3일 핵심 기술. 주 2일 포트폴리오. 주 1일 면접 준비",
    mentoringStyle: "실용적 조언과 전략적 방향 제시형",
    sessionFormat: "격주, 포트폴리오 리뷰 + 면접 연습",
    doList: ["실제 채용 시장 기반 조언", "포트폴리오 피드백"],
    dontList: ["시장 가치 무시", "취업 후 성장 무시"],
    crisisSignal: "스펙만 쌓고 실력 정체",
    recoveryStrategy: "깊이 있는 프로젝트 하나 함께 완성",
    thisWeekActions: ["원하는 회사 채용 공고 3개 분석", "공통 요구 기술 TOP 3 정리", "부족한 기술 1개 집중 학습"],
    thirtyDayChallenge: "30일간 포트폴리오 프로젝트 1개 완성",
    dailyHabit: "매일 10분 기술 면접 질문 1개 답변 연습",
    recommendedBooks: ["코딩 인터뷰 완전 분석", "개발자로 살아남기", "프로그래머의 길"],
    communityTip: "GitHub 잔디보다 프로젝트 README가 더 중요해요!",
  },
  "TFECD": {
    emoji: "🏛️", title: "조직 내 전문가",
    desc: "팀 환경에서 한 분야의 기술적 권위자가 되길 원합니다.",
    strengths: ["팀 내 기술 리더십", "지식 공유 능력", "조직 영향력"],
    weaknesses: ["조직 의존도 높음", "인정욕구에 좌우"],
    studyStyle: "팀 필요 기술 깊이 파고 공유. 인정받으면 더 열심히 함",
    bestMethods: ["팀 내 기술 발표", "사내 기술 블로그", "go-to person 되기"],
    avoidMethods: ["팀 맥락과 무관한 학습만", "인정에 너무 의존"],
    slumpSign: "조직 인정 없으면 동기 급락",
    slumpRecovery: "조직 밖 개인 자산 만들기. 개인 블로그, 외부 발표",
    idealMentor: "조직 기술 리더 경험 + 소프트 스킬 코칭",
    mentorRequest: "팀 내 전문성 전략 + 개인 브랜딩",
    growthPath: "팀 내 학습 → 기술 발표 → 전문 영역 확립 → 테크 리드",
    resources: ["사내 기술 세미나", "리더십 서적", "기술 발표 스킬"],
    weeklyRoutine: "주 3일 전문 분야 심화. 주 1일 팀 공유. 주 1일 개인 브랜딩",
    mentoringStyle: "조직 내 성장과 개인 브랜딩 균형형",
    sessionFormat: "격주, 팀 내 성장 + 외부 활동 균형",
    doList: ["팀 내 성과 인정", "개인 브랜딩 권장"],
    dontList: ["조직만 강조", "외부 활동 무시"],
    crisisSignal: "조직 변화 시 극심한 불안",
    recoveryStrategy: "개인 브랜딩 활동 시작 도움",
    thisWeekActions: ["'go-to person' 될 분야 1개 선정", "팀 내 기술 공유 1회", "개인 블로그 첫 글 작성"],
    thirtyDayChallenge: "30일간 '팀 내 전문가 되기' + '개인 블로그 4개 글'",
    dailyHabit: "퇴근 전 '오늘 팀에 기여한 것 1개' 기록",
    recommendedBooks: ["테크 리드", "팀 플레이어", "개발자에서 아키텍트로"],
    communityTip: "사내에서만 인정받는 것은 위험해요. 외부에서도 '나'를 알리세요!",
  },
  "TFECW": {
    emoji: "🔗", title: "팀 학습 코디네이터",
    desc: "외적 목표와 협업을 통해 넓은 기술 지식을 쌓아가는 연결자.",
    strengths: ["학습 조직 구축", "다양한 기술 연결", "팀 학습 촉진"],
    weaknesses: ["개인 깊이 부족", "조율에 에너지 과다"],
    studyStyle: "스터디 그룹 운영/참여하면서 배움",
    bestMethods: ["스터디 그룹 운영", "팀 학습 목표 설정", "학습 내용 팀 공유"],
    avoidMethods: ["항상 혼자만 학습", "다른 사람만 도와주기"],
    slumpSign: "다른 사람만 도와주고 자기 성장 멈춤",
    slumpRecovery: "'나만의 학습 시간' 확보",
    idealMentor: "팀 리딩 경험 풍부 + 개인 성장 챙겨주는 멘토",
    mentorRequest: "스터디 운영 노하우 + 나의 주력 분야 정하기",
    growthPath: "팀 학습 조율 → 프로젝트 매니징 → 기술 팀 리더",
    resources: ["팀 빌딩 자료", "프로젝트 매니지먼트", "다양한 기술 입문"],
    weeklyRoutine: "주 2회 스터디 운영. 주 2일 개인 심화",
    mentoringStyle: "코디네이터 역할 인정 + 개인 성장 균형형",
    sessionFormat: "격주, 스터디 운영 논의 + 개인 과제",
    doList: ["코디네이터 역할 인정", "개인 학습 시간 확보 유도"],
    dontList: ["다른 사람만 도와주게 두기"],
    crisisSignal: "스터디는 잘 돌아가는데 자기 실력 제자리",
    recoveryStrategy: "개인 과제 반드시 병행",
    thisWeekActions: ["스터디에서 '나도 배울 것' 1개 정하기", "이번 주 2시간 '나만의 학습 시간' 확보", "스터디 운영 노하우 정리 공유"],
    thirtyDayChallenge: "30일간 '스터디 운영 + 개인 프로젝트' 병행",
    dailyHabit: "스터디 준비 전 '나도 배울 것 1개' 먼저 정하기",
    recommendedBooks: ["팀장의 탄생", "린 스타트업", "스크럼"],
    communityTip: "스터디 운영 경험은 리더십을 보여주는 좋은 사례예요!",
  },
  "TSIAD": {
    emoji: "💎", title: "장인 개발자",
    desc: "한 분야에서 완벽한 이해를 추구하는 장인형.",
    strengths: ["높은 이해도", "완벽주의적 장인정신", "깊은 기술 이해"],
    weaknesses: ["진도가 매우 느림", "과도한 완벽주의", "번아웃 위험"],
    studyStyle: "하나를 배워도 완벽하게 이해하고 넘어갑니다.",
    bestMethods: ["깊이 있는 학습", "하나를 완전히 이해", "코드 품질 집중"],
    avoidMethods: ["대충 빠르게 넘어가기", "품질 무시"],
    slumpSign: "완벽을 추구하다 아무것도 완성 못함",
    slumpRecovery: "'80% 완성도로 먼저 완료' 원칙",
    idealMentor: "품질 감각 있으면서 실용적 균형 가진 시니어",
    mentorRequest: "깊이 있는 학습 인정 + '완료의 중요성'",
    growthPath: "깊은 학습 → 효율적 완성 학습 → 시니어 → 아키텍트",
    resources: ["깊이 있는 기술 서적", "디자인 패턴 심화", "성능 최적화"],
    weeklyRoutine: "주 3일 깊이 학습. 주 1일 정리. 주 1일 '일단 완성' 연습",
    mentoringStyle: "완벽주의 이해 + 완료 유도 균형형",
    sessionFormat: "격주, 깊이 토론 + 완료 과제",
    doList: ["깊이 있는 학습 인정", "'완료' 중요성 코칭"],
    dontList: ["빨리빨리 압박", "완벽주의를 문제로만"],
    crisisSignal: "영원히 학습만 하고 완성 없음",
    recoveryStrategy: "작은 범위 '일단 완성' 과제",
    thisWeekActions: ["지금 만드는 것 '80% 완성도'로 마무리", "완벽하지 않아도 배포/공유", "개선점 목록 따로 정리"],
    thirtyDayChallenge: "30일간 매주 '작은 것 하나 완성'",
    dailyHabit: "작업 시작 전 '오늘의 완료 기준' 먼저 정하기",
    recommendedBooks: ["리팩터링", "클린 아키텍처", "Docker 완벽 가이드"],
    communityTip: "완벽주의는 양날의 검이에요. '출시하고 개선하기' 연습하세요!",
  },
  "TSIAW": {
    emoji: "🧩", title: "정밀 학습자",
    desc: "다양한 분야를 꼼꼼하게 하나씩 정복해나가는 체계적 학습자.",
    strengths: ["체계적 학습", "꼼꼼한 정리력", "높은 완성도"],
    weaknesses: ["속도가 느림", "우선순위 설정 어려움"],
    studyStyle: "체크리스트와 마일스톤을 좋아합니다.",
    bestMethods: ["단계별 체크리스트", "학습 분야 우선순위", "정리 노트/블로그"],
    avoidMethods: ["한꺼번에 모든 것 학습", "체계 없이 되는대로"],
    slumpSign: "배울 것이 너무 많아 압도감",
    slumpRecovery: "범위를 과감히 줄이기. '지금 필요한 3가지'만",
    idealMentor: "체계적 사고 + 우선순위 판단 뛰어난 멘토",
    mentorRequest: "학습 범위 우선순위 함께 정해주세요",
    growthPath: "체계적 학습 → 분야별 기초 완성 → 주력 분야 선택",
    resources: ["분야별 학습 로드맵", "체계적 온라인 강의", "학습 정리 템플릿"],
    weeklyRoutine: "주 4일 체크리스트 기반 학습. 주 1일 정리",
    mentoringStyle: "체계적 접근 인정 + 우선순위 설정 도움형",
    sessionFormat: "격주, 학습 범위 리뷰 + 우선순위 조정",
    doList: ["체계적 접근 인정", "우선순위 함께 설정"],
    dontList: ["모든 것을 다 하라고"],
    crisisSignal: "압도감으로 진행이 멈춤",
    recoveryStrategy: "과감한 범위 축소 함께 결정",
    thisWeekActions: ["학습 중인 것들 리스트업", "TOP 3만 남기고 나머지는 '나중에'", "TOP 1에 이번 주 70% 투자"],
    thirtyDayChallenge: "30일간 '한 분야 마스터' 집중",
    dailyHabit: "아침에 '오늘의 학습 범위' 3가지만 정하기",
    recommendedBooks: ["울트라러닝", "아주 작은 습관의 힘", "에센셜리즘"],
    communityTip: "Notion으로 학습 기록을 체계화해보세요!",
  },
  "TSICD": {
    emoji: "⚙️", title: "품질 관리자",
    desc: "팀과 함께하면서도 깊이 있는 품질을 추구하는 꼼꼼한 협업자.",
    strengths: ["팀 내 품질 수호자", "꼼꼼한 코드 리뷰", "깊은 이해 기반 소통"],
    weaknesses: ["리뷰에 시간 과다", "타인 코드에 과도한 기준"],
    studyStyle: "코드 리뷰를 하고 받으면서 배웁니다",
    bestMethods: ["적극적 코드 리뷰 참여", "품질 기준 팀과 정의", "근거와 대안 제시"],
    avoidMethods: ["혼자서만 품질 기준 적용", "비판만 하고 대안 없음"],
    slumpSign: "팀원과 코드 품질로 갈등 반복",
    slumpRecovery: "'왜 더 좋은지' 부드럽게 설명하는 연습",
    idealMentor: "기술 품질과 팀 소통 모두 균형 있는 멘토",
    mentorRequest: "코드 리뷰 잘하는 법 + 건설적 피드백",
    growthPath: "품질 관리 → 코드 리뷰 문화 구축 → 팀 기술 표준",
    resources: ["코드 리뷰 베스트 프랙티스", "소통 스킬 서적", "팀 문화 구축"],
    weeklyRoutine: "주 3일 개인 심화. 주 2일 코드 리뷰 참여",
    mentoringStyle: "품질 감각 인정 + 소통 스킬 코칭형",
    sessionFormat: "격주, 품질 + 소통 균형 논의",
    doList: ["품질 감각 인정", "건설적 피드백 방법 코칭"],
    dontList: ["품질 기준을 까다롭다고만"],
    crisisSignal: "팀 내 갈등, 자기 성장 멈춤",
    recoveryStrategy: "소통 방법 개선 + 개인 학습 시간",
    thisWeekActions: ["코드 리뷰 시 '비판 1개당 칭찬 2개'", "리뷰에 '대안'도 함께 제시", "팀 코드 컨벤션 문서화"],
    thirtyDayChallenge: "30일간 '건설적 피드백 연습'",
    dailyHabit: "코드 리뷰 전 '이 피드백이 팀에 도움 되는가?' 자문",
    recommendedBooks: ["Effective Code Review", "비폭력 대화", "팀 토폴로지"],
    communityTip: "'틀렸다'가 아니라 '이렇게 하면 더 좋아요'로 말해보세요.",
  },
  "TSICW": {
    emoji: "🔍", title: "꼼꼼한 조율자",
    desc: "다양한 영역을 정밀하게 파악하면서 팀과 함께 성장하는 유형.",
    strengths: ["넓은 시야 + 세밀함", "팀 내 다리 역할", "문서화 능력"],
    weaknesses: ["에너지 분산", "모든 것 완벽 부담", "번아웃 위험"],
    studyStyle: "다양한 영역을 꼼꼼하게 파악, 팀과 함께 학습",
    bestMethods: ["다양한 영역 연결점 발견", "기술 문서화 역할", "에너지 관리 실천"],
    avoidMethods: ["모든 영역에서 완벽 추구", "에너지 관리 없이 달리기"],
    slumpSign: "너무 많은 것을 꼼꼼히 하려다 지침",
    slumpRecovery: "과감한 포기 연습. 주력 분야 하나로 좁히기",
    idealMentor: "넓은 경험 + 우선순위/에너지 관리 능한 시니어",
    mentorRequest: "다양한 역할 경험 + 에너지 관리법 + 포기하는 법",
    growthPath: "넓은 조율 → 기술 PM/PO → 테크 리드",
    resources: ["프로젝트 매니지먼트", "기술 문서화 가이드", "에너지 관리 서적"],
    weeklyRoutine: "주 3일 주력 분야 집중. 주 2일 다양한 역할",
    mentoringStyle: "다재다능함 인정 + 에너지/우선순위 관리 코칭형",
    sessionFormat: "격주, 역할 균형 + 에너지 관리 점검",
    doList: ["다재다능함 인정", "에너지 관리 코칭"],
    dontList: ["모든 것을 다 하게 두기"],
    crisisSignal: "번아웃 직전, 모든 것이 중요해 보임",
    recoveryStrategy: "과감한 포기 + 주력 분야 집중 유도",
    thisWeekActions: ["'안 해도 되는 것' 3개 찾기", "그 3개 과감히 내려놓기", "에너지 레벨 매일 기록"],
    thirtyDayChallenge: "30일간 '에너지 관리 일지' 작성",
    dailyHabit: "하루 시작 전 '오늘의 최우선 1가지' 정하기",
    recommendedBooks: ["에센셜리즘", "번아웃의 종말", "일의 99%는 피드백"],
    communityTip: "모든 걸 잘하려고 하지 마세요. '이건 안 해도 돌아간다' 연습!",
  },
  "TSEAD": {
    emoji: "🏆", title: "목표 지향 장인",
    desc: "구체적 목표를 위해 한 분야를 완벽하게 준비하는 준비형 전문가.",
    strengths: ["목표 달성 의지", "꼼꼼한 준비", "깊은 전문성"],
    weaknesses: ["과도한 준비로 시작 늦음", "번아웃 고위험"],
    studyStyle: "목표를 정하면 철저하게 준비합니다",
    bestMethods: ["명확한 마일스톤과 데드라인", "80/20 법칙", "스트레스 관리"],
    avoidMethods: ["완벽할 때까지 시작 안 함", "휴식 없이 달리기"],
    slumpSign: "준비만 하고 시작 못함, 또는 번아웃 직전",
    slumpRecovery: "'70% 준비되면 시작' 반복. 반드시 휴식",
    idealMentor: "목표 달성 경험 풍부 + 멘탈 케어 관심 멘토",
    mentorRequest: "목표 달성 전략 + 번아웃 예방법",
    growthPath: "철저한 준비 → 목표 달성 → 분야 전문가 인증",
    resources: ["기술 면접 대비서", "스트레스 관리", "시간 관리 도구"],
    weeklyRoutine: "주 4일 목표 기반 학습. 주 1일 완전한 휴식",
    mentoringStyle: "목표 달성 지원 + 웰빙 케어 병행형",
    sessionFormat: "격주, 목표 진척 + 웰빙 체크",
    doList: ["목표 달성 지원", "번아웃 예방 코칭"],
    dontList: ["완벽한 준비만 요구", "휴식 무시"],
    crisisSignal: "번아웃 직전, 준비만 하고 시작 못함",
    recoveryStrategy: "강제 휴식 + 작은 범위로 시작",
    thisWeekActions: ["'70% 준비되면 시작' 마인드셋", "일요일 완전 휴식", "스트레스 레벨 매일 체크"],
    thirtyDayChallenge: "30일간 매주 '작은 것 하나 출시'",
    dailyHabit: "하루 끝에 '오늘 내가 쉬었는가?' 체크",
    recommendedBooks: ["완벽의 추구", "딥 워크", "아침형 인간"],
    communityTip: "준비는 80%면 충분해요. 나머지 20%는 실전에서!",
  },
  "TSEAW": {
    emoji: "📊", title: "전략적 학습 플래너",
    desc: "목표 달성을 위해 다양한 분야를 체계적으로 준비하는 전략가.",
    strengths: ["전략적 사고", "체계적 계획", "다양한 기술 습득"],
    weaknesses: ["과도한 계획에 시간 소모", "행동보다 계획"],
    studyStyle: "시장 분석, 로드맵 설계를 즐깁니다",
    bestMethods: ["시장 분석 기반 기술 선택", "우선순위 매트릭스", "계획 → 실행 → 검토"],
    avoidMethods: ["계획만 세우고 실행 안 함", "분석에 너무 많은 시간"],
    slumpSign: "계획만 세우고 실행 안 됨",
    slumpRecovery: "'이번 주에 코드 한 줄이라도' 최우선",
    idealMentor: "전략적이면서 행동력 강한 멘토",
    mentorRequest: "전략 수립 + 실행 강제하는 숙제",
    growthPath: "시장 분석 → 체계적 학습 → 포트폴리오 → 취업",
    resources: ["취업 시장 분석 도구", "기술 트렌드 리포트", "학습 계획 템플릿"],
    weeklyRoutine: "주 1일 계획. 주 4일 실행. 주 1일 검토",
    mentoringStyle: "전략 수립 지원 + 실행 강제형",
    sessionFormat: "격주, 전략 리뷰 + 실행 과제 필수",
    doList: ["전략적 사고 인정", "실행 과제 반드시"],
    dontList: ["계획만 세우게 두기"],
    crisisSignal: "완벽한 계획만 있고 실행 없음",
    recoveryStrategy: "작은 실행 과제 반드시 부여",
    thisWeekActions: ["'실행 안 한 것' 찾기", "가장 작은 것 1개 실행", "계획:실행 비율 2:8로 조정"],
    thirtyDayChallenge: "30일간 '계획은 월요일 1시간만'",
    dailyHabit: "하루 끝에 '계획 vs 실행 비율' 체크",
    recommendedBooks: ["린 스타트업", "실행이 답이다", "완벽한 계획은 없다"],
    communityTip: "계획은 2페이지면 충분해요. 나머지 시간은 코드를 쓰세요!",
  },
  "TSECD": {
    emoji: "👔", title: "팀 전문가 지향형",
    desc: "조직 내에서 인정받기 위해 한 분야를 정밀하게 파는 유형.",
    strengths: ["조직 내 전문성 구축", "팀 기여 의지", "꼼꼼한 업무 처리"],
    weaknesses: ["조직 의존도 높음", "변화에 느린 대응"],
    studyStyle: "팀에서 필요한 기술을 깊이 있게 공부하고 인정받으려 함",
    bestMethods: ["사내 기술 블로그/위키", "팀 내 전문 영역 확립", "외부 발표 도전"],
    avoidMethods: ["조직에만 의존", "외부 활동 완전 배제"],
    slumpSign: "팀 바뀌거나 조직 변화 시 동기 저하",
    slumpRecovery: "조직 독립적 개인 자산 만들기",
    idealMentor: "조직과 외부 모두 인정받는 경험 시니어",
    mentorRequest: "팀 내 전문성 + 개인 브랜딩 전략",
    growthPath: "팀 내 전문가 → 사내 발표 → 외부 발표 → 업계 전문가",
    resources: ["사내 기술 발표", "기술 블로그 가이드", "개인 브랜딩"],
    weeklyRoutine: "주 3일 팀 업무 심화. 주 1일 개인 브랜딩. 주 1일 외부 학습",
    mentoringStyle: "조직 내 성장 + 외부 활동 균형형",
    sessionFormat: "격주, 팀 성장 + 개인 브랜딩 병행",
    doList: ["팀 내 성과 인정", "개인 브랜딩 권장"],
    dontList: ["조직만 강조"],
    crisisSignal: "조직 변화 시 불안, 개인 자산 없음",
    recoveryStrategy: "개인 브랜딩 활동 시작 지원",
    thisWeekActions: ["개인 기술 블로그 개설", "사내 발표 1회 신청", "외부 밋업 1개 참석"],
    thirtyDayChallenge: "30일간 '개인 브랜드 빌딩'. 블로그 4개 + 외부 발표 1회",
    dailyHabit: "퇴근 전 '블로그 쓸 만한 것' 1개 메모",
    recommendedBooks: ["개발자의 글쓰기", "나는 왜 이 일을 하는가", "퍼스널 브랜딩"],
    communityTip: "회사에서의 성과는 퇴사하면 증명하기 어려워요. 외부 자산을 만드세요!",
  },
  "TSECW": {
    emoji: "🎪", title: "체계적 팀 플레이어",
    desc: "팀 목표를 위해 다양한 역할을 꼼꼼하게 수행하는 만능 지원군.",
    strengths: ["다재다능함", "팀 지향적", "꼼꼼한 업무", "높은 책임감"],
    weaknesses: ["자기 전문성 부재 위험", "남의 일만 도움", "번아웃 고위험"],
    studyStyle: "팀에서 필요한 것이면 무엇이든 배웁니다",
    bestMethods: ["개인 전문 영역 하나 설정", "업무 경계 설정 연습", "자기 성장 시간 확보"],
    avoidMethods: ["팀 서포트만 계속", "자기 것 없이 남만 도움"],
    slumpSign: "팀을 위해 자기 성장 완전히 포기",
    slumpRecovery: "'나만의 학습' 시간 확보",
    idealMentor: "팀 플레이와 개인 성장 균형 잘 잡는 멘토",
    mentorRequest: "다양한 경험 인정 + 나의 주력 분야 정하기",
    growthPath: "다양한 역할 경험 → 주력 분야 선택 → 전문성 + 리더십",
    resources: ["역할 설정/경계 서적", "시간 관리", "T자형 커리어"],
    weeklyRoutine: "주 3일 팀 업무. 주 2일 개인 전문 분야 학습",
    mentoringStyle: "팀 기여 인정 + 개인 성장 + 경계 설정 코칭형",
    sessionFormat: "격주, 팀 역할 + 개인 성장 + 경계 설정",
    doList: ["팀 기여 인정", "개인 전문 분야 함께 선정", "경계 설정 코칭"],
    dontList: ["팀만 위하게 두기", "개인 성장 무시"],
    crisisSignal: "번아웃, 자기 성장 멈춤, 전문성 없음",
    recoveryStrategy: "개인 학습 시간 확보 + 경계 설정 연습",
    thisWeekActions: ["'나의 전문 분야' 1개 선정", "팀 요청 1개는 '아니오' 연습", "개인 학습 시간 4시간 확보"],
    thirtyDayChallenge: "30일간 '나만의 시간 지키기'. 매일 1시간 개인 학습",
    dailyHabit: "업무 요청 받으면 '내가 해야 하는 일인가?' 3초 생각",
    recommendedBooks: ["거절의 기술", "타임 블로킹", "나는 왜 도와달라는 말을 못할까"],
    communityTip: "팀에 도움이 되는 것도 좋지만, '나만의 전문성'을 꼭 만드세요!",
  },
  "PFIAD": {
    emoji: "🚀", title: "스피드 해커",
    desc: "빠르게 실험하고 깊이 파고드는 실전형 해커.",
    strengths: ["빠른 프로토타이핑", "깊은 실전 경험", "문제 해결 속도"],
    weaknesses: ["코드 품질 경시", "문서화 부족", "기초 이론 약함"],
    studyStyle: "일단 만들어보면서 배웁니다. 에러를 통해 학습",
    bestMethods: ["해커톤/프로토타이핑 챌린지", "만들면서 배우기", "깊이 있는 과제 병행"],
    avoidMethods: ["이론만 공부하고 안 만듦", "품질 무시하고 빠르게만"],
    slumpSign: "만들기만 하고 깊이가 없어 성장 정체",
    slumpRecovery: "'같은 것을 더 잘 만들어보기'. 기존 것 품질 높이기",
    idealMentor: "빠른 실행력 존중 + 코드 품질과 설계 중요성 아는 시니어",
    mentorRequest: "결과물 데모 + 피드백. 코드 품질 조언",
    growthPath: "빠른 프로토타이핑 → 코드 품질 개선 → 아키텍처 설계",
    resources: ["해커톤", "코드 리팩토링 가이드", "시스템 설계"],
    weeklyRoutine: "주 3일 빠르게 만들기. 주 1일 품질 개선. 주 1일 이론 보강",
    mentoringStyle: "빠른 실행 인정 + 품질 보완 코칭형",
    sessionFormat: "격주, 결과물 데모 + 품질 피드백",
    doList: ["빠른 실행력 인정", "코드 품질 피드백", "이론 보강 과제"],
    dontList: ["속도만 칭찬", "품질 무시"],
    crisisSignal: "비슷한 수준 반복, 성장 정체",
    recoveryStrategy: "기존 프로젝트 품질 개선 과제",
    thisWeekActions: ["가장 지저분한 코드 부분 리팩토링", "README 또는 주석 추가", "기술 결정 기록"],
    thirtyDayChallenge: "30일간 '만들기 + 개선' 사이클. 새로 만들기:리팩토링 = 7:3",
    dailyHabit: "커밋 전 '3개월 후 이 코드 이해할 수 있나?' 자문",
    recommendedBooks: ["리팩터링", "해커와 화가", "클린 코드"],
    communityTip: "빠르게 만드는 것도 실력이에요. '유지보수 가능한 코드'도 연습하세요!",
  },
  "PFIAW": {
    emoji: "🎨", title: "크리에이티브 메이커",
    desc: "다양한 것을 빠르게 만들어보는 창작형. 아이디어가 풍부합니다.",
    strengths: ["높은 창작 에너지", "다양한 실전 경험", "빠른 학습 속도"],
    weaknesses: ["완성도 부족", "깊이 없는 다작", "흥미 감소 시 포기"],
    studyStyle: "새로운 것을 만들면서 배웁니다. 다양한 프로젝트 시도",
    bestMethods: ["다양한 미니 프로젝트", "핵심 프로젝트 1개 완성", "포트폴리오 큐레이션"],
    avoidMethods: ["시작만 하고 완성 안 함", "새로운 것만 찾기"],
    slumpSign: "시작만 하고 완성하지 못하는 패턴",
    slumpRecovery: "아주 작은 범위 프로젝트를 '무조건 배포'",
    idealMentor: "창작 에너지 존중 + '완성' 중요성 아는 멘토",
    mentorRequest: "다양한 시도 인정 + '이번 달은 이것 하나만 완성'",
    growthPath: "다양한 창작 → 핵심 프로젝트 완성 → 포트폴리오 구축",
    resources: ["인디 해커 커뮤니티", "프로젝트 아이디어 리스트", "빠른 배포 도구"],
    weeklyRoutine: "주 2일 새로운 것. 주 3일 핵심 프로젝트. 주 1일 배포/정리",
    mentoringStyle: "창작 에너지 인정 + 완성 유도형",
    sessionFormat: "격주, 다양한 시도 공유 + 핵심 프로젝트 진척",
    doList: ["창작 에너지 인정", "핵심 프로젝트 하나 함께 선정"],
    dontList: ["다양한 시도를 산만하다고"],
    crisisSignal: "미완성 프로젝트만 쌓임",
    recoveryStrategy: "작은 범위로 '무조건 완성' 과제",
    thisWeekActions: ["미완성 프로젝트 리스트 정리", "가장 작은 것 1개 완성", "완성한 것 SNS 공유"],
    thirtyDayChallenge: "30일간 '하나만 끝까지'. 새 아이디어는 노트에만",
    dailyHabit: "새 아이디어 떠오르면 '나중에' 폴더에 저장",
    recommendedBooks: ["Show Your Work", "스틱", "인디 해커 핸드북"],
    communityTip: "ProductHunt에 사이드 프로젝트를 올려보세요!",
  },
  "PFICD": {
    emoji: "⚡", title: "페어 프로그래머",
    desc: "동료와 함께 빠르게 깊이 있는 기능을 구현하는 실전 협업가.",
    strengths: ["실시간 협업 능력", "빠른 기능 구현", "깊은 기술 토론"],
    weaknesses: ["혼자 일하기 어려움", "의존적 학습 패턴"],
    studyStyle: "페어 프로그래밍, 모브 프로그래밍을 좋아합니다",
    bestMethods: ["정기적 페어/모브 프로그래밍", "다양한 파트너와 협업", "독립적 과제 병행"],
    avoidMethods: ["항상 혼자만 학습", "한 파트너에만 의존"],
    slumpSign: "혼자서는 아무것도 못하는 상태",
    slumpRecovery: "점진적으로 독립 과제 난이도 높이기",
    idealMentor: "페어 프로그래밍 즐기면서 독립성 유도 멘토",
    mentorRequest: "정기적 페어 코딩 + '혼자 해올 숙제'도",
    growthPath: "페어 코딩 → 독립 개발 능력 → 팀 리드",
    resources: ["페어 프로그래밍 가이드", "모브 프로그래밍", "독립 프로젝트 챌린지"],
    weeklyRoutine: "주 2-3회 페어/그룹 코딩. 주 2일 독립 과제",
    mentoringStyle: "페어 코딩 활용 + 독립성 성장 유도형",
    sessionFormat: "주 1회 페어 코딩 + 독립 과제 리뷰",
    doList: ["페어 코딩 활용", "독립 과제 반드시 병행"],
    dontList: ["항상 함께만", "독립 학습 완전 배제"],
    crisisSignal: "혼자서 아무것도 못함",
    recoveryStrategy: "작은 독립 과제부터 점진적으로",
    thisWeekActions: ["'혼자서 해결할 과제' 1개 정하기", "막혀도 30분은 혼자 시도", "혼자 해결한 것 기록"],
    thirtyDayChallenge: "30일간 '독립 개발 근육 키우기'. 매주 1개는 혼자 완성",
    dailyHabit: "문제 만나면 '30분 혼자 시도' 후 도움 요청",
    recommendedBooks: ["페어 프로그래밍", "익스트림 프로그래밍", "함께 자라기"],
    communityTip: "페어 프로그래밍 경험은 협업 능력의 증거예요!",
  },
  "PFICW": {
    emoji: "🌈", title: "오픈소스 기여자",
    desc: "다양한 프로젝트에 빠르게 기여하며 커뮤니티와 함께 성장.",
    strengths: ["오픈소스 마인드", "다양한 코드베이스 경험", "커뮤니티 기여 정신"],
    weaknesses: ["깊이 부족", "자기 프로젝트 부재"],
    studyStyle: "오픈소스 프로젝트에 기여하면서 배웁니다",
    bestMethods: ["오픈소스 기여 시작", "자기만의 오픈소스 프로젝트", "커뮤니티 발표"],
    avoidMethods: ["기여만 하고 자기 것 없음", "깊이 없이 여러 프로젝트 점프"],
    slumpSign: "남의 프로젝트에만 기여하고 자기 것 없음",
    slumpRecovery: "'나만의 라이브러리' 만들어보기",
    idealMentor: "오픈소스 경험 풍부 + 커뮤니티 활동 긍정적 멘토",
    mentorRequest: "오픈소스 기여 전략 + 자기 프로젝트 시작",
    growthPath: "오픈소스 기여 → 코어 컨트리뷰터 → 메인테이너",
    resources: ["오픈소스 기여 가이드", "Good First Issue", "커뮤니티 컨퍼런스"],
    weeklyRoutine: "주 2일 오픈소스 기여. 주 2일 자기 프로젝트. 주 1일 커뮤니티",
    mentoringStyle: "오픈소스 활동 인정 + 자기 프로젝트 유도형",
    sessionFormat: "격주, 기여 리뷰 + 자기 프로젝트 진척",
    doList: ["오픈소스 활동 인정", "자기 프로젝트 함께 기획"],
    dontList: ["기여만 하게 두기"],
    crisisSignal: "자기 프로젝트 없음, 항상 기여자만",
    recoveryStrategy: "자기 프로젝트 시작 지원",
    thisWeekActions: ["자주 쓰는 오픈소스 1개 선택", "Good First Issue 찾아서 PR", "'나만의 미니 라이브러리' 구상"],
    thirtyDayChallenge: "30일간 'PR 4개 + 내 프로젝트 v0.1'",
    dailyHabit: "오픈소스 코드 읽을 때 '내 프로젝트에 적용할 것' 메모",
    recommendedBooks: ["Working in Public", "The Cathedral and the Bazaar", "오픈소스로 미래를"],
    communityTip: "오픈소스 기여 이력은 가장 강력한 포트폴리오예요!",
  },
  "PFEAD": {
    emoji: "💰", title: "스타트업 빌더",
    desc: "시장 가치 있는 제품을 빠르게 깊이 있게 만드는 사업가형 개발자.",
    strengths: ["제품 감각", "빠른 실행력", "시장 지향적 개발"],
    weaknesses: ["수익 집착", "코드 품질 경시", "번아웃 위험"],
    studyStyle: "실제 사용자가 있는 제품을 만들면서 배웁니다",
    bestMethods: ["실사용자 있는 프로젝트", "기술 부채 관리", "수익화 전략"],
    avoidMethods: ["수익과 무관한 학습만", "기술 부채 무시"],
    slumpSign: "수익 안 나서 동기 상실, 또는 기술 부채 누적",
    slumpRecovery: "작은 성공 경험. 유료 사용자 1명 같은 마일스톤",
    idealMentor: "기술 창업 경험 + 제품과 기술 균형 아는 멘토",
    mentorRequest: "제품 개발 조언 + 기술 부채 관리법",
    growthPath: "MVP 빌드 → 제품 성장 → 기술 부채 관리 → CTO",
    resources: ["인디 해커 성공 사례", "기술 스타트업 가이드", "제품 매니지먼트"],
    weeklyRoutine: "주 3일 제품 개발. 주 1일 기술 부채 관리. 주 1일 비즈니스",
    mentoringStyle: "제품 감각 인정 + 기술 균형 코칭형",
    sessionFormat: "격주, 제품 진척 + 기술 부채 체크",
    doList: ["제품 감각 인정", "기술 부채 관리 코칭"],
    dontList: ["수익만 강조", "기술 완전 무시"],
    crisisSignal: "수익 압박 또는 기술 부채 누적",
    recoveryStrategy: "작은 성공 + 기술 부채 정리 병행",
    thisWeekActions: ["기술 부채 TOP 3 리스트업", "그 중 1개 해결", "사용자 1명에게 피드백 요청"],
    thirtyDayChallenge: "30일간 '작은 수익 만들기'. 유료 사용자 1명 목표",
    dailyHabit: "코딩 전 '이 기능이 사용자에게 가치를 주는가?' 생각",
    recommendedBooks: ["린 스타트업", "제로 투 원", "인디 해커스 핸드북"],
    communityTip: "인디 해커 커뮤니티에서 같은 여정의 사람들을 만나보세요!",
  },
  "PFEAW": {
    emoji: "🔥", title: "풀스택 스프린터",
    desc: "목표를 위해 다양한 기술을 빠르게 실전 적용하는 행동파.",
    strengths: ["빠른 풀스택 개발", "다양한 기술 적용", "높은 생산성"],
    weaknesses: ["각 기술 깊이 부족", "코드 품질 문제"],
    studyStyle: "필요한 기술을 그때그때 빠르게 배워서 적용",
    bestMethods: ["풀스택 프로젝트 단계별", "각 기술 핵심 베스트 프랙티스"],
    avoidMethods: ["이론부터 시작", "빠른 속도만 추구"],
    slumpSign: "많이 만들었지만 깊이 없어 면접 탈락",
    slumpRecovery: "'왜 이 기술을 선택했는지' 설명할 깊이 키우기",
    idealMentor: "풀스택 경험 풍부 + 각 분야 핵심 짚어줄 멘토",
    mentorRequest: "다양한 기술 사용 인정 + 각 기술 핵심 원리",
    growthPath: "빠른 풀스택 → 핵심 기술 깊이 → 포트폴리오 완성",
    resources: ["풀스택 프로젝트 템플릿", "각 기술별 베스트 프랙티스"],
    weeklyRoutine: "주 3일 프로젝트. 주 1일 핵심 기술 깊이. 주 1일 배포/정리",
    mentoringStyle: "풀스택 실행력 인정 + 깊이 보완 코칭형",
    sessionFormat: "격주, 프로젝트 리뷰 + 기술별 핵심 원리",
    doList: ["실행력 인정", "기술별 핵심 원리 짧게 코칭"],
    dontList: ["속도만 칭찬", "깊이 완전 무시"],
    crisisSignal: "깊이 부족으로 성장 정체",
    recoveryStrategy: "핵심 기술 원리 학습 과제",
    thisWeekActions: ["'가장 얕은 기술' 1개 선정", "공식 문서 30분 정독", "'왜 이 기술 선택했는지' 정리"],
    thirtyDayChallenge: "30일간 '깊이 보완'. 매주 1개 기술 '왜 쓰는지' 정리",
    dailyHabit: "새 기술 쓸 때 '장단점 3개' 먼저 조사",
    recommendedBooks: ["풀스택 개발자로 살아남기", "시스템 설계 면접", "웹 개발자를 위한 자료구조"],
    communityTip: "넓이도 실력이에요. 하지만 면접에서는 '깊이' 질문이 나와요!",
  },
  "PFECD": {
    emoji: "🎖️", title: "팀 에이스",
    desc: "팀 성과를 위해 핵심 기능을 빠르게 구현하는 실전 전문가.",
    strengths: ["팀 내 핵심 구현력", "빠른 기능 개발", "성과 가시화"],
    weaknesses: ["팀 의존적 동기", "개인 프로젝트 부족"],
    studyStyle: "팀 프로젝트에서 핵심 기능을 맡아 구현하면서 배웁니다",
    bestMethods: ["팀 프로젝트 핵심 기능 담당", "성과 가시화", "개인 사이드 프로젝트 병행"],
    avoidMethods: ["팀 성과만 의존", "개인 성장 시간 없음"],
    slumpSign: "팀 해체 또는 인정 못 받을 때 동기 저하",
    slumpRecovery: "내적 동기와 개인 프로젝트 키우기",
    idealMentor: "팀 리더 경험 + 성과 인정 + 독립적 성장 유도 멘토",
    mentorRequest: "팀 내 성과 인정 + '개인 프로젝트도 하나 하자'",
    growthPath: "팀 에이스 → 기술 리더 → 팀 리드",
    resources: ["리더십 개발", "기술 발표 기회", "고난도 기술 챌린지"],
    weeklyRoutine: "주 3일 팀 프로젝트. 주 1일 개인 프로젝트. 주 1일 리더십 연습",
    mentoringStyle: "팀 성과 인정 + 개인 성장 균형형",
    sessionFormat: "격주, 팀 성과 리뷰 + 개인 프로젝트 진척",
    doList: ["팀 성과 인정", "개인 프로젝트 함께 기획"],
    dontList: ["팀만 강조", "개인 성장 무시"],
    crisisSignal: "팀 의존, 개인 프로젝트 없음",
    recoveryStrategy: "개인 프로젝트 시작 지원",
    thisWeekActions: ["개인 사이드 프로젝트 아이디어 3개", "가장 작은 것 1개 시작", "팀 성과를 포트폴리오에 정리"],
    thirtyDayChallenge: "30일간 '나만의 프로젝트 1개' 완성",
    dailyHabit: "팀 성과 외에 '오늘 나만의 성장 1가지' 기록",
    recommendedBooks: ["팀장 없는 조직", "드라이브", "원씽"],
    communityTip: "팀 성과는 중요해요. 하지만 '나만의 프로젝트'가 있으면 더 강력해요!",
  },
  "PFECW": {
    emoji: "🌟", title: "만능 해결사",
    desc: "팀의 다양한 문제를 빠르게 실전으로 해결하는 멀티 플레이어.",
    strengths: ["문제 해결 속도", "다양한 기술 활용", "팀 기여도 높음"],
    weaknesses: ["전문성 부재 위험", "항상 급한 일만 처리"],
    studyStyle: "팀에서 필요한 문제를 해결하면서 배웁니다",
    bestMethods: ["해결한 문제 기록/정리", "주력 기술 분야 하나 선정", "깊이 있는 학습 시간"],
    avoidMethods: ["항상 급한 일만 처리", "정리 없이 다음 문제로"],
    slumpSign: "계속 바쁘지만 성장 정체",
    slumpRecovery: "'이번 달은 한 가지만 깊이 파기' 목표",
    idealMentor: "다양한 경험 + 깊이 있는 전문성으로 성장한 시니어",
    mentorRequest: "다양한 문제 해결 인정 + 주력 분야 정하기",
    growthPath: "만능 해결사 → 주력 분야 심화 → 시니어 → 아키텍트",
    resources: ["문제 해결 패턴", "기술 부채 관리", "시스템 설계 면접"],
    weeklyRoutine: "주 3일 다양한 문제 해결. 주 2일 주력 분야 깊이 파기",
    mentoringStyle: "문제 해결 능력 인정 + 깊이 유도형",
    sessionFormat: "격주, 해결 문제 리뷰 + 주력 분야 진척",
    doList: ["문제 해결 능력 인정", "주력 분야 함께 선정"],
    dontList: ["넓이만 칭찬", "깊이 무시"],
    crisisSignal: "성장 정체, 전문성 없음",
    recoveryStrategy: "주력 분야 집중 기간 설정",
    thisWeekActions: ["지난 달 해결한 문제들 유형별 정리", "가장 많이 해결한 유형 = 주력 분야 후보", "그 분야 공식 문서 1시간 정독"],
    thirtyDayChallenge: "30일간 '주력 분야 집중'. 다른 문제는 70%로",
    dailyHabit: "문제 해결 후 '어떤 유형의 문제였나?' 분류",
    recommendedBooks: ["문제 해결의 기술", "아웃라이어", "일의 미래"],
    communityTip: "만능은 좋지만, '이것만큼은 깊이 압니다'가 필요해요!",
  },
  "PSIAD": {
    emoji: "🏗️", title: "아키텍트",
    desc: "실전에서 한 분야의 완벽한 구조를 만드는 건축가형.",
    strengths: ["뛰어난 설계 능력", "높은 코드 품질", "깊은 실전 지식"],
    weaknesses: ["과도한 설계", "속도 느림"],
    studyStyle: "시스템 설계와 아키텍처를 깊이 공부합니다",
    bestMethods: ["아키텍처 설계 연습", "트레이드오프 분석", "실전 배포 경험"],
    avoidMethods: ["설계만 하고 구현 안 함", "모든 것을 완벽하게 설계"],
    slumpSign: "설계만 하고 코드를 쓰지 않는 상태",
    slumpRecovery: "'80% 설계로 시작하고, 만들면서 개선'",
    idealMentor: "실전 아키텍처 경험 풍부 + 실용적 균형 시니어",
    mentorRequest: "설계 리뷰 + '언제 설계를 멈추고 구현 시작해야 하는지'",
    growthPath: "코드 품질 추구 → 시스템 설계 → 아키텍트",
    resources: ["시스템 설계 인터뷰", "아키텍처 패턴", "실전 설계 케이스"],
    weeklyRoutine: "주 2일 설계/학습. 주 3일 구현. 주 1일 균형 점검",
    mentoringStyle: "설계 능력 인정 + 실용적 균형 코칭형",
    sessionFormat: "격주, 설계 리뷰 + 구현 진척 체크",
    doList: ["설계 능력 인정", "실용적 균형 코칭"],
    dontList: ["설계만 하게 두기", "완벽한 설계 요구"],
    crisisSignal: "설계만 있고 구현 없음",
    recoveryStrategy: "작은 범위로 '일단 구현' 과제",
    thisWeekActions: ["지금 설계 중인 것의 80% 버전 정의", "그 80% 버전 이번 주 구현 시작", "구현하면서 설계 개선점 발견"],
    thirtyDayChallenge: "30일간 '설계 → 구현 → 개선' 사이클 3번",
    dailyHabit: "설계 시간이 1시간 넘으면 '일단 코드 쓰자'",
    recommendedBooks: ["시스템 설계 면접", "클린 아키텍처", "도메인 주도 설계"],
    communityTip: "설계 능력은 시니어의 핵심이에요. 하지만 '구현 없는 설계'는 공허합니다!",
  },
  "PSIAW": {
    emoji: "🛠️", title: "꼼꼼한 메이커",
    desc: "다양한 것을 높은 완성도로 만드는 정밀 제작자.",
    strengths: ["높은 완성도", "다양한 기술 경험", "디테일 감각"],
    weaknesses: ["속도가 느림", "완성까지 시간 과다"],
    studyStyle: "만드는 것을 좋아하지만, 완성도가 높아야 만족",
    bestMethods: ["완성도 높은 포트폴리오 프로젝트", "범위 설정과 MVP", "배포 데드라인"],
    avoidMethods: ["대충 빠르게 만들기", "완벽할 때까지 배포 안 함"],
    slumpSign: "만들고 있지만 영원히 완성 못함",
    slumpRecovery: "극도로 작은 범위 프로젝트를 완성-배포",
    idealMentor: "품질 감각 + 출시의 중요성 아는 실전 개발자",
    mentorRequest: "완성도 인정 + '언제 됐다라고 할 수 있는지' 함께",
    growthPath: "꼼꼼한 제작 → 범위 관리 → 다양한 완성 프로젝트",
    resources: ["프로젝트 범위 관리", "MVP 정의", "배포 자동화"],
    weeklyRoutine: "주 3일 핵심 프로젝트. 주 1일 범위 점검. 주 1일 배포/정리",
    mentoringStyle: "완성도 인정 + 범위 관리 코칭형",
    sessionFormat: "격주, 프로젝트 리뷰 + 범위/완료 기준 점검",
    doList: ["완성도 인정", "범위 관리 코칭"],
    dontList: ["완벽할 때까지 두기"],
    crisisSignal: "영원히 완성 못함",
    recoveryStrategy: "작은 범위로 완성-배포 과제",
    thisWeekActions: ["지금 만드는 것의 'MVP 범위' 절반으로", "그 MVP 이번 주 배포", "배포 후 개선점 목록 따로"],
    thirtyDayChallenge: "30일간 '작게, 빨리, 자주 출시'. 주 1회 뭔가를 세상에",
    dailyHabit: "작업 시작 전 '오늘의 완료 기준' 적기",
    recommendedBooks: ["린 스타트업", "Getting Real", "Ship It!"],
    communityTip: "완성도 높은 1개가 미완성 10개보다 낫지만, '출시된 1개'가 가장 가치 있어요!",
  },
  "PSICD": {
    emoji: "🤝", title: "신중한 협업자",
    desc: "팀과 함께 깊이 있는 실전 경험을 꼼꼼하게 쌓아가는 유형.",
    strengths: ["신뢰받는 팀원", "꼼꼼한 구현", "안정적 기여"],
    weaknesses: ["의사결정 느림", "리스크 회피", "변화에 보수적"],
    studyStyle: "팀과 함께 프로젝트를 진행하면서 신중하게 배웁니다",
    bestMethods: ["팀 프로젝트 코어 기능 담당", "코드 리뷰에서 깊이 있는 토론", "점진적 리더 역할"],
    avoidMethods: ["급하게 결정 내리기", "리스크를 무조건 피하기"],
    slumpSign: "결정을 내리지 못해 프로젝트 정체",
    slumpRecovery: "'완벽한 결정은 없다, 70% 확신이면 시작'",
    idealMentor: "인내심 있고 안전한 환경에서 점진적 성장 유도 멘토",
    mentorRequest: "협업 경험 + 의사결정 연습. 안전하게 실패할 수 있는 환경",
    growthPath: "신중한 구현 → 기술적 의사결정 → 팀 내 기술 리더",
    resources: ["의사결정 프레임워크", "기술 리더십", "팀 코드 리뷰"],
    weeklyRoutine: "주 3일 팀 협업. 주 1일 의사결정 연습. 주 1일 학습/정리",
    mentoringStyle: "안전한 환경 제공 + 점진적 의사결정 경험형",
    sessionFormat: "격주, 협업 리뷰 + 의사결정 연습 과제",
    doList: ["신중함 인정", "안전한 의사결정 연습 기회"],
    dontList: ["빠른 결정 압박", "실패를 크게 문제 삼기"],
    crisisSignal: "의사결정 마비",
    recoveryStrategy: "작은 의사결정부터 연습",
    thisWeekActions: ["오늘 '작은 기술 결정' 1개 내리기", "결정의 이유를 2줄로 기록", "'결정한 것 자체'를 칭찬"],
    thirtyDayChallenge: "30일간 매일 '작은 결정 1개' 연습",
    dailyHabit: "결정 필요할 때 '5분 안에 80% 정보로 결정' 연습",
    recommendedBooks: ["결정의 본질", "그릿", "두려움 없는 조직"],
    communityTip: "신중함은 장점이에요. 하지만 '완벽한 결정'은 없어요!",
  },
  "PSICW": {
    emoji: "🧰", title: "만능 장인",
    desc: "다양한 분야를 실전에서 꼼꼼하게 익히며 팀과 함께 성장.",
    strengths: ["다재다능 + 꼼꼼함", "팀 내 안정적 기여", "높은 완성도"],
    weaknesses: ["속도 느림", "에너지 분산", "전문성 부재 위험"],
    studyStyle: "다양한 역할을 꼼꼼하게 수행하면서 배웁니다",
    bestMethods: ["다양한 역할 순환 후 주력 선정", "에너지 관리 의식적 실천"],
    avoidMethods: ["모든 분야에서 완벽 추구", "주력 분야 없이 넓히기만"],
    slumpSign: "이것저것 하느라 지쳐서 성장 정체",
    slumpRecovery: "과감하게 범위 줄이고 한 분야 집중 시기",
    idealMentor: "다양한 경험 후 전문성 확립한 시니어",
    mentorRequest: "다양한 경험 인정 + 주력 분야 정하기 + 에너지 관리",
    growthPath: "다양한 실전 경험 → 주력 분야 확립 → T자형 시니어",
    resources: ["T자형 커리어", "에너지/시간 관리", "커리어 설계"],
    weeklyRoutine: "주 2일 다양한 역할. 주 2일 주력 분야. 주 1일 에너지 회복",
    mentoringStyle: "다재다능 인정 + 주력 분야 + 에너지 관리 코칭형",
    sessionFormat: "격주, 다양한 경험 + 주력 분야 + 에너지 관리",
    doList: ["다재다능함 인정", "주력 분야 함께 선정"],
    dontList: ["모든 것 다 하게 두기"],
    crisisSignal: "번아웃, 전문성 없음",
    recoveryStrategy: "주력 분야 집중 기간 + 에너지 관리",
    thisWeekActions: ["잘하는/좋아하는 분야 TOP 3 정리", "그 중 1개를 '주력'으로 선언", "이번 주 그 분야에 50% 이상"],
    thirtyDayChallenge: "30일간 '주력 분야 집중'. 다른 것은 80%로 OK",
    dailyHabit: "하루 시작 전 '주력 분야에 몇 % 쓸까?' 계획",
    recommendedBooks: ["일의 기쁨과 슬픔", "몰입", "에센셜리즘"],
    communityTip: "다재다능함은 PM이나 테크 리드에 어울려요. 하지만 '주력 1개'는 꼭!",
  },
  "PSEAD": {
    emoji: "🎯", title: "실전 스페셜리스트",
    desc: "목표를 위해 한 분야의 실전 능력을 완벽하게 갈고닦는 전문가.",
    strengths: ["목표 지향 + 깊은 실전력", "높은 완성도", "전문가 수준"],
    weaknesses: ["유연성 부족", "과도한 완벽주의", "번아웃 고위험"],
    studyStyle: "목표를 정하면 그 분야를 완벽하게 마스터하려 합니다",
    bestMethods: ["현업 수준 실전 과제", "전문 기술 인증 목표", "번아웃 예방 루틴"],
    avoidMethods: ["다양한 분야 동시에", "완벽주의 방치", "휴식 없이 달리기"],
    slumpSign: "목표만 쫓다 번아웃. 성취해도 공허함",
    slumpRecovery: "성과 압박 줄이고, 과정의 즐거움과 휴식",
    idealMentor: "해당 분야 시니어 전문가 + 멘탈 케어 관심 멘토",
    mentorRequest: "전문성 심화 + 번아웃 예방법",
    growthPath: "실전 전문가 → 인증/자격 획득 → 해당 분야 리더",
    resources: ["분야별 고급 과정", "기술 인증 시험", "번아웃 예방"],
    weeklyRoutine: "주 4일 전문 분야 심화. 주 1일 완전한 휴식",
    mentoringStyle: "전문성 지원 + 웰빙 케어 병행형",
    sessionFormat: "격주, 전문성 진척 + 웰빙 체크",
    doList: ["전문성 인정", "번아웃 예방 코칭"],
    dontList: ["완벽만 요구", "휴식 무시"],
    crisisSignal: "번아웃 직전, 공허함",
    recoveryStrategy: "강제 휴식 + 과정의 즐거움 찾기",
    thisWeekActions: ["일요일 완전 휴식 (코딩 금지)", "'재미있는 순간' 3개 기록", "'성장한 점' 1개 기록"],
    thirtyDayChallenge: "30일간 '균형 잡힌 성장'. 주 5일 집중 + 주 2일 휴식",
    dailyHabit: "하루 끝에 '오늘 즐거웠던 순간' 1개 기록",
    recommendedBooks: ["번아웃의 종말", "딥 워크", "마스터리"],
    communityTip: "목표 달성은 중요하지만, 번아웃 없이 오래 가는 것이 더 중요해요!",
  },
  "PSEAW": {
    emoji: "📈", title: "커리어 빌더",
    desc: "취업/이직을 위해 다양한 실전 경험을 꼼꼼하게 준비하는 유형.",
    strengths: ["전략적 준비", "다양한 실전 경험", "높은 완성도"],
    weaknesses: ["준비 기간 길어짐", "스펙 쌓기 매몰 위험"],
    studyStyle: "취업/이직 목표를 정하고, 다양한 실전 경험을 꼼꼼하게 준비",
    bestMethods: ["실전 면접 모의 훈련", "포트폴리오 리뷰", "지원 시점 명확히"],
    avoidMethods: ["계속 준비만 하기", "완벽해야 지원한다는 생각"],
    slumpSign: "영원히 준비만 하고 지원 안 함",
    slumpRecovery: "'80% 준비된 지금이 최적'. 일단 지원하고 피드백",
    idealMentor: "채용 경험 있고 도전하도록 밀어줄 멘토",
    mentorRequest: "포트폴리오 리뷰 + '지금 지원해도 될까요?' 객관적 판단",
    growthPath: "포트폴리오 구축 → 실전 지원 → 피드백 반영 → 취업",
    resources: ["면접 준비 가이드", "포트폴리오 레퍼런스", "코딩 테스트 플랫폼"],
    weeklyRoutine: "주 2일 포트폴리오 개선. 주 2일 면접 준비. 주 1일 실제 지원",
    mentoringStyle: "준비 인정 + 도전 유도형",
    sessionFormat: "격주, 포트폴리오/면접 리뷰 + 지원 계획",
    doList: ["준비 인정", "도전 유도", "지원 시점 함께"],
    dontList: ["완벽한 준비만 요구"],
    crisisSignal: "영원한 준비 모드, 지원 안 함",
    recoveryStrategy: "등 밀어주기 + 작은 지원부터",
    thisWeekActions: ["이번 주 최소 1곳 지원", "탈락해도 '피드백 얻기' 목표", "면접 후 '배운 점' 기록"],
    thirtyDayChallenge: "30일간 '주 1회 지원'. 합격/탈락 상관없이 지원이 목표",
    dailyHabit: "하루 10분 면접 질문 1개 답변 연습",
    recommendedBooks: ["코딩 인터뷰 완전 분석", "개발자 이력서", "두 번째 직장"],
    communityTip: "준비는 80%면 충분해요. 나머지 20%는 실전에서!",
  },
  "PSECD": {
    emoji: "🏢", title: "조직 핵심 인재",
    desc: "팀 내에서 실전 전문가로 인정받기 위해 꼼꼼하게 실력을 쌓는 유형.",
    strengths: ["조직 내 신뢰도", "꼼꼼한 업무 처리", "깊은 실전력"],
    weaknesses: ["조직 밖 자신감 부족", "변화에 보수적", "자기 PR 부족"],
    studyStyle: "팀에서 필요한 기술을 깊이 공부하고, 조직 내 인정받으며 성장",
    bestMethods: ["업무 연결 기술 심화", "사내 발표/공유", "외부 활동 점진적 도전"],
    avoidMethods: ["조직에만 의존", "외부 활동 완전 배제", "자기 PR 무시"],
    slumpSign: "조직 변화 시 극도의 불안",
    slumpRecovery: "조직 독립적 개인 자산 만들기",
    idealMentor: "조직과 외부 모두 인정받는 시니어",
    mentorRequest: "팀 내 성장 + 개인 브랜딩 시작",
    growthPath: "팀 내 전문가 → 사내 발표 → 외부 발표 → 업계 인정 전문가",
    resources: ["사내 기술 발표", "기술 블로그 시작", "외부 컨퍼런스"],
    weeklyRoutine: "주 3일 팀 업무 심화. 주 1일 개인 브랜딩. 주 1일 외부 학습",
    mentoringStyle: "조직 내 성장 + 개인 브랜딩 균형형",
    sessionFormat: "격주, 팀 성과 + 개인 브랜딩 병행",
    doList: ["팀 내 성과 인정", "개인 브랜딩 권장"],
    dontList: ["조직만 강조"],
    crisisSignal: "조직 변화 시 불안, 개인 자산 없음",
    recoveryStrategy: "개인 브랜딩 활동 시작 지원",
    thisWeekActions: ["개인 기술 블로그 개설", "업무에서 배운 것 1개를 블로그 주제로", "LinkedIn 프로필 업데이트"],
    thirtyDayChallenge: "30일간 '개인 브랜드 빌딩'. 블로그 4개 + LinkedIn 팔로워 50명",
    dailyHabit: "퇴근 전 '블로그 쓸 만한 것' 1개 메모",
    recommendedBooks: ["개발자의 글쓰기", "나는 왜 이 일을 하는가", "퍼스널 브랜딩"],
    communityTip: "조직에서의 성과는 퇴사하면 증명하기 어려워요. 외부 자산을 만드세요!",
  },
  "PSECW": {
    emoji: "🌍", title: "올라운드 프로",
    desc: "팀의 다양한 니즈를 실전에서 꼼꼼하게 충족시키는 만능 프로.",
    strengths: ["다재다능 + 높은 완성도", "팀 내 핵심 인력", "다양한 기술 커버"],
    weaknesses: ["전문성 부재 위험", "과부하", "커리어 방향 모호"],
    studyStyle: "팀에서 필요한 다양한 기술을 꼼꼼하게 배웁니다",
    bestMethods: ["다양한 역할 순환 후 주력 확정", "업무 부하 관리", "커리어 로드맵 설계"],
    avoidMethods: ["모든 역할 계속 맡음", "커리어 방향 없이 넓히기만"],
    slumpSign: "모든 것을 다 하느라 커리어 방향 상실",
    slumpRecovery: "3개월간 한 분야 '포커스 기간'",
    idealMentor: "다양한 역할 경험 후 명확한 전문성 확립한 시니어 리더",
    mentorRequest: "다양한 경험 인정 + 나의 주력 분야 + 커리어 방향",
    growthPath: "올라운드 경험 → 주력 분야 확정 → 깊이 + 넓이 → 테크 리드/CTO",
    resources: ["커리어 설계 가이드", "업무 부하 관리", "리더십 프로그램"],
    weeklyRoutine: "주 2일 팀 다양한 업무. 주 2일 주력 분야. 주 1일 커리어 점검/휴식",
    mentoringStyle: "다재다능 인정 + 주력 분야 + 커리어 방향 코칭형",
    sessionFormat: "격주, 다양한 경험 + 주력 분야 + 커리어 방향",
    doList: ["다재다능 인정", "주력 분야 함께 선정", "커리어 방향 코칭"],
    dontList: ["모든 것 다 하게 두기", "커리어 방향 무시"],
    crisisSignal: "커리어 방향 상실, 전문성 없음",
    recoveryStrategy: "포커스 기간 설정 + 커리어 방향 함께",
    thisWeekActions: ["'3년 후 어떤 사람이 되고 싶은가?' 한 문장 작성", "그 방향에 맞는 주력 분야 1개 선정", "이번 주 그 분야에 40% 이상"],
    thirtyDayChallenge: "30일간 '커리어 방향 명확화'. 주력 분야 1개 정하고 깊이 파기",
    dailyHabit: "하루 끝에 '오늘 내 커리어 방향과 맞는 일 했나?' 체크",
    recommendedBooks: ["커리어 피봇", "일의 미래", "The Infinite Game"],
    communityTip: "올라운더는 CTO/테크 리드에 적합해요. 하지만 '나의 방향'을 명확히 해야 거기까지 갈 수 있어요!",
  },
};

export default function Quiz({ role, menteeName, onBack }: QuizProps) {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, -1 | 0 | 1>>({});
  const [dimScores, setDimScores] = useState([0, 0, 0, 0, 0]);
  const [result, setResult] = useState<(TypeInfo & { code: string; scores: number[] }) | null>(null);
  const [animating, setAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [sessionId] = useState(() => uuidv4());
  const [startTime] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const saveToNotion = async (typeCode: string, typeTitle: string, scores: number[], answerList: Answer[]) => {
    setSubmitting(true);
    try {
      await fetch('/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, quizType: role, menteeName: menteeName || '', typeCode, typeTitle,
          scores: { learning: scores[0], speed: scores[1], motivation: scores[2], problem: scores[3], growth: scores[4] },
          answers: answerList, completedAt: new Date().toISOString(), duration: Math.floor((Date.now() - startTime) / 1000),
        }),
      });
    } catch (e) { console.error('Save error:', e); } finally { setSubmitting(false); }
  };

  const handleAnswer = (qIndex: number, score: -1 | 0 | 1) => {
    if (animating) return;
    setAnimating(true);
    const newAnswers = { ...answers, [qIndex]: score };
    setAnswers(newAnswers);
    const newScores = [0, 0, 0, 0, 0];
    Object.entries(newAnswers).forEach(([qi, s]) => { newScores[QUESTIONS[parseInt(qi)].dim] += s; });
    setDimScores(newScores);
    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setCurrentQ(qIndex + 1);
        scrollTop();
      } else {
        const code = getTypeCode(newScores);
        const typeInfo = TYPE_DATA[code] || TYPE_DATA["TFIAD"];
        setResult({ ...typeInfo, code, scores: newScores });
        const answerList: Answer[] = Object.entries(newAnswers).map(([qi, choice]) => ({
          questionId: parseInt(qi) + 1, dimension: DIMENSIONS[QUESTIONS[parseInt(qi)].dim].id, choice: choice as -1 | 0 | 1
        }));
        saveToNotion(code, typeInfo.title, newScores, answerList);
        setPhase('result');
        scrollTop();
      }
      setAnimating(false);
    }, 400);
  };

  if (phase === 'intro') {
    return (
      <div ref={topRef} style={{ minHeight: '100vh', background: C.bg, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🧬</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 12 }}>
            {menteeName ? `${menteeName}님의 ` : ''}학습 DNA 진단
          </h1>
          <p style={{ fontSize: 15, color: C.textDim, lineHeight: 1.8, marginBottom: 32 }}>
            {role === 'mentor' ? '멘티를 위한 32가지 유형 분석' : '15개의 질문으로 알아보는 나의 학습 스타일'}<br/>
            5가지 차원 × 32가지 유형으로 분석합니다
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
            {DIMENSIONS.map(d => (
              <div key={d.id} style={{ padding: '10px 14px', background: C.card, borderRadius: 12, border: `1px solid ${C.cardBorder}` }}>
                <div style={{ fontSize: 12, color: C.textMute, marginBottom: 4 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{d.left} ↔ {d.right}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ width: '100%', padding: '16px 32px', fontSize: 16, fontWeight: 700, color: '#fff', background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, border: 'none', borderRadius: 14, cursor: 'pointer', marginBottom: 12 }}>
            진단 시작하기
          </button>
          <button onClick={onBack} style={{ width: '100%', padding: '14px 32px', fontSize: 14, fontWeight: 500, color: C.textDim, background: 'transparent', border: `1px solid ${C.cardBorder}`, borderRadius: 14, cursor: 'pointer' }}>
            ← 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'quiz') {
    const q = QUESTIONS[currentQ];
    return (
      <div ref={topRef} style={{ minHeight: '100vh', background: C.bg, padding: '30px 20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.textMute }}>{DIMENSIONS[q.dim].name}</span>
              <span style={{ fontSize: 12, color: C.accent }}>{currentQ + 1} / {QUESTIONS.length}</span>
            </div>
            <ProgressBar current={currentQ + 1} total={QUESTIONS.length} />
          </div>
          <Card>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.6 }}>Q{currentQ + 1}. {q.text}</h2>
            {q.context && <p style={{ fontSize: 12, color: C.textMute, marginBottom: 20 }}>{q.context}</p>}
            <ThreeChoiceSelector leftLabel={q.leftLabel} rightLabel={q.rightLabel} value={answers[currentQ] ?? null} onChange={(v) => handleAnswer(currentQ, v)} disabled={animating} />
          </Card>
          {currentQ > 0 && (
            <button onClick={() => { setCurrentQ(currentQ - 1); scrollTop(); }} style={{ width: '100%', padding: '14px', fontSize: 14, color: C.textDim, background: 'transparent', border: `1px solid ${C.cardBorder}`, borderRadius: 12, cursor: 'pointer', marginTop: 8 }}>
              ← 이전 질문
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const tabs = [
      { id: 'profile', label: '📊 프로필', icon: '📊' },
      { id: 'action', label: '🎯 액션', icon: '🎯' },
      { id: 'mentor', label: '🤝 멘토링', icon: '🤝' },
    ];

    return (
      <div ref={topRef} style={{ minHeight: '100vh', background: C.bg, padding: '30px 20px 100px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {/* 헤더 */}
          <Card style={{ textAlign: 'center', background: `linear-gradient(135deg, ${C.card} 0%, #1a1a3a 100%)` }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{result.emoji}</div>
            <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, marginBottom: 6 }}>{result.code}</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>{result.title}</h1>
            <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.7 }}>{result.desc}</p>
            <ShareButtons typeCode={result.code} typeTitle={result.title} emoji={result.emoji} />
          </Card>

          {/* 레이더 차트 */}
          <Card style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart scores={result.scores} />
          </Card>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, padding: '12px 8px', fontSize: 13, fontWeight: 600, color: activeTab === tab.id ? '#fff' : C.textDim, background: activeTab === tab.id ? C.accent : C.card, border: `1px solid ${activeTab === tab.id ? C.accent : C.cardBorder}`, borderRadius: 10, cursor: 'pointer' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 내용 */}
          {activeTab === 'profile' && (
            <>
              <Card>
                <SectionTitle icon="💪" color={C.accent3}>강점</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{result.strengths.map((s, i) => <Tag key={i} color={C.accent3}>{s}</Tag>)}</div>
              </Card>
              <Card>
                <SectionTitle icon="⚠️" color="#f59e0b">주의점</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{result.weaknesses.map((w, i) => <Tag key={i} color="#f59e0b">{w}</Tag>)}</div>
              </Card>
              <Card>
                <SectionTitle icon="📖" color={C.accent}>학습 스타일</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.studyStyle}</p>
              </Card>
              <Card>
                <SectionTitle icon="✅" color={C.accent3}>추천 학습법</SectionTitle>
                {result.bestMethods.map((m, i) => <ListItem key={i} icon="✓" color={C.accent3}>{m}</ListItem>)}
              </Card>
              <Card>
                <SectionTitle icon="❌" color="#ef4444">피해야 할 것</SectionTitle>
                {result.avoidMethods.map((m, i) => <ListItem key={i} icon="✗" color="#ef4444">{m}</ListItem>)}
              </Card>
              <Card>
                <SectionTitle icon="📚" color={C.accent}>추천 도서</SectionTitle>
                {result.recommendedBooks.map((b, i) => <ListItem key={i} icon="📖">{b}</ListItem>)}
              </Card>
            </>
          )}

          {activeTab === 'action' && (
            <>
              <Card style={{ background: `linear-gradient(135deg, ${C.accent}15 0%, ${C.accent2}15 100%)`, border: `1px solid ${C.accent}40` }}>
                <SectionTitle icon="🚀" color={C.accent}>이번 주 할 일</SectionTitle>
                {result.thisWeekActions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, padding: '12px', background: C.card, borderRadius: 10, border: `1px solid ${C.cardBorder}` }}>
                    <span style={{ fontSize: 18 }}>☐</span>
                    <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{a}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionTitle icon="🔥" color={C.accent2}>30일 챌린지</SectionTitle>
                <div style={{ padding: '16px', background: `${C.accent2}10`, borderRadius: 12, border: `1px solid ${C.accent2}30` }}>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0 }}>{result.thirtyDayChallenge}</p>
                </div>
              </Card>
              <Card>
                <SectionTitle icon="☀️" color="#f59e0b">매일 습관</SectionTitle>
                <div style={{ padding: '16px', background: '#f59e0b10', borderRadius: 12, border: '1px solid #f59e0b30' }}>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0 }}>{result.dailyHabit}</p>
                </div>
              </Card>
              <Card>
                <SectionTitle icon="🚨" color="#ef4444">슬럼프 신호</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, marginBottom: 16 }}>{result.slumpSign}</p>
                <SectionTitle icon="💡" color={C.accent3}>회복 방법</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.slumpRecovery}</p>
              </Card>
              <Card>
                <SectionTitle icon="💬" color={C.accent}>커뮤니티 팁</SectionTitle>
                <div style={{ padding: '16px', background: `${C.accent}10`, borderRadius: 12, border: `1px solid ${C.accent}30` }}>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0 }}>{result.communityTip}</p>
                </div>
              </Card>
              <Card>
                <SectionTitle icon="🛤️" color={C.accent}>성장 경로</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.growthPath}</p>
              </Card>
            </>
          )}

          {activeTab === 'mentor' && (
            <>
              <Card>
                <SectionTitle icon="👤" color={C.accent}>이상적인 멘토</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.idealMentor}</p>
              </Card>
              <Card>
                <SectionTitle icon="📝" color={C.accent2}>멘토에게 요청할 것</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.mentorRequest}</p>
              </Card>
              <Card>
                <SectionTitle icon="🎯" color={C.accent}>추천 멘토링 스타일</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, marginBottom: 12 }}>{result.mentoringStyle}</p>
                <div style={{ padding: '12px', background: C.dark, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: C.textMute, marginBottom: 6 }}>세션 형식</div>
                  <div style={{ fontSize: 13, color: C.text }}>{result.sessionFormat}</div>
                </div>
              </Card>
              <Card>
                <SectionTitle icon="📅" color={C.accent3}>주간 루틴 추천</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.weeklyRoutine}</p>
              </Card>
              <Card>
                <SectionTitle icon="✅" color={C.accent3}>멘토가 해야 할 것</SectionTitle>
                {result.doList.map((d, i) => <ListItem key={i} icon="✓" color={C.accent3}>{d}</ListItem>)}
              </Card>
              <Card>
                <SectionTitle icon="🚫" color="#ef4444">멘토가 피해야 할 것</SectionTitle>
                {result.dontList.map((d, i) => <ListItem key={i} icon="✗" color="#ef4444">{d}</ListItem>)}
              </Card>
              <Card>
                <SectionTitle icon="🆘" color="#f59e0b">위기 신호</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, marginBottom: 12 }}>{result.crisisSignal}</p>
                <SectionTitle icon="🔧" color={C.accent3}>회복 전략</SectionTitle>
                <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{result.recoveryStrategy}</p>
              </Card>
            </>
          )}

          {/* 하단 버튼 */}
          <div style={{ marginTop: 24 }}>
            <button onClick={() => { setPhase('intro'); setCurrentQ(0); setAnswers({}); setDimScores([0,0,0,0,0]); setResult(null); scrollTop(); }}
              style={{ width: '100%', padding: '16px', fontSize: 15, fontWeight: 600, color: '#fff', background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, border: 'none', borderRadius: 14, cursor: 'pointer', marginBottom: 10 }}>
              다시 진단하기
            </button>
            <a href="/types"
              style={{ display: 'block', width: '100%', padding: '14px', fontSize: 14, fontWeight: 600, color: C.accent, background: `${C.accent}12`, border: `1px solid ${C.accent}40`, borderRadius: 14, cursor: 'pointer', marginBottom: 10, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
              📖 32가지 유형 전체 보기
            </a>
            <button onClick={onBack}
              style={{ width: '100%', padding: '14px', fontSize: 14, fontWeight: 500, color: C.textDim, background: 'transparent', border: `1px solid ${C.cardBorder}`, borderRadius: 14, cursor: 'pointer' }}>
              ← 처음으로
            </button>
          </div>
          
          {submitting && (
            <div style={{ textAlign: 'center', marginTop: 16, color: C.textMute, fontSize: 12 }}>
              결과 저장 중...
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
