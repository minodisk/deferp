# deferp

Defer the results of Promise.

## Installation

```bash
yarn add deferp
```

## Usage

```js
const deferp = require("deferp");
(async () => {
  const deferred = deferp(asyncFunc());
  await anotherAsyncFunc();
  await deferred(); // -> receive the result regardless of whether asyncFunc is complete or not
})();
```

## Why should be wrapped with deferp?

Events that will be emitted at the time of the subsequent Promise will need to listen before the emit.
If `await` for the event listener to be called at that time, it will be blocked, so you must await after the emit.
When writing such code, there are cases where calling of the event handler has ended at the timing of await.
If rejected at such timing, `try-catch` can not be done even by the caller.

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();
const wait = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};
const waitForEvent = async event => {
  return new Promise((resolve, reject) => {
    emitter.on(event, () => {
      reject(new Error("catch me if you can"));
    });
  });
};

(async () => {
  try {
    const promise = waitForEvent("foo");
    await emitter.emit("foo");
    await wait(1000);
    await promise;
  } catch (err) {
    console.log("caught:", err);
  }
})();
```

This code seems to be able to catch an error. But, `UnhandledPromiseRejectionWarning` is warned by Node runtime and finally catching errors.

To avoid this, wrap with `deferp`:

```js
(async () => {
  try {
    const deferred = deferp(waitForEvent("foo"));
    await emitter.emit("foo");
    await wait(1000);
    await deferred();
  } catch (err) {
    console.log("caught:", err);
  }
})();
```

The error can be caught at `catch` block properly.
