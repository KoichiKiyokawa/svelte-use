import type { Writable } from 'svelte/store';

export type State<T> = Omit<Writable<T>, 'update'>;
