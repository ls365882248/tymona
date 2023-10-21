import { Observable } from "./Observable";

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