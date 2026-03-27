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
} else {
  // Lightweight fallbacks sufficient for pdf.js text parsing.
  class SimpleDOMMatrix {
    a: number; b: number; c: number; d: number; e: number; f: number;
    is2D = true;
    constructor(init?: number[] | string) {
      if (Array.isArray(init) && init.length >= 6) {
        [this.a, this.b, this.c, this.d, this.e, this.f] = init.map(Number);
      } else {
        this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      }
    }
    multiplySelf(other: SimpleDOMMatrix | number[]) {
      const o = other instanceof SimpleDOMMatrix ? other : new SimpleDOMMatrix(other);
      const a = this.a * o.a + this.c * o.b;
      const b = this.b * o.a + this.d * o.b;
      const c = this.a * o.c + this.c * o.d;
      const d = this.b * o.c + this.d * o.d;
      const e = this.a * o.e + this.c * o.f + this.e;
      const f = this.b * o.e + this.d * o.f + this.f;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    translateSelf(x = 0, y = 0) {
      return this.multiplySelf([1, 0, 0, 1, x, y]);
    }
    scaleSelf(scaleX = 1, scaleY = scaleX) {
      return this.multiplySelf([scaleX, 0, 0, scaleY, 0, 0]);
    }
    rotateSelf(angle = 0) {
      const r = (angle * Math.PI) / 180;
      const cos = Math.cos(r);
      const sin = Math.sin(r);
      return this.multiplySelf([cos, sin, -sin, cos, 0, 0]);
    }
    invertSelf() {
      const det = this.a * this.d - this.b * this.c || 1;
      const a = this.d / det;
      const b = -this.b / det;
      const c = -this.c / det;
      const d = this.a / det;
      const e = (this.c * this.f - this.d * this.e) / det;
      const f = (this.b * this.e - this.a * this.f) / det;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    toFloat32Array() {
      return new Float32Array([this.a, this.b, 0, 0, this.c, this.d, 0, 0, 0, 0, 1, 0, this.e, this.f, 0, 1]);
    }
  }

  class SimpleImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    constructor(data: Uint8ClampedArray | number, width?: number, height?: number) {
      if (typeof data === "number") {
        this.width = data;
        this.height = width ?? 0;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
      } else {
        this.data = data;
        this.width = width ?? 0;
        this.height = height ?? 0;
      }
    }
  }

  class SimplePath2D {
    // Empty stub; pdf.js only checks existence in Node.
    constructor(_path?: string) {}
  }

  if (!globalThis.DOMMatrix) {
    // @ts-ignore
    globalThis.DOMMatrix = SimpleDOMMatrix as unknown as typeof globalThis.DOMMatrix;
  }
  if (!globalThis.ImageData) {
    // @ts-ignore
    globalThis.ImageData = SimpleImageData as unknown as typeof globalThis.ImageData;
  }
  if (!globalThis.Path2D) {
    // @ts-ignore
    globalThis.Path2D = SimplePath2D as unknown as typeof globalThis.Path2D;
  }
}

export {};
