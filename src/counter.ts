const button = document.querySelector<HTMLButtonElement>("#counter")!;

export function setupCounter() {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    button.innerHTML = `counts is ${counter}`;
  };
  button.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
