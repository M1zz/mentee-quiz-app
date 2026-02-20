'use client';

import { useState } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0a0a16', card: '#111127', cardBorder: '#1c1c3a',
  accent: '#6366f1', accent2: '#ec4899', accent3: '#10b981',
  text: '#e0e0f0', textDim: '#8888aa', textMute: '#555566', dark: '#0d0d1a',
};

interface TypeEntry {
  code: string;
  emoji: string;
  title: string;
  desc: string;
  strengths: string[];
  weaknesses: string[];
}

const ALL_TYPES: TypeEntry[] = [
  { code: 'TFIAD', emoji: '🔬', title: '심층 연구자', desc: '이론과 원리를 깊이 파고드는 학자형. 혼자서 한 분야를 완벽하게 이해하려 합니다.', strengths: ['깊은 기술 이해력', '자기주도 학습', '원리 파악 속도', '꾸준한 내적 동기'], weaknesses: ['실전 적용 지연', '완벽주의', '협업 경험 부족', '이론 매몰 위험'] },
  { code: 'TFIAW', emoji: '📚', title: '이론 탐험가', desc: '다양한 분야의 이론을 섭렵하는 지식 수집가. 호기심이 넓고 새로운 개념을 빠르게 흡수합니다.', strengths: ['폭넓은 기술 이해', '자기주도 학습', '빠른 개념 흡수', '다양한 관점'], weaknesses: ['깊이 부족', '관심사 자주 변경', '실전 경험 부족'] },
  { code: 'TFICD', emoji: '🧪', title: '학술 토론가', desc: '이론적 깊이를 추구하면서 동료와의 토론을 통해 성장합니다.', strengths: ['이론을 토론으로 내재화', '그룹 학습 리더십', '다양한 관점 수용'], weaknesses: ['혼자 집중 시간 부족', '토론에만 시간 과다'] },
  { code: 'TFICW', emoji: '🌐', title: '지식 네트워커', desc: '넓은 이론적 기반 위에 협업을 통해 지식을 확장합니다.', strengths: ['뛰어난 커뮤니케이션', '넓은 기술 시야', '팀 학습 촉진'], weaknesses: ['깊이 부족', '소통에 시간 과다'] },
  { code: 'TFEAD', emoji: '🎯', title: '전략적 전문가', desc: '명확한 목표를 위해 한 분야를 체계적으로 정복하는 전략가형.', strengths: ['명확한 목표 의식', '체계적 학습', '깊은 전문성', '높은 실행력'], weaknesses: ['유연성 부족', '번아웃 가능성', '학습 즐거움 상실 위험'] },
  { code: 'TFEAW', emoji: '📋', title: '체계적 커리어 빌더', desc: '취업/이직을 위해 다양한 기술을 전략적으로 학습합니다.', strengths: ['전략적 학습', '시장 트렌드 민감성', '다양한 기술 스택'], weaknesses: ['깊이보다 범위', '트렌드에 휘둘림'] },
  { code: 'TFECD', emoji: '🏛️', title: '조직 내 전문가', desc: '팀 환경에서 한 분야의 기술적 권위자가 되길 원합니다.', strengths: ['팀 내 기술 리더십', '지식 공유 능력', '조직 영향력'], weaknesses: ['조직 의존도 높음', '인정욕구에 좌우'] },
  { code: 'TFECW', emoji: '🔗', title: '팀 학습 코디네이터', desc: '외적 목표와 협업을 통해 넓은 기술 지식을 쌓아가는 연결자.', strengths: ['학습 조직 구축', '다양한 기술 연결', '팀 학습 촉진'], weaknesses: ['개인 깊이 부족', '조율에 에너지 과다'] },
  { code: 'TSIAD', emoji: '💎', title: '장인 개발자', desc: '한 분야에서 완벽한 이해를 추구하는 장인형.', strengths: ['높은 이해도', '완벽주의적 장인정신', '깊은 기술 이해'], weaknesses: ['진도가 매우 느림', '과도한 완벽주의', '번아웃 위험'] },
  { code: 'TSIAW', emoji: '🧩', title: '정밀 학습자', desc: '다양한 분야를 꼼꼼하게 하나씩 정복해나가는 체계적 학습자.', strengths: ['체계적 학습', '꼼꼼한 정리력', '높은 완성도'], weaknesses: ['속도가 느림', '우선순위 설정 어려움'] },
  { code: 'TSICD', emoji: '⚙️', title: '품질 관리자', desc: '팀과 함께하면서도 깊이 있는 품질을 추구하는 꼼꼼한 협업자.', strengths: ['팀 내 품질 수호자', '꼼꼼한 코드 리뷰', '깊은 이해 기반 소통'], weaknesses: ['리뷰에 시간 과다', '타인 코드에 과도한 기준'] },
  { code: 'TSICW', emoji: '🔍', title: '꼼꼼한 조율자', desc: '다양한 영역을 정밀하게 파악하면서 팀과 함께 성장하는 유형.', strengths: ['넓은 시야 + 세밀함', '팀 내 다리 역할', '문서화 능력'], weaknesses: ['에너지 분산', '모든 것 완벽 부담', '번아웃 위험'] },
  { code: 'TSEAD', emoji: '🏆', title: '목표 지향 장인', desc: '구체적 목표를 위해 한 분야를 완벽하게 준비하는 준비형 전문가.', strengths: ['목표 달성 의지', '꼼꼼한 준비', '깊은 전문성'], weaknesses: ['과도한 준비로 시작 늦음', '번아웃 고위험'] },
  { code: 'TSEAW', emoji: '📊', title: '전략적 학습 플래너', desc: '목표 달성을 위해 다양한 분야를 체계적으로 준비하는 전략가.', strengths: ['전략적 사고', '체계적 계획', '다양한 기술 습득'], weaknesses: ['과도한 계획에 시간 소모', '행동보다 계획'] },
  { code: 'TSECD', emoji: '👔', title: '팀 전문가 지향형', desc: '조직 내에서 인정받기 위해 한 분야를 정밀하게 파는 유형.', strengths: ['조직 내 전문성 구축', '팀 기여 의지', '꼼꼼한 업무 처리'], weaknesses: ['조직 의존도 높음', '변화에 느린 대응'] },
  { code: 'TSECW', emoji: '🎪', title: '체계적 팀 플레이어', desc: '팀 목표를 위해 다양한 역할을 꼼꼼하게 수행하는 만능 지원군.', strengths: ['다재다능함', '팀 지향적', '꼼꼼한 업무', '높은 책임감'], weaknesses: ['자기 전문성 부재 위험', '남의 일만 도움', '번아웃 고위험'] },
  { code: 'PFIAD', emoji: '🚀', title: '스피드 해커', desc: '빠르게 실험하고 깊이 파고드는 실전형 해커.', strengths: ['빠른 프로토타이핑', '깊은 실전 경험', '문제 해결 속도'], weaknesses: ['코드 품질 경시', '문서화 부족', '기초 이론 약함'] },
  { code: 'PFIAW', emoji: '🎨', title: '크리에이티브 메이커', desc: '다양한 것을 빠르게 만들어보는 창작형. 아이디어가 풍부합니다.', strengths: ['높은 창작 에너지', '다양한 실전 경험', '빠른 학습 속도'], weaknesses: ['완성도 부족', '깊이 없는 다작', '흥미 감소 시 포기'] },
  { code: 'PFICD', emoji: '⚡', title: '페어 프로그래머', desc: '동료와 함께 빠르게 깊이 있는 기능을 구현하는 실전 협업가.', strengths: ['실시간 협업 능력', '빠른 기능 구현', '깊은 기술 토론'], weaknesses: ['혼자 일하기 어려움', '의존적 학습 패턴'] },
  { code: 'PFICW', emoji: '🌈', title: '오픈소스 기여자', desc: '다양한 프로젝트에 빠르게 기여하며 커뮤니티와 함께 성장.', strengths: ['오픈소스 마인드', '다양한 코드베이스 경험', '커뮤니티 기여 정신'], weaknesses: ['깊이 부족', '자기 프로젝트 부재'] },
  { code: 'PFEAD', emoji: '💰', title: '스타트업 빌더', desc: '시장 가치 있는 제품을 빠르게 깊이 있게 만드는 사업가형 개발자.', strengths: ['제품 감각', '빠른 실행력', '시장 지향적 개발'], weaknesses: ['수익 집착', '코드 품질 경시', '번아웃 위험'] },
  { code: 'PFEAW', emoji: '🔥', title: '풀스택 스프린터', desc: '목표를 위해 다양한 기술을 빠르게 실전 적용하는 행동파.', strengths: ['빠른 풀스택 개발', '다양한 기술 적용', '높은 생산성'], weaknesses: ['각 기술 깊이 부족', '코드 품질 문제'] },
  { code: 'PFECD', emoji: '🎖️', title: '팀 에이스', desc: '팀 성과를 위해 핵심 기능을 빠르게 구현하는 실전 전문가.', strengths: ['팀 내 핵심 구현력', '빠른 기능 개발', '성과 가시화'], weaknesses: ['팀 의존적 동기', '개인 프로젝트 부족'] },
  { code: 'PFECW', emoji: '🌟', title: '만능 해결사', desc: '팀의 다양한 문제를 빠르게 실전으로 해결하는 멀티 플레이어.', strengths: ['문제 해결 속도', '다양한 기술 활용', '팀 기여도 높음'], weaknesses: ['전문성 부재 위험', '항상 급한 일만 처리'] },
  { code: 'PSIAD', emoji: '🏗️', title: '아키텍트', desc: '실전에서 한 분야의 완벽한 구조를 만드는 건축가형.', strengths: ['뛰어난 설계 능력', '높은 코드 품질', '깊은 실전 지식'], weaknesses: ['과도한 설계', '속도 느림'] },
  { code: 'PSIAW', emoji: '🛠️', title: '꼼꼼한 메이커', desc: '다양한 것을 높은 완성도로 만드는 정밀 제작자.', strengths: ['높은 완성도', '다양한 기술 경험', '디테일 감각'], weaknesses: ['속도가 느림', '완성까지 시간 과다'] },
  { code: 'PSICD', emoji: '🤝', title: '신중한 협업자', desc: '팀과 함께 깊이 있는 실전 경험을 꼼꼼하게 쌓아가는 유형.', strengths: ['신뢰받는 팀원', '꼼꼼한 구현', '안정적 기여'], weaknesses: ['의사결정 느림', '리스크 회피', '변화에 보수적'] },
  { code: 'PSICW', emoji: '🧰', title: '만능 장인', desc: '다양한 분야를 실전에서 꼼꼼하게 익히며 팀과 함께 성장.', strengths: ['다재다능 + 꼼꼼함', '팀 내 안정적 기여', '높은 완성도'], weaknesses: ['속도 느림', '에너지 분산', '전문성 부재 위험'] },
  { code: 'PSEAD', emoji: '🎯', title: '실전 스페셜리스트', desc: '목표를 위해 한 분야의 실전 능력을 완벽하게 갈고닦는 전문가.', strengths: ['목표 지향 + 깊은 실전력', '높은 완성도', '전문가 수준'], weaknesses: ['유연성 부족', '과도한 완벽주의', '번아웃 고위험'] },
  { code: 'PSEAW', emoji: '📈', title: '커리어 빌더', desc: '취업/이직을 위해 다양한 실전 경험을 꼼꼼하게 준비하는 유형.', strengths: ['전략적 준비', '다양한 실전 경험', '높은 완성도'], weaknesses: ['준비 기간 길어짐', '스펙 쌓기 매몰 위험'] },
  { code: 'PSECD', emoji: '🏢', title: '조직 핵심 인재', desc: '팀 내에서 실전 전문가로 인정받기 위해 꼼꼼하게 실력을 쌓는 유형.', strengths: ['조직 내 신뢰도', '꼼꼼한 업무 처리', '깊은 실전력'], weaknesses: ['조직 밖 자신감 부족', '변화에 보수적', '자기 PR 부족'] },
  { code: 'PSECW', emoji: '🌍', title: '올라운드 프로', desc: '팀의 다양한 니즈를 실전에서 꼼꼼하게 충족시키는 만능 프로.', strengths: ['다재다능 + 높은 완성도', '팀 내 핵심 인력', '다양한 기술 커버'], weaknesses: ['전문성 부재 위험', '과부하', '커리어 방향 모호'] },
];

