type RouterEvent = 'load' | 'unload';
type RouterEventPromise = Promise<HTMLElement> | HTMLElement;
type RouterEventHandlerFn = (target: HTMLElement) => RouterEventPromise;

class Router {
  private currentView!: HTMLElement;
  private outlet!: HTMLElement;

  listeners: Map<RouterEvent, RouterEventHandlerFn[]> = new Map();

  constructor() { }

  /**
   *
   * @param event Event to fire on
   * @param handler Handler function that takes the target element as an
   * argument and returns a promise that resolves a HTMLElement
   */
  on(
    event: RouterEvent,
    handler: (target: HTMLElement) => Promise<HTMLElement>
  ) {

    if (!this.listeners.has(event)) return;

    const handlers = [...this.listeners.get(event) || []];
    handlers.concat(handler);
    this.listeners.set(event, handlers);
  }

  notify(
    event: RouterEvent,
    target: HTMLElement,
    handler: RouterEventHandlerFn
  ) {
    if (this.listeners.has(event)) {
      return [...this.listeners.get(event) || []]
        .reduce((current, next) => {
          return current.then(next);
        }, Promise.resolve(target))
        .then(el => handler(el));
    }
    handler(target);
  }

  private navigate(path: string) {
    this.unloadView().then(target => {
      window.history.pushState({}, window.location.origin + path);
      this.loadView(path);
    });
  }

  private loadView(path: string) {
    const next = this.getNextView(path);
    if (!next) throw `No Template Found For ${path}`;

    const view = document.createElement('div');
    view.classList.add('router-view');
    view.setAttribute('data-router-view', path);
    view.appendChild(document.importNode(next.content, true));
    this.outlet.appendChild(view);

    return this.notify('load', view, el => this.currentView = el);

  }

  private unloadView() {
    return this.notify('unload', this.currentView, el => {
      this.clearChildren(this.outlet)
      return el;
    });
  }

  private getNextView(path: string) {
    return <HTMLTemplateElement>(
      document.querySelector(`template[data-route='${path}']`)
    );
  }

  private registerWindowListener() {
    window.addEventListener('popstate', this.handlePopState, false);
  }

  private registerClickEvents() {
    document.addEventListener('click', this.handleClick, false);
  }

  private handleClick(event: Event) {
    const target = <HTMLElement>event.target;
    if (!target.matches('[data-link]')) return;
    event.preventDefault();
    const path = String(target.getAttribute('data-link'));
    if (window.location.pathname === path) return;
    this.navigate(path);
  }

  private handlePopState() {
    this.navigate(window.location.pathname);
  }

  private setupOutlet(outletId) {
    if (!!document.getElementById(outletId)) {
      this.outlet = document.getElementById(outletId);
    }
  }

  private clearChildren(element: HTMLElement) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
