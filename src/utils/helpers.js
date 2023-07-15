// debouncer logic for use in submit button when we use API for submit
// we can use lodash debouncer too
export  function debounce(func, delay) {
  return (...arg) => {
    setTimeout(() => {
      func(...arg);
    }, delay);
  }
}