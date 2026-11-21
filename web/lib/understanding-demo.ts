// UI 체험용 가상 인수인계서. 실제 건강정보나 승인 기록이 아니다.
export type DemoAnswer = {
  label: string;
  text: string;
  covered: string[];
};

export type UnderstandingTopic = {
  id: string;
  title: string;
  category: string;
  question: string;
  introduction: string;
  quote: string;
  checkedAt: string;
  points: { id: string; label: string; quote: string }[];
  examples: DemoAnswer[];
};

export const understandingTopics: UnderstandingTopic[] = [
  {
    id: "walk",
    title: "산책 준비",
    category: "일과",
    question: "산책을 나갈 때 어떻게 준비하시겠어요?",
    introduction: "나가기 전에 챙길 것과 함께할 사람을 확인해요.",
    quote: "산책할 때는 현관 옆 지팡이를 챙기고, 꼭 함께 나가 주세요.",
    checkedAt: "11월 18일",
    points: [
      { id: "cane", label: "현관 옆 지팡이 챙기기", quote: "현관 옆 지팡이를 챙기고" },
      { id: "together", label: "혼자 보내지 않고 함께 나가기", quote: "꼭 함께 나가 주세요" },
    ],
    examples: [
      { label: "일부만 설명", text: "현관 옆 지팡이를 챙겨 드릴게요.", covered: ["cane"] },
      { label: "모두 설명", text: "현관 옆 지팡이를 챙기고 제가 함께 나갈게요.", covered: ["cane", "together"] },
      { label: "잘 모르겠어요", text: "어떻게 준비해야 할지 잘 모르겠어요.", covered: [] },
    ],
  },
  {
    id: "conversation",
    title: "대화 시작",
    category: "의사소통",
    question: "말을 걸 때 어떻게 이야기하시겠어요?",
    introduction: "익숙하고 편안한 대화 방법을 함께 확인해요.",
    quote: "앞에서 눈을 맞추고, 한 번에 한 문장씩 천천히 말해 주세요.",
    checkedAt: "11월 18일",
    points: [
      { id: "eye-contact", label: "앞에서 눈을 맞추기", quote: "앞에서 눈을 맞추고" },
      { id: "slowly", label: "한 문장씩 천천히 말하기", quote: "한 번에 한 문장씩 천천히 말해 주세요" },
    ],
    examples: [
      { label: "일부만 설명", text: "앞에서 눈을 맞추고 이야기할게요.", covered: ["eye-contact"] },
      { label: "모두 설명", text: "앞에서 눈을 맞추고 한 문장씩 천천히 이야기할게요.", covered: ["eye-contact", "slowly"] },
      { label: "잘 모르겠어요", text: "어떻게 말을 걸어야 할지 잘 모르겠어요.", covered: [] },
    ],
  },
];

export type DemoFeedback = {
  kind: "complete" | "partial" | "unverified";
  covered: string[];
};

function normalize(text: string) {
  return text.normalize("NFC").replace(/[\s.,!?。！？]/g, "");
}

// 의미 분석을 흉내 내는 키워드 채점 대신, 준비된 예시에만 체험 결과를 제공한다.
// 자유 답변은 AI 연결 전까지 확인 불가로 남긴다. 부정문도 일치로 추정하지 않는다.
export function compareDemoAnswer(topic: UnderstandingTopic, answer: string): DemoFeedback {
  const example = topic.examples.find((item) => normalize(item.text) === normalize(answer));
  if (!example || example.covered.length === 0) return { kind: "unverified", covered: [] };
  return {
    kind: example.covered.length === topic.points.length ? "complete" : "partial",
    covered: example.covered,
  };
}
