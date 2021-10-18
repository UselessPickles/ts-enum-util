export default (timeout: number) =>
  new Promise((res) => {
    setTimeout(res, timeout);
  });
