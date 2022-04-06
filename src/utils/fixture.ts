import { dashify } from '@tylertech/forge-core';

/**
 * Creates an HTML string using the provided element name and optional attribute information.
 * @param {string} elementName The name of the element.
 * @param {object} [attributes] Any attributes with their values to add to the element.
 */
export function createFixtureString(elementName: string, attributes?: { [key: string]: string }): string {
  let attributeString = '';
  if (attributes) {
    for (const prop in attributes) {
      if (attributes.hasOwnProperty(prop)) {
        const attrName = dashify(prop);
        attributeString += ` ${attrName}="${attributes[prop]}"`;
      }
    }
  }

  return `<${elementName}${attributeString}></${elementName}>`;
}
