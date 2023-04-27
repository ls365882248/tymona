function pipeFromArray(fns) {
  if (fns.length === 0) {
      return (x) => x;
  }
  if (fns.length === 1) {
      return fns[0];
  }
  return (input) => {
      return fns.reduce((prev, fn) => fn(prev), input);
  };
}

class Subscription {
  _tearDowns;
  constructor() {
      this._tearDowns = [];
  }
  unsubscribe() {
      this._tearDowns.forEach((teardown) => {
          typeof teardown === 'function' ? teardown() : teardown.unsubscribe()
      });
  }
  add(teardown) {
      if (teardown) {
          this._tearDowns.push(teardown);
      }
  }
}
class Subscriber extends Subscription {
  isStopped;
  observer;
  constructor(observer) {
      super();
      this.observer = observer;
      this.isStopped = false;
  }
  next(value) {
      if (this.observer.next && !this.isStopped) {
          this.observer.next(value);
      }
  }
  error(value) {
      this.isStopped = true;
      if (this.observer.error) {
          this.observer.error(value);
      }
  }
  complete() {
      this.isStopped = true;
      if (this.observer.complete) {
          this.observer.complete();
      }
      if (this.unsubscribe) {
          this.unsubscribe();
      }
  }
}
class Observable {
  _subscribe;
  constructor(_subscribe) {
      this._subscribe = _subscribe;
  }
  subscribe(observer) {
      const subscriber = new Subscriber(observer);
      subscriber.add(this._subscribe(subscriber));
      return subscriber;
  }
  pipe(...operations) {
      return pipeFromArray(operations)(this);
  }
}

function map(project) {
  return (observable) => new Observable((subscriber) => {
      const subcription = observable.subscribe({
          next(value) {
              return subscriber.next(project(value));
          },
          error(err) {
              subscriber.error(err);
          },
          complete() {
              subscriber.complete();
          },
      });
      return subcription;
  });
}


const source = new Observable((observer) => {
  let i = 0;
  const timer = setInterval(() => {
      observer.next(++i);
  }, 1000);
  return function unsubscribe() {
      clearInterval(timer);
  };
});
const subscription = source.pipe(
  map((i) => ++i),
  map((i) => i * 10)
).subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.log('complete'),
});

setTimeout(() => {
  subscription.unsubscribe();
}, 4500);
