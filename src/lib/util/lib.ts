export function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function isString(str: unknown) {
    return typeof str === "string" && str.trim().length > 0;
}

export function areStrings(arr: unknown[]) {
    let b = true;
    arr.forEach((e) => {
        if (!isString(e)) b = false;
    });
    return b;
}
