type EventTypeMapping<T extends unknown[] = unknown[]> = Record<string, T>;
type GetEventKeys<T extends EventTypeMapping> = keyof T;
type EventEmitterCbMapping<T extends EventTypeMapping> = {
  [Key in keyof T]: ((...args: T[Key]) => void)[];
};

interface IEventEmitter<T extends EventTypeMapping> {
  emit<N extends GetEventKeys<T>>(name: N, args: T[N]): void;
  on<N extends GetEventKeys<T>>(name: N, cb: (...args: T[N]) => void): void;
}

abstract class EventEmitter<T extends EventTypeMapping>
  implements IEventEmitter<T>
{
  private readonly listeners: Partial<EventEmitterCbMapping<T>> = {};
  emit<N extends GetEventKeys<T>>(name: N, args: T[N]): void {
    const listeners = this.listeners[name];
    if (!listeners) return;
    for (const listener of listeners) {
      listener(...args);
    }
  }

  public on<N extends GetEventKeys<T>>(
    name: N,
    cb: (...args: T[N]) => void
  ): void {
    if (!this.listeners[name]) {
      this.listeners[name] = [cb];
    } else {
      this.listeners[name]?.push(cb);
    }
  }
}

interface IReactiveValue<T = unknown>
  extends IEventEmitter<{
    update: [T];
  }> {
  get(): T;
}

abstract class ReactiveValue<T>
  extends EventEmitter<{
    update: [T];
  }>
  implements IReactiveValue<T>
{
  protected value!: T;

  constructor() {
    super();
  }

  public get(): T {
    return this.value;
  }
}

export class State<T> extends ReactiveValue<T> {
  constructor(value: T) {
    super();
    this.set(value);
  }

  public set(value: T): void {
    this.value = value;
    this.emit('update', [this.value]);
  }
}

export class Computed<T> extends ReactiveValue<T> {
  constructor(private cb: () => T, dependencies: IReactiveValue[]) {
    super();
    this.set(this.cb());
    effect(() => this.set(this.cb()), dependencies);
  }

  private set(value: T): void {
    this.value = value;
    this.emit('update', [this.value]);
  }
}

export function effect(cb: () => void, dependencies: IReactiveValue[]) {
  for (const dep of dependencies) {
    cb();
    dep.on('update', cb);
  }
}
