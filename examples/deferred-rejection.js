const EventEmitter = require("events");
const deferp = require("..");

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
    const deferred = deferp(waitForEvent("foo"));
    await emitter.emit("foo");
    await wait(1000);
    await deferred();
  } catch (err) {
    console.log("caught:", err); // -> Yay!
  }
})();
