import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { legalDocuments } from "@/lib/legal-documents";
import { LicenseNotices } from "@/components/legal/license-notices";

const document = legalDocuments["licenses"];

export const metadata: Metadata = {
  title: `${document.title} | 이음수첩`,
  description: document.description,
};

export default function Page() {
  return <LegalDocumentPage document={document}><LicenseNotices /></LegalDocumentPage>;
}
