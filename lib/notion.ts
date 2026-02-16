import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface QuizResult {
  sessionId: string;
  quizType: 'mentor' | 'mentee';
  menteeName: string;
  typeCode: string;
  typeTitle: string;
  scores: {
    learning: number;    // T(-3~+3)P
    speed: number;       // F(-3~+3)S
    motivation: number;  // I(-3~+3)E
    problem: number;     // A(-3~+3)C
    growth: number;      // D(-3~+3)W
  };
  answers: {
    questionId: number;
    dimension: string;
    choice: -1 | 0 | 1;  // -1: 왼쪽, 0: 중간, 1: 오른쪽
  }[];
  completedAt: string;
  duration: number; // seconds
}

export async function saveQuizResult(result: QuizResult) {
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID not configured');
  }

  // 각 질문별 답변을 문자열로 변환
  const answersText = result.answers
    .map(a => `Q${a.questionId}(${a.dimension}): ${a.choice}`)
    .join(', ');

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      // Title: Session ID (고유 식별자)
      'Session ID': {
        title: [{ text: { content: result.sessionId } }],
      },
      // Rich Text: Mentee Name
      'Name': {
        rich_text: [{ text: { content: result.menteeName || '' } }],
      },
      // Select: Quiz Type
      'Quiz Type': {
        select: { name: result.quizType === 'mentor' ? '멘토용' : '멘티용' },
      },
      // Rich Text: Type Code
      'Type Code': {
        rich_text: [{ text: { content: result.typeCode } }],
      },
      // Rich Text: Type Title
      'Type Title': {
        rich_text: [{ text: { content: result.typeTitle } }],
      },
      // Numbers: Dimension Scores
      'Score L (T↔P)': {
        number: result.scores.learning,
      },
      'Score S (F↔S)': {
        number: result.scores.speed,
      },
      'Score M (I↔E)': {
        number: result.scores.motivation,
      },
      'Score R (A↔C)': {
        number: result.scores.problem,
      },
      'Score G (D↔W)': {
        number: result.scores.growth,
      },
      // Rich Text: All Answers
      'Answers': {
        rich_text: [{ text: { content: answersText.slice(0, 2000) } }],
      },
      // Number: Duration
      'Duration (sec)': {
        number: result.duration,
      },
      // Date: Completed At
      'Completed At': {
        date: { start: result.completedAt },
      },
    },
  });

  return response;
}

// Notion 데이터베이스 스키마 생성용 (참고용)
export const DATABASE_SCHEMA = `
Notion 데이터베이스에 다음 속성들을 만드세요:

| 속성 이름 | 타입 | 설명 |
|----------|------|------|
| Session ID | Title (제목) | 고유 식별자 (UUID) |
| Name | Text | 멘티 이름 |
| Quiz Type | Select | 멘토용 / 멘티용 |
| Type Code | Text | 예: TFIAD |
| Type Title | Text | 예: 심층 연구자 |
| Score L (T↔P) | Number | -3 ~ +3 |
| Score S (F↔S) | Number | -3 ~ +3 |
| Score M (I↔E) | Number | -3 ~ +3 |
| Score R (A↔C) | Number | -3 ~ +3 |
| Score G (D↔W) | Number | -3 ~ +3 |
| Answers | Text | 각 질문별 답변 |
| Duration (sec) | Number | 소요 시간 (초) |
| Completed At | Date | 완료 일시 |
`;
