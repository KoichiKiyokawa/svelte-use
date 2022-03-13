import { onMount } from 'svelte';
import { noop } from 'svelte/internal';
import { isString } from '../core';

interface InferEventTarget<Events> {
	addEventListener(event: Events, fn?: any, options?: any): any;
	removeEventListener(event: Events, fn?: any, options?: any): any;
}

export type WindowEventName = keyof WindowEventMap;
export type DocumentEventName = keyof DocumentEventMap;

export interface GeneralEventListener<E = Event> {
	(evt: E): void;
}

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(
	event: E,
	listener: (this: Window, ev: WindowEventMap[E]) => any,
	options?: boolean | AddEventListenerOptions
): void;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(
	target: Window,
	event: E,
	listener: (this: Window, ev: WindowEventMap[E]) => any,
	options?: boolean | AddEventListenerOptions
): void;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof DocumentEventMap>(
	target: Document,
	event: E,
	listener: (this: Document, ev: DocumentEventMap[E]) => any,
	options?: boolean | AddEventListenerOptions
): void;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Custom event target with event type infer
 *
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<Names extends string, EventType = Event>(
	target: InferEventTarget<Names>,
	event: Names,
	listener: GeneralEventListener<EventType>,
	options?: boolean | AddEventListenerOptions
): void;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target fallback
 *
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<EventType = Event>(
	target: EventTarget | null | undefined,
	event: string,
	listener: GeneralEventListener<EventType>,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(...args: any[]) {
	let target: EventTarget;
	let event: string;
	let listener: any;
	let options: any;

	onMount(() => {
		if (isString(args[0])) {
			[event, listener, options] = args;
			target = window;
		} else {
			[target, event, listener, options] = args;
		}
		if (!target) return noop;

		target.addEventListener(event, listener, options);
		return () => {
			target.removeEventListener(event, listener, options);
		};
	});
}
