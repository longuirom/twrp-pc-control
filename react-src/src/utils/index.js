export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function addLog(log) {
  const p = document.createElement("p");
  p.textContent = log;
  document.getElementById("log")?.prepend(p);
  // p.remove();
}
