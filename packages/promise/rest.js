const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(executor) {
  this.state = PENDING;
  this.value = undefined;
  this.reason = undefined;

  const onFulfilled = () => {

  }

  const onRejected = () => {}

  const resolve = (val) => {
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = val;
    }
  }
  const reject = (val) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = val;
    }
  }

  try {
    executor(resolve, reject)
  } catch (e) {
    throw new Error();
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {}