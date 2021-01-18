export default function mockFunction(origFn, context) {
  return new Proxy(origFn, {
    apply(t, thisArg, argumentsList) {
      return origFn.apply(context, argumentsList);
    },
  });
}
