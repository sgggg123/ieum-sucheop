import type { Metadata } from "next";

import { UnderstandingExperience } from "@/components/care/understanding-experience";

export const metadata: Metadata = {
  title: "인수인계 함께 확인 | 이음수첩",
  description: "보호자가 남긴 생활 안내를 읽고 내 말로 설명해 보는 인수인계 이해 확인 체험",
};

export default function UnderstandingPage() {
  return <UnderstandingExperience />;
}