const DIMS = [
  { pos: 0, left: { code: 'T', label: '이론형', color: '#6366f1' }, right: { code: 'P', label: '실전형', color: '#f59e0b' } },
  { pos: 1, left: { code: 'F', label: '신속형', color: '#ef4444' }, right: { code: 'S', label: '정밀형', color: '#10b981' } },
  { pos: 2, left: { code: 'I', label: '내적동기', color: '#8b5cf6' }, right: { code: 'E', label: '외적동기', color: '#ec4899' } },
  { pos: 3, left: { code: 'A', label: '독립형', color: '#0ea5e9' }, right: { code: 'C', label: '협력형', color: '#f97316' } },
  { pos: 4, left: { code: 'D', label: '깊이', color: '#14b8a6' }, right: { code: 'W', label: '넓이', color: '#e11d48' } },
];

const DIM_NAMES = ['학습방식', '진행속도', '동기부여', '문제해결', '성장방향'];

function getFilterColor(letter: string): string {
  const map: Record<string, string> = {
    T: '#6366f1', P: '#f59e0b',
    F: '#ef4444', S: '#10b981',
    I: '#8b5cf6', E: '#ec4899',
    A: '#0ea5e9', C: '#f97316',
    D: '#14b8a6', W: '#e11d48',
  };
  return map[letter] ?? C.accent;
}

