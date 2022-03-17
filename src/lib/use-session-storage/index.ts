import { defaultWindow } from '$lib/core';
import type { State } from '$lib/type';
import { useStorage, type StorageOptions } from '../use-storage';

export function useSessionStorage(
	key: string,
	initialValue: string,
	options?: StorageOptions<string>
): State<string>;
export function useSessionStorage(
	key: string,
	initialValue: boolean,
	options?: StorageOptions<boolean>
): State<boolean>;
export function useSessionStorage(
	key: string,
	initialValue: number,
	options?: StorageOptions<number>
): State<number>;
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
	options?: StorageOptions<T>
): State<T>;
export function useSessionStorage<T = unknown>(
	key: string,
	initialValue: null,
	options?: StorageOptions<T>
): State<T>;

/**
 * Reactive SessionStorage.
 *
 * @see https://vueuse.org/useSessionStorage
 * @param key
 * @param initialValue
 * @param options
 */
export function useSessionStorage<T extends string | number | boolean | object | null>(
	key: string,
	initialValue: T,
	options: StorageOptions<T> = {}
): State<any> {
	const { window = defaultWindow } = options;
	return useStorage(key, initialValue, window?.sessionStorage, options);
}
