import { RefObject, useEffect } from "react";

export default function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: MouseEvent) => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const el = ref?.current;
            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };
        document.addEventListener(`mousedown`, listener);
        return () => {
            document.removeEventListener(`mousedown`, listener);
        };
    }, [ref, handler]);
}
