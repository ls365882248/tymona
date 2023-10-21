Function.prototype.callStep1 = function(context) {
  // 首先要获取调用call的函数，用this可以获取
  context.fn = this; // 将函数设为对象的属性
  context.fn(); // 执行该函数
  delete context.fn; // 删除该函数
}

Function.prototype.callStep2 = function(context) {
  context.fn = this;
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  } // 支持参数
  eval('context.fn(' + args +')');
  delete context.fn;
}

// 边界条件处理， （参数为空）
Function.prototype.callStep3 = function (context) {
  var context = context || window;
  context.fn = this;

  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }

  var result = eval('context.fn(' + args +')');

  delete context.fn
  return result;
}

Function.prototype.apply1 = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
      result = context.fn();
  }
  else {
      var args = [];
      for (var i = 0, len = arr.length; i < len; i++) {
          args.push('arr[' + i + ']');
      }
      result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result;
}

Function.prototype.bindStep1 = function (context) {
  var self = this;
  return function () {
      return self.apply(context);
  }
}

Function.prototype.bindStep2 = function (context) {

  var self = this;
  // 获取bind2函数从第二个参数到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1);

  return function () {
      // 这个时候的arguments是指bind返回的函数传入的参数
      var bindArgs = Array.prototype.slice.call(arguments);
      return self.apply(context, args.concat(bindArgs));
  }

}

// new
function objectFactory() {

  var obj = new Object(),

  Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments);

  return typeof ret === 'object' ? ret : obj;

};

function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left)
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype; 
 
  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto);
  }
}

// ajax
const SERVER_URL = "/server";
// 1.创建一个XMLHttpRequest对象
let xhr = new XMLHttpRequest();
// 2.在这个对象上使用open方法创建一个 Http 请求
// open方法所需要的参数上请求的方法、请求的地址、是否异步喝用户的认证信息
xhr.open("GET", url, true);
// 3.在发起请求前，可以为这个对象添加一些信息和状态监听函数
xhr.onreadystatechange = function() {
  // 设置监听函数后，当对象的readyState变为4的时候，代表服务器返回的数据接收完成
  // readyState是XMLHttpRequest对象的一个属性，用来标识当前XMLHttpRequest对象处于什么状态。
  //  readyState总共有5个状态值，分别为0~4，每个值代表了不同的含义
  //  0：未初始化 -- 尚未调用.open()方法；
  //  1：启动 -- 已经调用.open()方法，但尚未调用.send()方法；
  //  2：发送 -- 已经调用.send()方法，但尚未接收到响应；
  //  3：接收 -- 已经接收到部分响应数据；
  //  4：完成 -- 已经接收到全部响应数据，而且已经可以在客户端使用了；
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function() {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 4.当对象的属性和监听函数设置完成后，最后调用sent方法来向服务器发送 Http 请求，可以传入参数作为发送的数据体
xhr.send(null);

// axios
function ajax(method, url, data) {
  var xhr = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {
      xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;
          if (xhr.status === 200) {
              resolve(xhr.responseText);
          } else {
              reject(xhr.statusText);
          }

      };
      xhr.open(method, url);
      xhr.send(data);
  });
}

// compose
function compose(fns) {
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
// 基于洋葱模型的 compose
function composeOnion(middlewares){
  const copyMiddlewares = [...middlewares]
  let index = 0
  const fn = ()=>{
      if(index > copyMiddlewares.length){
          return
      }
      const middleware = copyMiddlewares[index]
      index++
      return middleware(fn)
  }
  return fn
}

// pipe
function pipe(...fns){
  return (params) => {
        return fns.reduce((input, fn) => fn(input), params)
  };
}

// curry
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

// debounce 某个函数在某段时间内，无论触发了多少次回调，都只执行最后一次
function debounce(fn, delay) {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

function debounce(func,wait,immediate){
  let timeout;
  return function(){
      if(timeout) clearTimeout(timeout)
      if(immediate){
          var callNow = !timeout
          timeout = setTimeout(function(){
              timeout = null
          },wait)
          if(callNow) func.apply(this, arguments)
      }else{
          timeout = setTimeout(function(){
              func.apply(this,arguments)
          },wait)
      }
  }
}


// throttle 点击多次后不会马上执行，而是将这些执行按每个延时的时间内执行一次，点多少次执行多少次，每隔延时的时间执行一次
function throttle(fn, delay) {
  let flag = true;
  return function() {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, delay);
  };
}

// deep clone
function deepClone(obj) {
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  let result;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }
  // Date RegExp
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}

// object.create
function myCreate(proto) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }

  // 创建一个空构造函数
  function F() {}

  // 将空构造函数的原型设置为指定的原型对象
  F.prototype = proto;

  // 使用构造函数创建一个新对象，并返回它
  return new F();
}

// 调度器
class PromiseQueue {
  constructor() {
    this.queue = [];
    this.isRunning = false;
  }

