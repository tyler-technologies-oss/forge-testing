/**
 * Converts CSS time into milliseconds. Useful for timing functions around CSS animations.
 * It supports both seconds (s) and milliseconds (ms).
 * @author Jake Bellacera (http://jakebellacera.com)
 * @param {string} cssTime String representation of a CSS time unit (e.g. "1500ms" or "1.5s")
 * @returns Time (in milliseconds) as an Integer. Invalid inputs will return 0 milliseconds.
 */
export function cssTimeToMilliseconds(cssTime: string): number {
  const num = parseFloat(cssTime);
  const matches = cssTime.match(/m?s/);
  const unit: string = matches ? matches[0] : '';
  let millis = 0;

  switch (unit) {
    case 's':
      millis = num * 1000;
      break;
    case 'ms':
      millis = num;
      break;
  }

  return millis;
}

/**
 * Creates a deep copy of the provided object.
 * @param {any} obj The object to copy.
 */
export function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Converts an RGB color string to its hex value.
 * @param rgb The RGB color string.
 */
export function rgbToHex(rgb: string): string {
  if (!rgb || ! rgb.length) {
    return '';
  }

  const hexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  // eslint-disable-next-line arrow-body-style
  const hex: (value: any) => void = value => {
    return isNaN(value) ? '00' : hexValues[(value - value % 16) / 16] + hexValues[value % 16];
  };

  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch || rgbMatch.length !== 4) {
    return '';
  }
  return '#' + hex(rgbMatch[1]) + hex(rgbMatch[2]) + hex(rgbMatch[3]);
}

/**
 * Converts requestAnimationFrame to a promise.
 */
export function tick(): Promise<void> {
  return new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve());
  });
}

/**
 * Converts setTimeout to a promise.
 */
export function timer(duration = 0): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), duration);
  });
}
