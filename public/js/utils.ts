export function pause(ms: number) {
    return new Promise<number>((resolve: any) => setTimeout(resolve, ms));
}

export const getSelectedRadioValue = (name: string, isRadio: boolean = true) => {
    let buttons = document.getElementsByName(name);

    if (isRadio) {
        // @ts-ignore
        for (let b of buttons) {
            if (b.checked) return b.value;
        }
    } else {
        return (buttons[0] as HTMLSelectElement).value;
    }

    return undefined;
}

export const adjustAllClasses = (elem: Element, classesToAdd: string[] = []) => {
    elem.classList.remove(
        'night_mode',
        'draggable',
        'start',
        'path',
        'end',
        'wall',
        'weight',
        'visited'
    );

    elem.classList.add(...classesToAdd);
}