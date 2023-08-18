
export class Observable {
    trigger: any;
    constructor(triggerFun: any) {
        this.trigger = triggerFun;
    }

    subscribe(observerOrNext: any, error: any, complete:any) {
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

    static fromEvent (dom: any, eventName: any) {
        
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

    static interval (delay: any) {
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
}

export class Observer {
    isAbort = false;
    constructor(next: any, error: any, complete: any) {
        this.next = next;
        this.error = error;
        this.complete = complete;
    }

    next(value: any) {
        if(typeof this.next === 'function' && !this.isAbort) {
            this.next(value);
        }
    }

    error(error: any) {
        if (typeof this.error === 'function' && !this.isAbort) {
            this.error(error);
            this.complete();
        }
    }

    complete() {
        if (typeof this.complete === 'function' && !this.isAbort) {
            this.complete();
        }
    }

    unsubscribe() {
        this.isAbort = true;
    }
}

export class Subject extends Observable {
    observers: any[] = [];
    isAbort = false;

    publish(observer: any) {
        this.observers.push(observer);
    }

    next(value: any) {
        if (!this.isAbort) return;
        this.observers.forEach(observer => observer.next(value));
    }

    error(error: any) {
        if (!this.isAbort) return;
        this.observers.forEach(observer => observer.error(error));
        this.isAbort = true;
        this.observers = [];
    }

    complete() {
        if (!this.isAbort) return;
        this.observers.forEach(observer => observer.complete());
        this.isAbort = true;
        this.observers = [];
    }

}

