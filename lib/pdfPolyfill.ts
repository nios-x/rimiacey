// Ensures pdfjs-dist (used by pdf-parse) has the browser globals it expects when
// running inside Next.js API routes on Node. Without these, pdfjs will throw
// `ReferenceError: DOMMatrix is not defined` at runtime.
import "@/lib/canvasGlobals";
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
// Legacy worker build exports a URL string in CommonJS/webpack environments.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";

declare global {
  var DOMMatrix: typeof globalThis.DOMMatrix | undefined;
  var ImageData: typeof globalThis.ImageData | undefined;
  var Path2D: typeof globalThis.Path2D | undefined;
}

// pdfjs 5.x expects to load its worker; point it to a bundled copy so Next can emit it.
GlobalWorkerOptions.workerSrc = pdfjsWorker as unknown as string;
