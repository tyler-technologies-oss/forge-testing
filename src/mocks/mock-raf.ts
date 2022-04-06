/**
 * Mocks the requestAnimationFrame (and cancelAnimationFrame) methods so that tests
 * can be written against code that uses a call to RAF.
 */
export class MockRAF {
  private static _realRAF = window.requestAnimationFrame;
  private static _realCAF = window.cancelAnimationFrame;

  private static _index = 0;
  private static _callbacks: { [key: string]: FrameRequestCallback } = {};

  private static _mockRAF: (callback: FrameRequestCallback) => number = callback => {
    if (typeof callback !== 'function') {
      throw new Error('requestAnimationFrame requires a function to be provided.');
    }

    MockRAF._index++;
    MockRAF._callbacks[MockRAF._index] = callback;

    return MockRAF._index;
  };

  private static _mockCAF: (requestId: number) => void = requestId => {
    delete MockRAF._callbacks[requestId];
  };

  public static start(): void {
    window.requestAnimationFrame = MockRAF._mockRAF;
    window.cancelAnimationFrame = MockRAF._mockCAF;
  }

  public static stop: () => void = () => {
    window.requestAnimationFrame = MockRAF._realRAF;
    window.cancelAnimationFrame = MockRAF._realCAF;
  };

  public static tick: () => void = () => {
    const fns = MockRAF._callbacks;
    MockRAF._callbacks = {};

    for (const prop in fns) {
      if (fns.hasOwnProperty(prop)) {
        fns[prop].call(window);
      }
    }
  };
}
