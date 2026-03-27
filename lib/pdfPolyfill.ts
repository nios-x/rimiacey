// Ensures pdfjs-dist (used by pdf-parse) has the browser globals it expects when
// running inside Next.js API routes on Node. Without these, pdfjs will throw
// `ReferenceError: DOMMatrix is not defined` at runtime.
import { DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import { GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs";

declare global {
  // eslint-disable-next-line no-var
  var DOMMatrix: typeof DOMMatrix | undefined;
  // eslint-disable-next-line no-var
  var ImageData: typeof ImageData | undefined;
  // eslint-disable-next-line no-var
  var Path2D: typeof Path2D | undefined;
}

if (!globalThis.DOMMatrix) {
  globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix;
}

if (!globalThis.ImageData) {
  globalThis.ImageData = ImageData as unknown as typeof globalThis.ImageData;
}

if (!globalThis.Path2D) {
  globalThis.Path2D = Path2D as unknown as typeof globalThis.Path2D;
}

// pdfjs 5.x expects to load its worker; point it to a bundled copy so Next can emit it.
GlobalWorkerOptions.workerSrc = pdfjsWorker as unknown as string;
