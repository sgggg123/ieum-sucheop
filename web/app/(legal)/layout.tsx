import Link from "next/link";
import type { ReactNode } from "react";

import { LegalFooter } from "@/components/legal/legal-footer";
import { Logo } from "@/components/logo";
import styles from "@/components/legal/legal.module.css";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="이음수첩 홈으로"><Logo /></Link>
        <Link href="/">홈으로</Link>
      </header>
      <main id="main-content" tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <div className={styles.footerContainer}><LegalFooter /></div>
    </div>
  );
}
