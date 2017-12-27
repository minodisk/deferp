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
    console.log("caught:", err); // -> Finally can be caught, but UnhandledPromiseRejectionWarning is thrown.
  }
})();
