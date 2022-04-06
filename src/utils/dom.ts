/**
 * Creates a new HTML element with the provided tag name, and optionally appends it to the DOM.
 * @param {string} tag The tag name.
 * @param {HTMLElement} appendTo The element to append the newly created child element to.
 */
export function appendElement<T extends HTMLElement>(tag: string, appendTo?: HTMLElement): T {
  const element = document.createElement(tag) as T;

  if (!appendTo) {
    appendTo = document.body;
  }

  appendTo.appendChild(element);
  return element;
}
