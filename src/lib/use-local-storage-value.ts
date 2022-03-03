import { writable } from 'svelte/store';
import type { State } from './type';

export function useLocalStorageValue<T>(key: string, value: T): State<T> {
	const store = writable<T>(value);

	return {
		subscribe: store.subscribe,
		set:
			typeof window === 'undefined' || typeof window.localStorage === 'undefined'
				? store.set
				: (newValue: T) => {
						localStorage.setItem(key, JSON.stringify(newValue));
						store.set(newValue);
				  }
	};
}
