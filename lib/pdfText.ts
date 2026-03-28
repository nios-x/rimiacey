import "@/lib/canvasGlobals";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Run pdf.js in-process (no worker) to avoid fetching a separate worker bundle in serverless.
pdfjsLib.GlobalWorkerOptions.workerSrc = undefined as any;

export async function extractPdfText(buffer: Uint8Array): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: buffer,
    disableWorker: true,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  const doc = await loadingTask.promise;
  const lines: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    lines.push(pageText);
    page.cleanup();
  }

  await doc.cleanup();
  return lines.join("\n");
}

export async function extractPdfPageRange(
  buffer: Uint8Array,
  startPage: number,
  endPage?: number
): Promise<{ totalPages: number; pages: { page: number; text: string }[] }> {
  const loadingTask = pdfjsLib.getDocument({
    data: buffer,
    disableWorker: true,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  const doc = await loadingTask.promise;
  const totalPages = doc.numPages;

  const start = Math.max(1, Math.min(startPage, totalPages));
  const end = Math.max(start, Math.min(endPage ?? startPage, totalPages));

  const pages: { page: number; text: string }[] = [];

  for (let i = start; i <= end; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push({ page: i, text: pageText });
    page.cleanup();
  }

  await doc.cleanup();
  return { totalPages, pages };
}
