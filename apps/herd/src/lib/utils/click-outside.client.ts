/**
 * usage example `use:clickOutside={handleCallback}`
 */
export function clickOutside(element: HTMLElement, callback: () => void) {
    // implementation...

    const handleClick = (event: Event) => {
        const target = event.target as HTMLElement;

        if (!event.target) {
            return;
        }

        if (element && !element.contains(target) && !event.defaultPrevented) {
            callback();
        }
    };

    document.body.addEventListener("click", handleClick);

    return {
        destroy() {
            // cleanup..
            document.body.removeEventListener("click", handleClick);
        },
    };
}
