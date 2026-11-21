import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules(*.module.css)는 제외한다. 이 규칙의 as: "*.css"가 모듈 파일까지
        // 일반 CSS로 바꿔 COMPASS 컴포넌트(MobileAppShell, GlassTabBar 등)의
        // 클래스가 사라지는 문제를 막는다. 해당 모듈 파일은 Tailwind 문법을 쓰지 않는다.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
