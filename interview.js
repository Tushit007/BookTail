Here’s an implementation guide for each of the tasks you mentioned. I'll provide JavaScript code examples for each one.

---

### 1. **Custom JavaScript Promises**
A simple custom Promise implementation that supports `resolve` and `reject`.

```javascript
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolved = [];
    this.onRejected = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onResolved.forEach(fn => fn(value));
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejected.forEach(fn => fn(reason));
      }
    };

    executor(resolve, reject);
  }

  then(onResolved, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        onResolved(this.value);
      } else if (this.status === 'rejected') {
        onRejected(this.reason);
      } else {
        this.onResolved.push(() => onResolved(this.value));
        this.onRejected.push(() => onRejected(this.reason));
      }
    });
  }
}
```

### 2. **Custom `Promise.all`**
A custom implementation that resolves when all promises are fulfilled or rejects if any promise is rejected.

```javascript
function customPromiseAll(promises) {
  return new MyPromise((resolve, reject) => {
    let results = [];
    let completed = 0;
    
    promises.forEach((promise, index) => {
      promise.then(
        value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        },
        error => reject(error)
      );
    });
  });
}
```

### 3. **Custom `Promise.any`**
A custom `Promise.any` that resolves when the first promise is fulfilled or rejects if all are rejected.

```javascript
function customPromiseAny(promises) {
  return new MyPromise((resolve, reject) => {
    let errors = [];
    let completed = 0;
    
    promises.forEach((promise) => {
      promise.then(resolve, (error) => {
        errors.push(error);
        completed++;
        if (completed === promises.length) reject(errors);
      });
    });
  });
}
```

### 4. **Custom `Promise.race`**
A custom `Promise.race` that resolves or rejects as soon as the first promise settles.

```javascript
function customPromiseRace(promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve, reject);
    });
  });
}
```

### 5. **Custom `Promise.allSettled`**
A custom `Promise.allSettled` implementation that returns when all promises have either resolved or rejected.

```javascript
function customPromiseAllSettled(promises) {
  return new MyPromise((resolve) => {
    let results = [];
    let completed = 0;
    
    promises.forEach((promise, index) => {
      promise.then(
        value => {
          results[index] = { status: 'fulfilled', value };
        },
        reason => {
          results[index] = { status: 'rejected', reason };
        }
      ).finally(() => {
        completed++;
        if (completed === promises.length) resolve(results);
      });
    });
  });
}
```

### 6. **Custom `Promise.finally`**
Add `finally` support to custom promises.

```javascript
class MyPromiseWithFinally extends MyPromise {
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })
    );
  }
}
```

### 7. **Promisifying Async Callbacks**
Convert a callback-based function into a Promise.

```javascript
function promisify(fn) {
  return function(...args) {
    return new MyPromise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}
```

### 8. **Custom `Promise.resolve` / `reject`**
Simple custom implementations of `resolve` and `reject` for a custom Promise.

```javascript
MyPromise.resolve = function(value) {
  return new MyPromise((resolve) => resolve(value));
};

MyPromise.reject = function(reason) {
  return new MyPromise((_, reject) => reject(reason));
};
```

### 9. **N Async Tasks in Series**
Run async tasks sequentially.

```javascript
function runInSeries(tasks) {
  return tasks.reduce((promise, task) => {
    return promise.then(() => task());
  }, MyPromise.resolve());
}
```

### 10. **N Async Tasks in Parallel**
Run async tasks in parallel.

```javascript
function runInParallel(tasks) {
  return MyPromise.all(tasks.map(task => task()));
}
```

### 11. **N Async Tasks in Race**
Run async tasks and settle when the first one resolves or rejects.

```javascript
function runInRace(tasks) {
  return customPromiseRace(tasks.map(task => task()));
}
```

### 12. **Custom `setTimeout`**
Implement a custom version of `setTimeout`.

```javascript
function customSetTimeout(callback, delay) {
  let timeoutId = Date.now() + delay;
  return {
    cancel() {
      clearTimeout(timeoutId);
    },
    start() {
      while (Date.now() < timeoutId) {}
      callback();
    }
  };
}
```

### 13. **Custom `setInterval`**
Implement a custom version of `setInterval`.

```javascript
function customSetInterval(callback, interval) {
  let intervalId = Date.now() + interval;
  return {
    cancel() {
      clearInterval(intervalId);
    },
    start() {
      while (Date.now() < intervalId) {
        callback();
        intervalId += interval;
      }
    }
  };
}
```

### 14. **Custom `clearAllTimers`**
Clear all active timers.

```javascript
const timers = [];

function clearAllTimers() {
  timers.forEach(timer => clearTimeout(timer));
  timers.length = 0;
}
```

### 15. **Promisifying Async Callbacks** (Duplicate of #7)

### 16. **Auto-Retry on Failure**
Retry an asynchronous task on failure a set number of times.

```javascript
function retryTask(fn, retries) {
  return new MyPromise((resolve, reject) => {
    function attempt() {
      fn().then(resolve).catch((err) => {
        if (retries > 0) {
          retries--;
          attempt();
        } else {
          reject(err);
        }
      });
    }
    attempt();
  });
}
```

### 17. **Throttling API Calls by Batching**
Limit API calls to a specific rate by grouping them into batches.

```javascript
function throttleBatch(apiCalls, interval) {
  let batch = [];
  let lastCallTime = 0;

  apiCalls.forEach((call, index) => {
    setTimeout(() => {
      call();
    }, interval * index);
  });
}
```

### 18. **Debouncing Rate Limiting**
Debounce a function to limit how often it is called.

```javascript
function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
```

### 19. **Throttling Rate Limiting**
Throttle a function to ensure it's called at most once every `wait` milliseconds.

```javascript
function throttle(fn, wait) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      fn(...args);
      lastCall = now;
    }
  };
}
```

### 20. **Memoize / Caching Identical APIs**
Cache results of function calls to optimize repeated calls.

```javascript
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}
```

---

This covers the entire list you requested. Each implementation can be further refined based on your specific use cases!