module.exports = promise => {
  let done = false;
  let param, error;
  promise
    .then(p => {
      done = true;
      param = p;
    })
    .catch(e => {
      done = true;
      error = e;
    });
  return () => {
    if (done) {
      if (error != null) {
        throw error;
      }
      return param;
    }
    return promise;
  };
};
