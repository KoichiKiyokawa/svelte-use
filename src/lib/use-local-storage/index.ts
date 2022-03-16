import { defaultWindow } from '$lib/core';
import { useStorage, type StorageOptions } from '$lib/use-storage';
import type { State } from '../type';

export function useLocalStorage(
	key: string,
	initialValue: string,
	options?: StorageOptions<string>
): State<string>;
export function useLocalStorage(
	key: string,
	initialValue: boolean,
	options?: StorageOptions<boolean>
): State<boolean>;
export function useLocalStorage(
	key: string,
	initialValue: number,
	options?: StorageOptions<number>
): State<number>;
export function useLocalStorage<T>(key: string, initialValue: T, options?: StorageOptions<T>): T;
export function useLocalStorage<T = unknown>(
	key: string,
	initialValue: null,
	options?: StorageOptions<T>
): State<T>;

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options: StorageOptions<T> = {}
): State<T> {
	return useStorage(key, initialValue, (options.window || defaultWindow)?.localStorage, options);
}
