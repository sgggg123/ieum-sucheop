import Link from "next/link";

import { legalContact, legalLinks } from "@/lib/legal-config";
import styles from "./legal.module.css";

export function LegalFooter() {
  return (
    <footer className={styles.footer}>
      <p>이음수첩 예시 체험</p>
      <nav aria-label="이용약관 및 개인정보 안내">
        {legalLinks.map(({ href, label }) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <a href={`mailto:${legalContact}`}>문의: {legalContact}</a>
      <p>© 2026 이음수첩 및 각 권리자.</p>
    </footer>
  );
}
