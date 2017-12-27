const deferp = require("..");

const fail = async delay => {
  if (delay == null) {
    throw "failed";
  }
  await wait(delay);
  throw "failed";
};

const success = async delay => {
  if (delay == null) {
    return "succeed";
  }
  await wait(delay);
  return "succeed";
};

const wait = delay => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

describe("deferp", async () => {
  it("should receive result from Promise resolved immediately", async () => {
    expect.assertions(1);
    const deferred = deferp(success());
    await wait(200);
    try {
      const result = await deferred();
      expect(result).toBe("succeed");
    } catch (err) {
      expect(false).toBe(true);
    }
  });

  it("should receive result from Promise resolved before finishing next await", async () => {
    expect.assertions(1);
    const deferred = deferp(success(100));
    await wait(200);
    try {
      const result = await deferred();
      expect(result).toBe("succeed");
    } catch (err) {
      expect(false).toBe(true);
    }
  });

  it("should receive result from Promise resolved after finishing next await", async () => {
    expect.assertions(1);
    const deferred = deferp(success(300));
    await wait(200);
    try {
      const result = await deferred();
      expect(result).toBe("succeed");
    } catch (err) {
      expect(false).toBe(true);
    }
  });

  it("should catch error from Promise thrown immediately", async () => {
    expect.assertions(1);
    const deferred = deferp(fail());
    await wait(200);
    try {
      const result = await deferred();
      expect(false).toBe(true);
    } catch (err) {
      expect(err).toBe("failed");
    }
  });

  it("should catch error from Promise thrown before finishing next await", async () => {
    expect.assertions(1);
    const deferred = deferp(fail(100));
    await wait(200);
    try {
      const result = await deferred();
      expect(false).toBe(true);
    } catch (err) {
      expect(err).toBe("failed");
    }
  });

  it("should catch error from Promise thrown after finishing next await", async () => {
    expect.assertions(1);
    const deferred = deferp(fail(300));
    await wait(200);
    try {
      const result = await deferred();
      expect(false).toBe(true);
    } catch (err) {
      expect(err).toBe("failed");
    }
  });
});
