import { readFileSync } from "node:fs";
import path from "node:path";

import packages from "@/lib/legal-licenses.json";
import styles from "./legal.module.css";

// 설치된 라이선스 원문을 빌드 시 페이지에 포함한다. 요청이나 사용자 입력으로 경로를 만들지 않는다.
const notices = packages.map((item) => ({
  ...item,
  originals: item.files.map((file) => ({
    file,
    text: readFileSync(path.join(process.cwd(), "public", "licenses", file), "utf8"),
  })),
}));

export function LicenseNotices() {
  return (
    <section id="license-originals" tabIndex={-1} className={styles.section}>
      <h2>라이선스 원문</h2>
      <p>구성요소를 선택하면 저작권 표시와 라이선스 원문을 읽거나 원문 파일을 열 수 있습니다.</p>
      <div className={styles.notices}>
        {notices.map(({ name, version, license, originals }) => (
          <details key={name}>
            <summary>
              <span>{name}</span>
              <small>{version} / {license}</small>
            </summary>
            {originals.length ? originals.map(({ file, text }) => (
              <div key={file} className={styles.original}>
                <a href={`/licenses/${encodeURIComponent(file)}`}>{file} 원문 파일</a>
                <pre lang="en">{text}</pre>
              </div>
            )) : <p className={styles.original}>설치된 패키지에 별도 원문 파일이 없어 추가 확인이 필요한 항목입니다.</p>}
          </details>
        ))}
      </div>
    </section>
  );
}
