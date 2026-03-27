// Ensures pdfjs-dist (used by pdf-parse) has the browser globals it expects when
// running inside Next.js API routes on Node. Without these, pdfjs will throw
// `ReferenceError: DOMMatrix is not defined` at runtime.
import "@/lib/canvasGlobals";
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
// Legacy worker build (mjs). Resolve to file URL string without requiring the module value.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfjsWorkerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.min.mjs");

declare global {
  var DOMMatrix: typeof globalThis.DOMMatrix | undefined;
  var ImageData: typeof globalThis.ImageData | undefined;
  var Path2D: typeof globalThis.Path2D | undefined;
}

// pdfjs 5.x expects to load its worker; point it to a bundled copy so Next can emit it.
GlobalWorkerOptions.workerSrc = pdfjsWorkerPath;
