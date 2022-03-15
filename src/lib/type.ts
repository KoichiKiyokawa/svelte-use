import type { Writable } from 'svelte/store';

export type State<T> = Omit<Writable<T>, 'update'>;

/**
 * Any function
 */
export type Fn = () => void;

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
	fn: FunctionArgs<Args, This>;
	args: Args;
	thisArg: This;
}

export type Awaitable<T> = Promise<T> | T;

export type EventFilter<Args extends any[] = any[], This = any> = (
	invoke: Fn,
	options: FunctionWrapperOptions<Args, This>
) => void;

export interface ConfigurableEventFilter {
	/**
	 * Filter for if events should to be received.
	 *
	 * @see https://vueuse.org/guide/config.html#event-filters
	 */
	eventFilter?: EventFilter;
}

export interface ConfigurableWindow {
	/*
	 * Specify a custom `window` instance, e.g. working with iframes or in testing environments.
	 */
	window?: Window;
}
