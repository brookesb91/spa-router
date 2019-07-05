type HandlerFn = (target: HTMLElement, done: () => any) => void;
type RouterEvent = 'load' | 'unload';

class Router {
  private listeners: Map<RouterEvent, HandlerFn[]> = new Map();
  private outlet: HTMLElement;

  constructor(outletId: string) {
    this.setupOutlet(outletId);
  }

  on(event: RouterEvent, handler: HandlerFn) {
    const handlers = [handler];
    if (this.listeners.has(event)) {
      handlers.concat(this.listeners.get(event));
    }
    this.listeners.set(event, handlers);
  }

  use(plugin: any) { }

  notify(event: RouterEvent, target: HTMLElement, done: () => any) {
    if (this.listeners.has(event)) {
      for (let i = 0; i < this.listeners.get(event).length; i++) {
        const current = this.listeners.get(event)[i];
        const next = this.listeners.get(event)[i + 1] || null;
        // current(target, next);
      }
    }

    done();
  }

  private navigate() { }
  private loadView() { }
  private unloadView() { }
  private registerPopStateListener() { }
  private registerClickEvents() { }
  private setupOutlet(outletId: string) {
    if (!document.getElementById(outletId)) {
      throw 'No outlet found with the given ID';
    }
    this.outlet = document.getElementById(outletId);
  }
  private clearChildren(element: HTMLElement) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}