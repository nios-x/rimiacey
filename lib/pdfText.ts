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