function CodeBadge({ code }: { code: string }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {code.split('').map((letter, i) => {
        const color = getFilterColor(letter);
        return (
          <span key={i} style={{
            display: 'inline-block',
            padding: '2px 6px',
            background: `${color}20`,
            color,
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}>{letter}</span>
        );
      })}
    </div>
  );
}

function TypeCard({ type }: { type: TypeEntry }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        background: C.card,
        border: `1px solid ${expanded ? C.accent + '60' : C.cardBorder}`,
        borderRadius: 16,
        padding: '18px 16px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
        transform: expanded ? 'scale(1.01)' : 'scale(1)',
        boxShadow: expanded ? `0 4px 24px ${C.accent}20` : 'none',
      }}
      onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.borderColor = C.accent + '40'; }}
      onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.borderColor = C.cardBorder; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{type.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{type.title}</span>
            <span style={{ fontSize: 10, color: C.textMute }}>{expanded ? '▲' : '▼'}</span>
          </div>
          <CodeBadge code={type.code} />
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: C.textDim, lineHeight: 1.65, margin: '0 0 0', }}>{type.desc}</p>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop: 14, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent3, marginBottom: 6 }}>✦ 강점</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {type.strengths.map((s, i) => (
                <span key={i} style={{ padding: '3px 9px', background: `${C.accent3}15`, color: C.accent3, borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>✦ 주의점</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {type.weaknesses.map((w, i) => (
                <span key={i} style={{ padding: '3px 9px', background: '#ef444415', color: '#ef4444', borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TypesPage() {
  const [activeFilters, setActiveFilters] = useState<Record<number, string | null>>({
    0: null, 1: null, 2: null, 3: null, 4: null,
  });
  const [search, setSearch] = useState('');

  const toggleFilter = (pos: number, code: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [pos]: prev[pos] === code ? null : code,
    }));
  };

  const filtered = ALL_TYPES.filter(t => {
    const matchFilters = Object.entries(activeFilters).every(([posStr, letter]) => {
      if (!letter) return true;
      return t.code[parseInt(posStr)] === letter;
    });
    const q = search.toLowerCase();
    const matchSearch = !q || t.code.toLowerCase().includes(q) || t.title.includes(q) || t.desc.includes(q);
    return matchFilters && matchSearch;
  });

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      color: C.text,
      fontFamily: "'Pretendard', sans-serif",
      padding: '0 0 60px',
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: `${C.bg}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.cardBorder}`,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: C.textDim,
          fontSize: 13,
          textDecoration: 'none',
          padding: '6px 12px',
          background: C.dark,
          borderRadius: 8,
          border: `1px solid ${C.cardBorder}`,
          flexShrink: 0,
        }}>
          ← 홈
        </Link>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>🧬 32가지 유형 사전</span>
        </div>
        <div style={{ flexShrink: 0, fontSize: 12, color: C.textMute, minWidth: 60, textAlign: 'right' }}>
          {filtered.length} / 32
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 0' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{
            fontSize: 22,
            fontWeight: 800,
            margin: '0 0 8px',
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            학습 유형 전체 보기
          </h1>
          <p style={{ fontSize: 13, color: C.textDim, margin: 0 }}>
            5가지 차원 × 2가지 성향 = <strong style={{ color: C.accent }}>32가지</strong> 고유 유형
          </p>
        </div>

        {/* Dimension guide */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: C.textMute, marginBottom: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            코드 읽는 법 — 예: T F I A D
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DIMS.map((dim, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: C.dark,
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 11,
              }}>
                <span style={{ color: C.textMute, fontWeight: 600 }}>{i + 1}. {DIM_NAMES[i]}</span>
                <span style={{ color: dim.left.color, fontWeight: 700 }}>{dim.left.code}</span>
                <span style={{ color: C.textMute }}>↔</span>
                <span style={{ color: dim.right.color, fontWeight: 700 }}>{dim.right.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.textDim }}>필터</span>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setActiveFilters({ 0: null, 1: null, 2: null, 3: null, 4: null })}
                style={{
                  fontSize: 11,
                  color: C.accent2,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 6px',
                }}
              >
                초기화 ✕
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DIMS.map((dim, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: C.textMute, width: 52, flexShrink: 0 }}>{DIM_NAMES[i]}</span>
                {[dim.left, dim.right].map(({ code, label, color }) => {
                  const active = activeFilters[i] === code;
                  return (
                    <button
                      key={code}
                      onClick={() => toggleFilter(i, code)}
                      style={{
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: active ? '#fff' : color,
                        background: active ? color : `${color}15`,
                        border: `1.5px solid ${active ? color : `${color}40`}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {code} <span style={{ fontWeight: 400, fontSize: 10, opacity: 0.8 }}>{label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.textMute }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="유형 코드, 이름, 특성으로 검색..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              fontSize: 14,
              background: C.card,
              border: `1.5px solid ${search ? C.accent + '80' : C.cardBorder}`,
              borderRadius: 12,
              color: C.text,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: C.textMute, cursor: 'pointer', fontSize: 16,
              }}
            >✕</button>
          )}
        </div>

        {/* Results count */}
        {(activeFilterCount > 0 || search) && (
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 14, textAlign: 'center' }}>
            {filtered.length === 0 ? '조건에 맞는 유형이 없습니다' : `${filtered.length}가지 유형이 검색되었습니다`}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textMute }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔎</div>
            <p style={{ fontSize: 14 }}>조건에 맞는 유형이 없어요</p>
            <button
              onClick={() => { setActiveFilters({ 0: null, 1: null, 2: null, 3: null, 4: null }); setSearch(''); }}
              style={{ marginTop: 12, padding: '10px 20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12,
          }}>
            {filtered.map(t => (
              <TypeCard key={t.code} type={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
