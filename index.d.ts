declare module 'ember-window-mock' {
  export default window;
  export function setupWindowMock(hooks: { afterEach: (fn: () => void) => void }): void;
  export function reset(): void;
}
