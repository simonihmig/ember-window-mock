import windowMockFactory from './services/window';

export function mockWindow(scope) {
  if (!scope) {
    throw new Error('mockWindow must be called with `this` as the first function parameter!');
  }

  if (scope.owner && scope.owner.register) {
    return scope.owner.register('service:window', windowMockFactory(), { instantiate: false });
  } else if (scope.register) {
    return scope.register('service:window', windowMockFactory(), { instantiate: false });
  } else {
    throw new Error('mockWindow must be called from a unit/integration test!');
  }
}