  add(promiseCreator) {
    this.queue.push(promiseCreator);
    this.run();
  }

  run() {
    if (this.isRunning) return;
    this.isRunning = true;
    const promiseCreator = this.queue.shift();
    if (promiseCreator) {
      const p = promiseCreator();
      p.then(() => {
        this.isRunning = false;
        this.run();
      });
    }
  }
}

class Scheduler {
  constructor(count) {
      this.count = count
      this.queue = []
      this.run = []
  }

  add(task) {
      this.queue.push(task)
      return this.schedule()
  }

  schedule() {
      if (this.run.length < this.count && this.queue.length) {
          const task = this.queue.shift()
          const promise = task().then(() => {
              this.run.splice(this.run.indexOf(promise), 1)
          })
          this.run.push(promise)
          return promise
      } else {
          return Promise.race(this.run).then(() => this.schedule())
      }
  }
}

// event emit
class EventEmitter {
  constructor() {
    // handlers是一个map，用于存储事件与回调之间的对应关系
    this.handlers = {}
  }

  // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数
  on(eventName, cb) {
    // 先检查一下目标事件名有没有对应的监听函数队列
    if (!this.handlers[eventName]) {
      // 如果没有，那么首先初始化一个监听函数队列
      this.handlers[eventName] = []
    }

    // 把回调函数推入目标事件的监听函数队列里去
    this.handlers[eventName].push(cb)
  }

  // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
  emit(eventName, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.handlers[eventName]) {
      // 这里需要对 this.handlers[eventName] 做一次浅拷贝，主要目的是为了避免通过 once 安装的监听器在移除的过程中出现顺序问题
      const handlers = this.handlers[eventName].slice()
      // 如果有，则逐个调用队列里的回调函数
      handlers.forEach((callback) => {
        callback(...args)
      })
    }
  }

  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName]
    const index = callbacks.indexOf(cb)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  // 为事件注册单次监听器
  once(eventName, cb) {
    // 对回调函数进行包装，使其执行完毕自动被移除
    const wrapper = (...args) => {
      cb(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}

// 一、实现useState
const { render } = require("react-dom");
let memoriedStates = [];
let lastIndex = 0;
function useState(initialState) {
  memoriedStates[lastIndex] = memoriedStates[lastIndex] || initialState;
  function setState(newState) {
    memoriedStates[lastIndex] = newState;
    // 状态更新完毕，调用render函数。重新更新视图
    render();
  }
  // 返回最新状态和更新函数，注意 index 要前进
  return [memoriedStates[lastIndex++], setState];
}

// 二、实现useEffect
let lastDendencies; // 存放依赖项的数组
function useEffect(callback, dependencies) {
  if (lastDendencies) {
    // 判断传入的依赖项是不是都没有变化，只要有以一项改变，就需要执行callback
    const isChange = dependencies && dependencies.some((dep, index) => dep !== lastDendencies[index]);
    if (isChange) {
      // 一开始没有值，需要更新一次(相当于componentDidMount)
      typeof callback === 'function' && callback();
      // 更新依赖项
      lastDendencies = dependencies;
    }
  } else {
    // 一开始没有值，需要更新一次(相当于componentDidMount)
    typeof callback === 'function' && callback();
    // 更新依赖项
    lastDendencies = dependencies;
  }
}

// 三、实现useCallback
let lastCallback; // 最新的回调函数
let lastCallbackDependencies = []; // 回调函数的依赖项
function useCallback(callback, dependencies = []) {
  if (lastCallback) {
    const isChange = dependencies && dependencies.some((dep, index) = dep !== lastCallbackDependencies[index]);
    if (isChange) {
      // 只要有一个依赖项改变了，就更新回调(重新创建)
      lastCallback = callback;
      lastCallbackDependencies = dependencies;
    }
  } else {
    lastCallback = callback;
    lastCallbackDependencies = dependencies;
  }
  // 最后需要返回最新的函数
  return lastCallback;
}

// 四、实现useRef
let lastRef;
function useRef(initialValue = null){
  
  lastRef = lastRef != undefined ? lastRef : initialValue;
  // 本质上就是返回一个对象，对象种有一个current属性，值为初始化传入的值，如果没有传入初始值，则默认为null
  return {
    current: lastRef
  }
}

// 五、实现useContext
function useContext(context){
  // 很简单，就是返回context的_currentValue值
  return context._currentValue;
}

// 六、实现useReducer
let lastState;
function useReducer(reducer, initialState){
  lastState = lastState !== undefined ? lastState : initialState;
  // dispatch一个action，内部就是自动调用reducer来计算新的值返回
  function dispatch(action){
    lastState = reducer(lastState, action);
    // 更新完毕后，需要重新渲染视图
    render();
  }
  // 最后返回一个的状态值和派发action的方法
  return [lastState, dispatch];
}

// aa_bb_cc 2 aaBbCc
const convertToCamel = (s) => {
  return s.replace(/_([a-z])/g, (b, letter) => letter.toUpperCase());
}
convertToCamel('aa_bb_cc')

// 先定义三个常量表示状态
var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';

function MyPromise(fn) {
  this.status = PENDING;    // 初始状态为pending
  this.value = null;        // 初始化value
  this.reason = null;       // 初始化reason

  // 构造函数里面添加两个数组存储成功和失败的回调
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  // 存一下this,以便resolve和reject里面访问
  var that = this;
  // resolve方法参数是value
  function resolve(value) {
    if (that.status === PENDING) {
      that.status = FULFILLED;
      that.value = value;

      // resolve里面将所有成功的回调拿出来执行
      that.onFulfilledCallbacks.forEach(callback => {
        callback(that.value);
      });
    }
  }

  // reject方法参数是reason
  function reject(reason) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.reason = reason;

      // resolve里面将所有失败的回调拿出来执行
      that.onRejectedCallbacks.forEach(callback => {
        callback(that.reason);
      });
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }

  if (x instanceof MyPromise) {
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
    // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject);
    }, reject);
  }
  // 如果 x 为对象或者函数
  else if (typeof x === 'object' || typeof x === 'function') {
    // 这个坑是跑测试的时候发现的，如果x是null，应该直接resolve
    if (x === null) {
      return resolve(x);
    }

    try {
      // 把 x.then 赋值给 then 
      var then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === 'function') {
      var called = false;
      // 将 x 作为函数的作用域 this 调用之
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      // 名字重名了，我直接用匿名函数了
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          function (y) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          });
      } catch (error) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;

        // 否则以 e 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  // 后面返回新promise的时候也做了onFulfilled的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  var realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function (value) {
      return value;
    }
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  // 后面返回新promise的时候也做了onRejected的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  var realOnRejected = onRejected;
  if (typeof realOnRejected !== 'function') {
    realOnRejected = function (reason) {
      throw reason;
    }
  }

  var that = this;   // 保存一下this

  if (this.status === FULFILLED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(that.value);
          } else {
            var x = realOnFulfilled(that.value);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  if (this.status === REJECTED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onRejected !== 'function') {
            reject(that.reason);
          } else {
            var x = realOnRejected(that.reason);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  // 如果还是PENDING状态，将回调保存下来
  if (this.status === PENDING) {
    var promise2 = new MyPromise(function (resolve, reject) {
      that.onFulfilledCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(that.value);
            } else {
              var x = realOnFulfilled(that.value);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      that.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onRejected !== 'function') {
              reject(that.reason);
            } else {
              var x = realOnRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0)
      });
    });

    return promise2;
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}

