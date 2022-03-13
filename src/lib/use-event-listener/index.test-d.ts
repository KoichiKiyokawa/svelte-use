import { useEventListener } from '.';

const fn: (ev: KeyboardEvent) => void = () => {};

useEventListener('keydown', fn);
useEventListener(window, 'keydown', fn);
useEventListener(document, 'keydown', fn);

let element: HTMLInputElement;
useEventListener(element, 'input', fn);
