'use client';

import { useState } from 'react';
import Quiz from '@/components/Quiz';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<'mentor' | 'mentee' | null>(null);

  if (selectedRole) {
    return <Quiz role={selectedRole} onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        maxWidth: 540,
        width: '100%',
        textAlign: 'center',
        animation: 'fadeIn 0.6s ease',
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🧬</div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          margin: '0 0 8px',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.3,
        }}>
          학습 유형 진단
        </h1>
        <p style={{ color: '#8888aa', fontSize: 14, margin: '0 0 32px' }}>
          32가지 유형으로 알아보는 나만의 학습 스타일
        </p>

        <div style={{
          background: '#111127',
          borderRadius: 20,
          padding: '32px 24px',
          border: '1px solid #1c1c3a',
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#e0e0f0',
            marginBottom: 24,
          }}>
            어떤 버전으로 진단할까요?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => setSelectedRole('mentee')}
              style={{
                padding: '20px 24px',
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                border: 'none',
                borderRadius: 14,
                textAlign: 'left',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 32px #6366f144';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🎓</span>
                <div>
                  <div style={{ marginBottom: 4 }}>멘티용 진단</div>
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>
                    나의 학습 스타일과 성장 전략 알아보기
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('mentor')}
              style={{
                padding: '20px 24px',
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: 14,
                textAlign: 'left',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 32px #10b98144';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>👨‍🏫</span>
                <div>
                  <div style={{ marginBottom: 4 }}>멘토용 진단</div>
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>
                    멘티 유형별 맞춤 지도 전략 알아보기
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div style={{
          background: '#111127',
          borderRadius: 16,
          padding: '20px',
          border: '1px solid #1c1c3a',
        }}>
          <div style={{ fontSize: 12, color: '#8888aa', marginBottom: 12 }}>
            5가지 차원 × 2가지 성향 = <strong style={{ color: '#6366f1' }}>32가지 고유 유형</strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[
              { name: '학습방식', poles: 'T↔P' },
              { name: '진행속도', poles: 'F↔S' },
              { name: '동기부여', poles: 'I↔E' },
              { name: '문제해결', poles: 'A↔C' },
              { name: '성장방향', poles: 'D↔W' },
            ].map((dim, i) => (
              <span key={i} style={{
                padding: '6px 12px',
                background: '#1a1a35',
                borderRadius: 8,
                fontSize: 11,
                color: '#aaaacc',
              }}>
                {dim.name} <span style={{ color: '#6366f1' }}>{dim.poles}</span>
              </span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#555566', marginTop: 16 }}>
          15개 질문 · 약 3분 소요
        </p>
      </div>
    </div>
  );
}
