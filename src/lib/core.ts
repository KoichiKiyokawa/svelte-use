export const isBrowser = typeof window !== 'undefined';
export const isString = (val: unknown): val is string => typeof val === 'string';
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const defaultWindow = /* #__PURE__ */ isBrowser ? window : undefined;
