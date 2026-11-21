import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * 이음수첩 심볼 (확정안 1-B 채운 얼굴): 웃는 얼굴과 QR 무늬가 있는 하트 수첩.
 * 원본 파일: public/brand/ieum-symbol.svg, 생성 스크립트: 저장소 밖 ieum-logo/scripts/export_brand.py
 *
 * - 본체 색은 currentColor라 기본으로 text-primary(라이트 #005FC7, 다크 #52A5FF)를 따른다.
 * - 얼굴 표정과 QR 무늬 같은 뚫린 부분은 --logo-paper(기본: --background) 색으로 칠한다.
 *   카드처럼 배경이 다른 곳에 놓을 때는 [--logo-paper:var(--card)]처럼 바꿔 준다.
 * - 장식용이므로 기본 aria-hidden. 로고만 단독으로 쓸 때는 aria-label을 넘긴다.
 */
export function LogoSymbol({ className, "aria-label": label, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="15 7 66 80"
      className={cn("h-8 w-auto shrink-0 text-primary", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...props}
    >
      <g transform="translate(0 -2)">
      <circle cx="48" cy="24" r="14" fill="currentColor"/>
      <circle cx="42.5" cy="21" r="2.4" fill="var(--logo-paper, var(--background))"/>
      <circle cx="53.5" cy="21" r="2.4" fill="var(--logo-paper, var(--background))"/>
      <path d="M41 27.5 C43.5 33.5 52.5 33.5 55 27.5" fill="none" stroke="var(--logo-paper, var(--background))" strokeWidth="3" strokeLinecap="round"/></g><g transform="translate(48 86) scale(.9) translate(-48 -86)">
      <path d="M45.5 39 C38 31 14 29 13 49 C12 63 28 74 45.5 86 Z" fill="currentColor"/>
      <path d="M50.5 39 C58 31 82 29 83 49 C84 63 68 74 50.5 86 Z" fill="currentColor"/>
      <rect x="19.3" y="42.3" width="9.4" height="9.4" rx="2.6" fill="none" stroke="var(--logo-paper, var(--background))" strokeWidth="2.6"/>
      <circle cx="24" cy="47" r="1.9" fill="var(--logo-paper, var(--background))"/>
      <rect x="32" y="42" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="37" y="47" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="32" y="52" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="21.5" y="57" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="27" y="57" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="37" y="57" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="27" y="62.5" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/><rect x="32" y="62.5" width="4" height="4" rx="1" fill="var(--logo-paper, var(--background))"/></g>
    </svg>
  );
}

/** 심볼과 "이음수첩" 글자. 글자는 실제 텍스트라 화면 낭독기와 확대에 그대로 대응한다. */
export function Logo({ className, symbolClassName }: { className?: string; symbolClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <LogoSymbol className={symbolClassName} />
      <span>이음수첩</span>
    </span>
  );
}
