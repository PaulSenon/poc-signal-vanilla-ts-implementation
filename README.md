# Basic Signal implementation Vanilla Typesctipt

This is just a little personal challenge of implementing the specs given in this medium article: [https://medium.com/@tomaszs2/signals-to-become-part-of-javascript-64ce72009f69]()

This is basically implementing reactive value and effetc callback wrapper a bit like it's made in React.

This is not optimized at all.
Possible improvments:

- [ ] use native js get for value access
- [ ] better typing (don't expose emit/set for computed values)
- [ ] prevent unnecessary updates
  - [ ] update only once each reaction for one update
  - [ ] agregate multi change in batches for single update on multi value change "at once"

Everything is in `./src/Signal.ts`

## Example

```tsx
// Equivalent in React
() => {
  const [counter, setCounter] = useSate(0);
  useEffect(() => {
    console.log('counter update', couter);
  }, [counter]);

  return <>
    <button onclick={() => setCounter(counter+1)}>+1</button>
  </>
}
```

```ts
// Equivalent in my shitty Signal implementation
const appRootElement = document.getElementById('app-root');
appRootElement.innerHtml = `<button id="myButton">+1</button>`;

const counter = new Signal.State(0);
Signal.effect(() => {
  console.log('counter update', couter.get());
}, [counter]);

const myButton = document.getElementById('myButton') as HTMLButtonElement;
myButton.onclick = () => counter.set(coutner.get() +1);
```
