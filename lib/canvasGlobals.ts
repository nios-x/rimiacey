// Sets DOM-related globals using a native canvas implementation so pdf.js can run in Node.
// Tries @napi-rs/canvas first (bundled with native binaries), falls back to canvas if available.
// Use eval to avoid webpack trying to resolve optional deps we may not ship.
const dynamicRequire = eval("require") as NodeRequire;
let canvas: any;
try {
  canvas = dynamicRequire("@napi-rs/canvas");
} catch {
  try {
    canvas = dynamicRequire("canvas");
  } catch {
    canvas = null;
  }
}

if (canvas) {
  const { DOMMatrix, ImageData, Path2D } = canvas;
  if (!globalThis.DOMMatrix) {
    // @ts-ignore
    globalThis.DOMMatrix = DOMMatrix;
  }
  if (!globalThis.ImageData) {
    // @ts-ignore
    globalThis.ImageData = ImageData;
  }
  if (!globalThis.Path2D) {
    // @ts-ignore
    globalThis.Path2D = Path2D;
  }
}

export {};
