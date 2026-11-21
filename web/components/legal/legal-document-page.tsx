import Link from "next/link";
import type { ReactNode } from "react";

import { legalUpdatedAt, legalUpdatedLabel } from "@/lib/legal-config";
import type { LegalDocument } from "@/lib/legal-documents";
import styles from "./legal.module.css";

export function LegalDocumentPage({ document, children }: {
  document: LegalDocument;
  children?: ReactNode;
}) {
  return (
    <article className={styles.document}>
      <header className={styles.documentHeader}>
        <p className={styles.eyebrow}>이음수첩 서비스 안내</p>
        <h1>{document.title}</h1>
        <p className={styles.updated}>
          최종 수정 <time dateTime={legalUpdatedAt}>{legalUpdatedLabel}</time>
        </p>
        <p className={styles.summary}>{document.summary}</p>
      </header>
      <nav aria-label="문서 목차" className={styles.contents}>
        <h2>목차</h2>
        <ul>
          {document.sections.map(({ id, title }) => (
            <li key={id}><a href={`#${id}`}>{title}</a></li>
          ))}
          {children && <li><a href="#license-originals">라이선스 원문</a></li>}
        </ul>
      </nav>
      <div className={styles.sections}>
        {document.sections.map(({ id, title, paragraphs, links }) => (
          <section key={id} id={id} tabIndex={-1} className={styles.section}>
            <h2>{title}</h2>
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {links && <ul className={styles.related}>
              {links.map(({ href, label }) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>}
          </section>
        ))}
        {children}
      </div>
    </article>
  );
}
