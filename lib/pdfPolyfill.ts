// Ensures pdfjs-dist (used by pdf-parse) has the browser globals it expects when
// running inside Next.js API routes on Node. Without these, pdfjs will throw
// `ReferenceError: DOMMatrix is not defined` at runtime.
import "@/lib/canvasGlobals";
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import path from "path";
import { pathToFileURL } from "url";

// Build a file:// URL to the worker at runtime so webpack doesn't replace it.
const pdfjsWorkerPath = pathToFileURL(
  path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.min.mjs"),
).toString();

declare global {
  var DOMMatrix: typeof globalThis.DOMMatrix | undefined;
  var ImageData: typeof globalThis.ImageData | undefined;
  var Path2D: typeof globalThis.Path2D | undefined;
}

// pdfjs 5.x expects to load its worker; point it to a bundled copy so Next can emit it.
GlobalWorkerOptions.workerSrc = pdfjsWorkerPath;
