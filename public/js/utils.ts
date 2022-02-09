export const pause = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getSelectedRadioValue = (name: string) => {
    let buttons = document.getElementsByName(name);

    buttons.forEach((b: HTMLInputElement) => {
        if (b.checked) return b.value;
    })

    return undefined;
}