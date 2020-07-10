declare module 'ember-window-mock' {
  export default window;
}

declare module 'ember-window-mock/test-support' {
  export function setupWindowMock(hooks: { afterEach: (fn: () => void) => void }): void;
  export function reset(): void;
}
