import "@testing-library/jest-dom/vitest"
import ResizeObserver from "resize-observer-polyfill"

global.ResizeObserver = ResizeObserver

// window.PointerEvent = class PointerEvent extends Event {};
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()
