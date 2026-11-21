import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata: Metadata = {
  title: "이음수첩",
  description: "말과 사진으로 쌓고 QR로 넘기는 AI 돌봄 인수인계서",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes가 html 클래스(light/dark)를 바꾸므로 hydration 경고를 막는다.
    <html lang="ko" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* KWCAG 2.2 6.4.1: 페이지 맨 앞의 본문 바로가기. 키보드 초점을 받으면 화면에 보인다. */}
        {/* 숨김 처리는 감싸는 div가 맡는다. Button 자체의 relative와 sr-only가 충돌하면 링크가 높이를 차지한다. */}
        <div className="sr-only focus-within:not-sr-only focus-within:fixed! focus-within:top-4 focus-within:left-4 focus-within:z-50">
          <Button asChild size="sm">
            <a href="#main-content">본문 바로가기</a>
          </Button>
        </div>
        {/* KWCAG 2.2 6.1.4: 끌 수 없는 단일 문자 단축키("d")를 쓰지 않는다. */}
        <ThemeProvider enableHotkey={false}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
