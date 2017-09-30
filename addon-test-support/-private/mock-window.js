import WindowMockService from '../services/window-mock';

export function mockWindow(scope) {
  if (!scope) {
    throw new Error('mockWindow must be called with `this` as the first function parameter!');
  }
  if (!scope.register) {
    throw new Error('mockWindow must be called from an integration test!');
  }
  return scope.register('service:window', WindowMockService, { instantiate: false });
}
