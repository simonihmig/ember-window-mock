import windowMockFactory from './services/window';

export function mockWindow(scope) {
  if (!scope) {
    throw new Error('mockWindow must be called with `this` as the first function parameter!');
  }

  let register = scope.register;

  if (scope.owner && scope.owner.register) {
    register = scope.owner.register;
  }

  if (!register) {
    throw new Error('mockWindow must be called from an unit/integration test!');
  }

  return register.call(scope, 'service:window', windowMockFactory(), { instantiate: false });
}
