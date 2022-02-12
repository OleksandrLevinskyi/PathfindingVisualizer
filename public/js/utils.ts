export function pause(ms: number) {
    return new Promise<number>((resolve: any) => setTimeout(resolve, ms));
}

export const getSelectedRadioValue = (name: string) => {
    let buttons = document.getElementsByName(name);

    // @ts-ignore
    for (let b of buttons){
        if (b.checked) return b.value;
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