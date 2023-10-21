import { Observer } from "./Observer";
import { Subject } from "./Subject";

class Observable {
  trigger: any;
    static fromEvent: (dom: any, eventName: any) => Observable;
    static interval: (delay: any) => Observable;
  constructor(triggerFun: any) {
      this.trigger = triggerFun;
  }

  subscribe(observerOrNext: any, error?: any, complete?:any) {
      let observer;
      if (observerOrNext instanceof Observer || observerOrNext instanceof Subject) {
          observer = observerOrNext
      } else if (typeof observerOrNext === 'function') {
          observer = new Observer(observerOrNext, error, complete);
      } else {
          observer = new Observer(observerOrNext.next, observerOrNext.error, observerOrNext.complete);
      }
      return observer;
  }

}   

Observable.fromEvent =  (dom: any, eventName: any)=> {
      
    return new Observable((observer: any) => {
        const handler = (event: any) => {
            observer.next(event);
        }
        dom.addEventListener(eventName, handler);
        return () => {
            dom.removeEventListener(eventName, handler);
        }
    });
}

Observable.interval = (delay: any) => {
    let i = 0;
    return new Observable((observer: any) => {
        const id = setInterval(() => {
            observer.next(i++);
        }, delay);
        return () => {
            clearInterval(id);
        }
    });
}

export { Observable };