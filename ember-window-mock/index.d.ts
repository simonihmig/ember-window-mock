declare module 'ember-window-mock' {
  export default window;
}

declare module 'ember-window-mock/test-support' {
  export function setupWindowMock(hooks: {
    afterEach: (fn: () => void) => void;
  }): void;
  export function reset(window?: typeof window): void;
  export function createMockedWindow(window?: typeof window): typeof window;
}
