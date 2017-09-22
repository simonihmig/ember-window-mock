export function lookupWindow(scope) {
  let container = scope.container || (scope.application && scope.application.__container__);
  if (!container) {
    throw new Error('No container found to lookup service from!');
  }
  return container.lookup('service:window');
}
