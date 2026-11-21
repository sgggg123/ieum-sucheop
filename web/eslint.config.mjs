import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // COMPASS 1.0.17 레지스트리 원본(components/ui)은 수정하지 않으므로
  // 원본에 있는 set-state-in-effect 지적은 경고로만 표시한다. 앱 코드는 그대로 오류.
  {
    files: ["components/ui/**"],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
