'use client';

import { useState } from 'react';
import Link from 'next/link';
import Quiz from '@/components/Quiz';

const MENTOR_PASSWORD = 'mentor2024'; // 멘토용 비밀번호 (환경변수로 옮길 수 있음)

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<'mentor' | 'mentee' | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [menteeName, setMenteeName] = useState('');
  const [nameError, setNameError] = useState(false);

  const handleMentorClick = () => {
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError(false);
  };

  const handleMenteeClick = () => {
    setShowNameInput(true);
    setMenteeName('');
    setNameError(false);
  };

  const handlePasswordSubmit = () => {
    if (password === MENTOR_PASSWORD) {
      setShowPasswordModal(false);
      setSelectedRole('mentor');
    } else {
      setPasswordError(true);
    }
  };

  const handleNameSubmit = () => {
    if (menteeName.trim().length >= 2) {
      setShowNameInput(false);
      setSelectedRole('mentee');
    } else {
      setNameError(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'password' | 'name') => {
    if (e.key === 'Enter') {
      if (type === 'password') handlePasswordSubmit();
      else handleNameSubmit();
    }
  };

  if (selectedRole) {
    return (
      <Quiz 
        role={selectedRole} 
        menteeName={selectedRole === 'mentee' ? menteeName : undefined} 
        onBack={() => { 
          setSelectedRole(null); 
          setMenteeName(''); 
          setShowNameInput(false);
        }} 
      />
    );
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
      {/* 비밀번호 모달 */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}>
          <div style={{
            background: '#111127',
            borderRadius: 20,
            padding: '32px 24px',
            border: '1px solid #1c1c3a',
            maxWidth: 400,
            width: '100%',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🔐</div>
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#e0e0f0',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              멘토 전용
            </h2>
            <p style={{
              fontSize: 13,
              color: '#8888aa',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              멘토용 진단은 비밀번호가 필요합니다
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
              onKeyPress={(e) => handleKeyPress(e, 'password')}
              placeholder="비밀번호 입력"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 15,
                background: '#0d0d1a',
                border: `2px solid ${passwordError ? '#ef4444' : '#2a2a4a'}`,
                borderRadius: 12,
                color: '#e0e0f0',
                outline: 'none',
                marginBottom: 8,
                boxSizing: 'border-box',
              }}
            />
            {passwordError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 16 }}>
                비밀번호가 올바르지 않습니다
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#8888aa',
                  background: 'transparent',
                  border: '1px solid #2a2a4a',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handlePasswordSubmit}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이름 입력 모달 */}
      {showNameInput && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}>
          <div style={{
            background: '#111127',
            borderRadius: 20,
            padding: '32px 24px',
            border: '1px solid #1c1c3a',
            maxWidth: 400,
            width: '100%',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>👋</div>
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#e0e0f0',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              반갑습니다!
            </h2>
            <p style={{
              fontSize: 13,
              color: '#8888aa',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              진단을 시작하기 전에 이름을 알려주세요
            </p>
            <input
              type="text"
              value={menteeName}
              onChange={(e) => { setMenteeName(e.target.value); setNameError(false); }}
              onKeyPress={(e) => handleKeyPress(e, 'name')}
              placeholder="이름 입력 (2자 이상)"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 15,
                background: '#0d0d1a',
                border: `2px solid ${nameError ? '#ef4444' : '#2a2a4a'}`,
                borderRadius: 12,
                color: '#e0e0f0',
                outline: 'none',
                marginBottom: 8,
                boxSizing: 'border-box',
              }}
            />
            {nameError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 16 }}>
                이름을 2자 이상 입력해주세요
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={() => setShowNameInput(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#8888aa',
                  background: 'transparent',
                  border: '1px solid #2a2a4a',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handleNameSubmit}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}

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
              onClick={handleMenteeClick}
              style={{
                padding: '20px 24px',
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                border: 'none',
                borderRadius: 14,
                textAlign: 'left',
                cursor: 'pointer',
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
              onClick={handleMentorClick}
              style={{
                padding: '20px 24px',
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: 14,
                textAlign: 'left',
                cursor: 'pointer',
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
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    멘토용 진단
                    <span style={{ fontSize: 10, background: '#ffffff22', padding: '2px 6px', borderRadius: 4 }}>🔐</span>
                  </div>
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

        <Link href="/types" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 16,
          padding: '10px 18px',
          fontSize: 13,
          fontWeight: 600,
          color: '#8888aa',
          background: '#111127',
          border: '1px solid #1c1c3a',
          borderRadius: 10,
          textDecoration: 'none',
          transition: 'border-color 0.2s, color 0.2s',
        }}
          onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6366f160'; (e.currentTarget as HTMLElement).style.color = '#e0e0f0'; }}
          onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1c1c3a'; (e.currentTarget as HTMLElement).style.color = '#8888aa'; }}
        >
          📖 32가지 유형 전체 보기
        </Link>
      </div>
    </div>
  );
}
