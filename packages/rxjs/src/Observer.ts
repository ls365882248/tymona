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