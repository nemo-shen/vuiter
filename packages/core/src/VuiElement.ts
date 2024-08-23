export class VuiElement implements Element {
  attributes: NamedNodeMap;
  classList: DOMTokenList;
  className: string;
  clientHeight: number;
  clientLeft: number;
  clientTop: number;
  clientWidth: number;
  id: string;
  localName: string;
  namespaceURI: string | null;
  onfullscreenchange: ((this: Element, ev: Event) => any) | null;
  onfullscreenerror: ((this: Element, ev: Event) => any) | null;
  outerHTML: string;
  ownerDocument: Document;
  part: DOMTokenList;
  prefix: string | null;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  shadowRoot: ShadowRoot | null;
  slot: string;
  tagName: string;
  attachShadow(init: ShadowRootInit): ShadowRoot {
    throw new Error("Method not implemented.");
  }
  checkVisibility(options?: CheckVisibilityOptions): boolean {
    throw new Error("Method not implemented.");
  }
  closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
  closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
  closest<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementTagNameMap[K] | null;
  closest<E extends Element = Element>(selectors: string): E | null;
  closest(selectors: unknown): E | HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | MathMLElementTagNameMap[K] | null {
    throw new Error("Method not implemented.");
  }
  computedStyleMap(): StylePropertyMapReadOnly {
    throw new Error("Method not implemented.");
  }
  getAttribute(qualifiedName: string): string | null {
    throw new Error("Method not implemented.");
  }
  getAttributeNS(namespace: string | null, localName: string): string | null {
    throw new Error("Method not implemented.");
  }
  getAttributeNames(): string[] {
    throw new Error("Method not implemented.");
  }
  getAttributeNode(qualifiedName: string): Attr | null {
    throw new Error("Method not implemented.");
  }
  getAttributeNodeNS(namespace: string | null, localName: string): Attr | null {
    throw new Error("Method not implemented.");
  }
  getBoundingClientRect(): DOMRect {
    throw new Error("Method not implemented.");
  }
  getClientRects(): DOMRectList {
    throw new Error("Method not implemented.");
  }
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    throw new Error("Method not implemented.");
  }
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(qualifiedName: unknown): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElementTagNameMap[K]> | HTMLCollectionOf<SVGElementTagNameMap[K]> | HTMLCollectionOf<MathMLElementTagNameMap[K]> | HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]> {
    throw new Error("Method not implemented.");
  }
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespace: unknown, localName: unknown): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElement> | HTMLCollectionOf<SVGElement> | HTMLCollectionOf<MathMLElement> {
    throw new Error("Method not implemented.");
  }
  hasAttribute(qualifiedName: string): boolean {
    throw new Error("Method not implemented.");
  }
  hasAttributeNS(namespace: string | null, localName: string): boolean {
    throw new Error("Method not implemented.");
  }
  hasAttributes(): boolean {
    throw new Error("Method not implemented.");
  }
  hasPointerCapture(pointerId: number): boolean {
    throw new Error("Method not implemented.");
  }
  insertAdjacentElement(where: InsertPosition, element: Element): Element | null {
    throw new Error("Method not implemented.");
  }
  insertAdjacentHTML(position: InsertPosition, text: string): void {
    throw new Error("Method not implemented.");
  }
  insertAdjacentText(where: InsertPosition, data: string): void {
    throw new Error("Method not implemented.");
  }
  matches(selectors: string): boolean {
    throw new Error("Method not implemented.");
  }
  releasePointerCapture(pointerId: number): void {
    throw new Error("Method not implemented.");
  }
  removeAttribute(qualifiedName: string): void {
    throw new Error("Method not implemented.");
  }
  removeAttributeNS(namespace: string | null, localName: string): void {
    throw new Error("Method not implemented.");
  }
  removeAttributeNode(attr: Attr): Attr {
    throw new Error("Method not implemented.");
  }
  requestFullscreen(options?: FullscreenOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }
  requestPointerLock(): void {
    throw new Error("Method not implemented.");
  }
  scroll(options?: ScrollToOptions): void;
  scroll(x: number, y: number): void;
  scroll(x?: unknown, y?: unknown): void {
    throw new Error("Method not implemented.");
  }
  scrollBy(options?: ScrollToOptions): void;
  scrollBy(x: number, y: number): void;
  scrollBy(x?: unknown, y?: unknown): void {
    throw new Error("Method not implemented.");
  }
  scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void {
    throw new Error("Method not implemented.");
  }
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
  scrollTo(x?: unknown, y?: unknown): void {
    throw new Error("Method not implemented.");
  }
  setAttribute(qualifiedName: string, value: string): void {
    throw new Error("Method not implemented.");
  }
  setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void {
    throw new Error("Method not implemented.");
  }
  setAttributeNode(attr: Attr): Attr | null {
    throw new Error("Method not implemented.");
  }
  setAttributeNodeNS(attr: Attr): Attr | null {
    throw new Error("Method not implemented.");
  }
  setHTMLUnsafe(html: string): void {
    throw new Error("Method not implemented.");
  }
  setPointerCapture(pointerId: number): void {
    throw new Error("Method not implemented.");
  }
  toggleAttribute(qualifiedName: string, force?: boolean): boolean {
    throw new Error("Method not implemented.");
  }
  webkitMatchesSelector(selectors: string): boolean {
    throw new Error("Method not implemented.");
  }
  addEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, ev: ElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error("Method not implemented.");
  }
  removeEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, ev: ElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error("Method not implemented.");
  }
  baseURI: string;
  childNodes: NodeListOf<ChildNode>;
  firstChild: ChildNode | null;
  isConnected: boolean;
  lastChild: ChildNode | null;
  nextSibling: ChildNode | null;
  nodeName: string;
  nodeType: number;
  nodeValue: string | null;
  parentElement: HTMLElement | null;
  parentNode: ParentNode | null;
  previousSibling: ChildNode | null;
  textContent: string | null;
  appendChild<T extends Node>(node: T): T {
    throw new Error("Method not implemented.");
  }
  cloneNode(deep?: boolean): Node {
    throw new Error("Method not implemented.");
  }
  compareDocumentPosition(other: Node): number {
    throw new Error("Method not implemented.");
  }
  contains(other: Node | null): boolean {
    throw new Error("Method not implemented.");
  }
  getRootNode(options?: GetRootNodeOptions): Node {
    throw new Error("Method not implemented.");
  }
  hasChildNodes(): boolean {
    throw new Error("Method not implemented.");
  }
  insertBefore<T extends Node>(node: T, child: Node | null): T {
    throw new Error("Method not implemented.");
  }
  isDefaultNamespace(namespace: string | null): boolean {
    throw new Error("Method not implemented.");
  }
  isEqualNode(otherNode: Node | null): boolean {
    throw new Error("Method not implemented.");
  }
  isSameNode(otherNode: Node | null): boolean {
    throw new Error("Method not implemented.");
  }
  lookupNamespaceURI(prefix: string | null): string | null {
    throw new Error("Method not implemented.");
  }
  lookupPrefix(namespace: string | null): string | null {
    throw new Error("Method not implemented.");
  }
  normalize(): void {
    throw new Error("Method not implemented.");
  }
  removeChild<T extends Node>(child: T): T {
    throw new Error("Method not implemented.");
  }
  replaceChild<T extends Node>(node: Node, child: T): T {
    throw new Error("Method not implemented.");
  }
  ELEMENT_NODE: 1;
  ATTRIBUTE_NODE: 2;
  TEXT_NODE: 3;
  CDATA_SECTION_NODE: 4;
  ENTITY_REFERENCE_NODE: 5;
  ENTITY_NODE: 6;
  PROCESSING_INSTRUCTION_NODE: 7;
  COMMENT_NODE: 8;
  DOCUMENT_NODE: 9;
  DOCUMENT_TYPE_NODE: 10;
  DOCUMENT_FRAGMENT_NODE: 11;
  NOTATION_NODE: 12;
  DOCUMENT_POSITION_DISCONNECTED: 1;
  DOCUMENT_POSITION_PRECEDING: 2;
  DOCUMENT_POSITION_FOLLOWING: 4;
  DOCUMENT_POSITION_CONTAINS: 8;
  DOCUMENT_POSITION_CONTAINED_BY: 16;
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }
  ariaAtomic: string | null;
  ariaAutoComplete: string | null;
  ariaBrailleLabel: string | null;
  ariaBrailleRoleDescription: string | null;
  ariaBusy: string | null;
  ariaChecked: string | null;
  ariaColCount: string | null;
  ariaColIndex: string | null;
  ariaColSpan: string | null;
  ariaCurrent: string | null;
  ariaDescription: string | null;
  ariaDisabled: string | null;
  ariaExpanded: string | null;
  ariaHasPopup: string | null;
  ariaHidden: string | null;
  ariaInvalid: string | null;
  ariaKeyShortcuts: string | null;
  ariaLabel: string | null;
  ariaLevel: string | null;
  ariaLive: string | null;
  ariaModal: string | null;
  ariaMultiLine: string | null;
  ariaMultiSelectable: string | null;
  ariaOrientation: string | null;
  ariaPlaceholder: string | null;
  ariaPosInSet: string | null;
  ariaPressed: string | null;
  ariaReadOnly: string | null;
  ariaRequired: string | null;
  ariaRoleDescription: string | null;
  ariaRowCount: string | null;
  ariaRowIndex: string | null;
  ariaRowSpan: string | null;
  ariaSelected: string | null;
  ariaSetSize: string | null;
  ariaSort: string | null;
  ariaValueMax: string | null;
  ariaValueMin: string | null;
  ariaValueNow: string | null;
  ariaValueText: string | null;
  role: string | null;
  animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions): Animation {
    throw new Error("Method not implemented.");
  }
  getAnimations(options?: GetAnimationsOptions): Animation[] {
    throw new Error("Method not implemented.");
  }
  after(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }
  before(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }
  remove(): void {
    throw new Error("Method not implemented.");
  }
  replaceWith(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }
  innerHTML: string;
  nextElementSibling: Element | null;
  previousElementSibling: Element | null;
  childElementCount: number;
  children: HTMLCollection;
  firstElementChild: Element | null;
  lastElementChild: Element | null;
  append(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }
  prepend(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
  querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K] | null;
  querySelector<E extends Element = Element>(selectors: string): E | null;
  querySelector(selectors: unknown): E | HTMLElementTagNameMap[K] | SVGElementTagNameMap[K] | MathMLElementTagNameMap[K] | HTMLElementDeprecatedTagNameMap[K] | null {
    throw new Error("Method not implemented.");
  }
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  querySelectorAll(selectors: unknown): NodeListOf<HTMLElementTagNameMap[K]> | NodeListOf<SVGElementTagNameMap[K]> | NodeListOf<MathMLElementTagNameMap[K]> | NodeListOf<HTMLElementDeprecatedTagNameMap[K]> | NodeListOf<E> {
    throw new Error("Method not implemented.");
  }
  replaceChildren(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }
  assignedSlot: HTMLSlotElement | null;
}
