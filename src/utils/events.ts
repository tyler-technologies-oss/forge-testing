/**
 * Simulates a keydown event on an element.
 * @param element The element to dispatch the event from.
 * @param key The key to simulate being pressed.
 */
export function dispatchKeyEvent(element: HTMLElement | Document, type: string, key: string, bubbles = true): void {
  const event = new KeyboardEvent(type, { key, bubbles });
  element.dispatchEvent(event);
}

/**
 * Simulates a native `Event` being triggered by user interaction.
 * @param element The element to dispath the event from.
 * @param type The event type.
 */
export function dispatchNativeEvent(element: HTMLElement | Document, type: string): void {
  element.dispatchEvent(new Event(type));
}

/**
 * Dispatches the `dblclick` event on the provided element.
 * @param {HTMLElement} element The element to perform the double click on.
 */
export function doubleClick(element: HTMLElement): void {
  const event = new MouseEvent('dblclick');
  element.dispatchEvent(event);
}
