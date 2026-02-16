import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '학습 유형 진단 | 32가지 유형으로 알아보는 나만의 스타일',
  description: '5가지 차원으로 분석하는 32가지 학습 유형 진단. 멘토와 멘티 모두를 위한 맞춤 가이드를 제공합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
