import * as Signal from './Signal';
import './style.css';

const textElem = document.getElementById('count-text') as HTMLDivElement;
const btElem = document.getElementById('count-button') as HTMLButtonElement;
const btToggle = document.getElementById('style-toggle') as HTMLButtonElement;

const toggle = new Signal.State(false);
const counter = new Signal.State(0);
const isEven = new Signal.Computed(() => (counter.get() & 1) == 0, [counter]);
const parity = new Signal.Computed(
  () => (isEven.get() ? 'even' : 'odd'),
  [isEven]
);

Signal.effect(
  () =>
    (textElem.innerText = `${counter.get().toString(10)} (${parity.get()})`),
  [counter, parity]
);
Signal.effect(() => {
  btToggle.innerText = toggle.get() ? 'ON' : 'OFF';
  textElem.style.backgroundColor = toggle.get() ? 'red' : 'inherit';
}, [toggle]);
btElem.onclick = () => counter.set(counter.get() + 1);
btToggle.onclick = () => toggle.set(!toggle.get());

// Simulate external updates to counter...
// setInterval(() => counter.set(counter.get() + 1), 1000);
