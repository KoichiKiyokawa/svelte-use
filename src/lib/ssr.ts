import type { Awaitable } from './type';

export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

export interface StorageLikeAsync {
	getItem(key: string): Awaitable<string | null>;
	setItem(key: string, value: string): Awaitable<void>;
	removeItem(key: string): Awaitable<void>;
}

export interface SSRHandlersMap {
	getDefaultStorage: () => StorageLike | undefined;
	getDefaultStorageAsync: () => StorageLikeAsync | undefined;
	updateHTMLAttrs: (selector: string, attribute: string, value: string) => void;
}

const _global =
	typeof globalThis !== 'undefined'
		? globalThis
		: typeof window !== 'undefined'
		? window
		: typeof global !== 'undefined'
		? global
		: typeof self !== 'undefined'
		? self
		: {};
const globalKey = '__svelteuse_ssr_handlers__';
// @ts-expect-error inject global
_global[globalKey] = _global[globalKey] || {};
// @ts-expect-error inject global
const handlers: Partial<SSRHandlersMap> = _global[globalKey];

export function getSSRHandler<T extends keyof SSRHandlersMap>(
	key: T,
	fallback: SSRHandlersMap[T]
): SSRHandlersMap[T];
export function getSSRHandler<T extends keyof SSRHandlersMap>(
	key: T,
	fallback: SSRHandlersMap[T] | undefined
): SSRHandlersMap[T] | undefined;
export function getSSRHandler<T extends keyof SSRHandlersMap>(
	key: T,
	fallback?: SSRHandlersMap[T]
): SSRHandlersMap[T] | undefined {
	return (handlers[key] as SSRHandlersMap[T]) || fallback;
}
