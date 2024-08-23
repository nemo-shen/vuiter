interface VuiNode extends Node {

}

export class VuiNode implements VuiNode {
  childNodes: NodeListOf<ChildNode>;
  nodeName: string;
  nodeType: number;
  nodeValue: string | null;
  ownerDocument: Document | null;
  parentElement: HTMLElement | null;
  parentNode: ParentNode | null;
  previousSibling: ChildNode | null;
  textContent: string | null;
  // appendChild<T extends Node>(node: T): T {
  //   throw new Error("Method not implemented.");
  // }
  // cloneNode(deep?: boolean): Node {
  //   throw new Error("Method not implemented.");
  // }
  // compareDocumentPosition(other: Node): number {
  //   throw new Error("Method not implemented.");
  // }
  // contains(other: Node | null): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // getRootNode(options?: GetRootNodeOptions): Node {
  //   throw new Error("Method not implemented.");
  // }
  // hasChildNodes(): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // insertBefore<T extends Node>(node: T, child: Node | null): T {
  //   throw new Error("Method not implemented.");
  // }
  // isDefaultNamespace(namespace: string | null): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // isEqualNode(otherNode: Node | null): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // isSameNode(otherNode: Node | null): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // lookupNamespaceURI(prefix: string | null): string | null {
  //   throw new Error("Method not implemented.");
  // }
  // lookupPrefix(namespace: string | null): string | null {
  //   throw new Error("Method not implemented.");
  // }
  // normalize(): void {
  //   throw new Error("Method not implemented.");
  // }
  // removeChild<T extends Node>(child: T): T {
  //   throw new Error("Method not implemented.");
  // }
  // replaceChild<T extends Node>(node: Node, child: T): T {
  //   throw new Error("Method not implemented.");
  // }
  ELEMENT_NODE: 1;
  // ATTRIBUTE_NODE: 2;
  TEXT_NODE: 3;
  // CDATA_SECTION_NODE: 4;
  // ENTITY_REFERENCE_NODE: 5;
  // ENTITY_NODE: 6;
  // PROCESSING_INSTRUCTION_NODE: 7;
  COMMENT_NODE: 8;
  // DOCUMENT_NODE: 9;
  // DOCUMENT_TYPE_NODE: 10;
  // DOCUMENT_FRAGMENT_NODE: 11;
  // NOTATION_NODE: 12;
  // DOCUMENT_POSITION_DISCONNECTED: 1;
  // DOCUMENT_POSITION_PRECEDING: 2;
  // DOCUMENT_POSITION_FOLLOWING: 4;
  // DOCUMENT_POSITION_CONTAINS: 8;
  // DOCUMENT_POSITION_CONTAINED_BY: 16;
  // DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
  // addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
  //   throw new Error("Method not implemented.");
  // }
  // dispatchEvent(event: Event): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
  //   throw new Error("Method not implemented.");
  // }
}