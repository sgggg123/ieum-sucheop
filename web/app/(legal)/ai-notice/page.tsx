import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { legalDocuments } from "@/lib/legal-documents";

const document = legalDocuments["ai-notice"];

export const metadata: Metadata = {
  title: `${document.title} | 이음수첩`,
  description: document.description,
};

export default function Page() {
  return <LegalDocumentPage document={document} />;
}
