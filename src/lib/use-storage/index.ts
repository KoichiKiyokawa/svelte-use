import type { ConfigurableWindow, State } from '$lib/type';
import { writable } from 'svelte/store';
import type { StorageLike } from '../ssr';
import { getSSRHandler } from '../ssr';
import { useEventListener } from '../use-event-listener';
import { defaultWindow } from '../core';

export interface Serializer<T> {
	read(raw: string): T;
	write(value: T): string;
}

export interface SerializerAsync<T> {
	read(raw: string): Promise<T> | T;
	write(value: T): Promise<string> | string;
}

export const StorageSerializers: Record<
	'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set',
	Serializer<any>
> = {
	boolean: {
		read: (v: any) => v === 'true',
		write: (v: any) => String(v)
	},
	object: {
		read: (v: any) => JSON.parse(v),
		write: (v: any) => JSON.stringify(v)
	},
	number: {
		read: (v: any) => Number.parseFloat(v),
		write: (v: any) => String(v)
	},
	any: {
		read: (v: any) => v,
		write: (v: any) => String(v)
	},
	string: {
		read: (v: any) => v,
		write: (v: any) => String(v)
	},
	map: {
		read: (v: any) => new Map(JSON.parse(v)),
		write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries()))
	},
	set: {
		read: (v: any) => new Set(JSON.parse(v)),
		write: (v: any) => JSON.stringify(Array.from((v as Set<any>).entries()))
	}
};

export interface StorageOptions<T> extends ConfigurableWindow {
	/**
	 * Listen to storage changes, useful for multiple tabs application
	 *
	 * @default true
	 */
	listenToStorageChanges?: boolean;

	/**
	 * Write the default value to the storage when it does not exist
	 *
	 * @default true
	 */
	writeDefaults?: boolean;

	/**
	 * Custom data serialization
	 */
	serializer?: Serializer<T>;

	/**
	 * On error callback
	 *
	 * Default log error to `console.error`
	 */
	onError?: (error: unknown) => void;

	/**
	 * Use shallow ref as reference
	 *
	 * @default false
	 */
	shallow?: boolean;
}

export function useStorage(
	key: string,
	initialValue: string,
	storage?: StorageLike,
	options?: StorageOptions<string>
): State<string>;
export function useStorage(
	key: string,
	initialValue: boolean,
	storage?: StorageLike,
	options?: StorageOptions<boolean>
): State<boolean>;
export function useStorage(
	key: string,
	initialValue: number,
	storage?: StorageLike,
	options?: StorageOptions<number>
): State<number>;
export function useStorage<T>(
	key: string,
	initialValue: T,
	storage?: StorageLike,
	options?: StorageOptions<T>
): State<T>;
export function useStorage<T = unknown>(
	key: string,
	initialValue: null,
	storage?: StorageLike,
	options?: StorageOptions<T>
): State<T>;

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 * @param key
 * @param initialValue
 * @param storage
 * @param options
 */
export function useStorage<T extends string | number | boolean | object | null>(
	key: string,
	initialValue: T,
	storage: StorageLike | undefined,
	options: StorageOptions<T> = {}
): State<T> {
	const {
		listenToStorageChanges = true,
		writeDefaults = true,
		window = defaultWindow,
		onError = (e) => {
			console.error(e);
		}
	} = options;

	const type = guessSerializerType<T>(initialValue);
	const data = writable<T>(initialValue);
	const serializer = options.serializer ?? StorageSerializers[type];

	if (!storage) {
		try {
			storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)();
		} catch (e) {
			onError(e);
		}
	}

	function read(event?: StorageEvent) {
		if (!storage || (event && event.key !== key)) return;

		try {
			const rawValue = event ? event.newValue : storage.getItem(key);
			if (rawValue == null) {
				data.set(initialValue);
				if (writeDefaults && initialValue !== null)
					storage.setItem(key, serializer.write(initialValue));
			} else if (typeof rawValue !== 'string') {
				data.set(rawValue);
			} else {
				data.set(serializer.read(rawValue));
			}
		} catch (e) {
			onError(e);
		}
	}

	read();

	if (window && listenToStorageChanges)
		useEventListener(window, 'storage', (e) => setTimeout(() => read(e), 0));

	return {
		subscribe: data.subscribe,
		set: data.set
	};
}

function guessSerializerType<T extends string | number | boolean | object | null>(rawInit: T) {
	return rawInit == null
		? 'any'
		: rawInit instanceof Set
		? 'set'
		: rawInit instanceof Map
		? 'map'
		: typeof rawInit === 'boolean'
		? 'boolean'
		: typeof rawInit === 'string'
		? 'string'
		: typeof rawInit === 'object'
		? 'object'
		: Array.isArray(rawInit)
		? 'object'
		: !Number.isNaN(rawInit)
		? 'number'
		: 'any';
}