MyPromise.resolve = function (parameter) {
  if (parameter instanceof MyPromise) {
    return parameter;
  }

  return new MyPromise(function (resolve) {
    resolve(parameter);
  });
}

MyPromise.reject = function (reason) {
  return new MyPromise(function (resolve, reject) {
    reject(reason);
  });
}

MyPromise.all = function (promiseList) {
  var resPromise = new MyPromise(function (resolve, reject) {
    var count = 0;
    var result = [];
    var length = promiseList.length;

    if (length === 0) {
      return resolve(result);
    }

    promiseList.forEach(function (promise, index) {
      MyPromise.resolve(promise).then(function (value) {
        count++;
        result[index] = value;
        if (count === length) {
          resolve(result);
        }
      }, function (reason) {
        reject(reason);
      });
    });
  });

  return resPromise;
}

MyPromise.race = function (promiseList) {
  var resPromise = new MyPromise(function (resolve, reject) {
    var length = promiseList.length;

    if (length === 0) {
      return resolve();
    } else {
      for (var i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(function (value) {
          return resolve(value);
        }, function (reason) {
          return reject(reason);
        });
      }
    }
  });

  return resPromise;
}

MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
}

MyPromise.prototype.finally = function (fn) {
  return this.then(function (value) {
    return MyPromise.resolve(fn()).then(function () {
      return value;
    });
  }, function (error) {
    return MyPromise.resolve(fn()).then(function () {
      throw error
    });
  });
}

MyPromise.allSettled = function (promiseList) {
  return new MyPromise(function (resolve) {
    var length = promiseList.length;
    var result = [];
    var count = 0;

    if (length === 0) {
      return resolve(result);
    } else {
      for (var i = 0; i < length; i++) {

        (function (i) {
          var currentPromise = MyPromise.resolve(promiseList[i]);

          currentPromise.then(function (value) {
            count++;
            result[i] = {
              status: 'fulfilled',
              value: value
            }
            if (count === length) {
              return resolve(result);
            }
          }, function (reason) {
            count++;
            result[i] = {
              status: 'rejected',
              reason: reason
            }
            if (count === length) {
              return resolve(result);
            }
          });
        })(i)
      }
    }
  });
}

module.exports = MyPromise;
