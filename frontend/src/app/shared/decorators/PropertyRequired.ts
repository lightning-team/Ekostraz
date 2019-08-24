export function Required() {
    return (target: object, propertyKey: string) => {
        const internalPropKey = propertyKey + 'RequiredInternal';
        defineComponentProp(target, internalPropKey, propertyKey);
        resetInternalPropOnDestroy(target, internalPropKey);
    };
}

function defineComponentProp(target: object, internalPropKey: string, propertyKey: string) {
    target[internalPropKey] = undefined;
    Object.defineProperty(target, propertyKey, {
        get() {
            const value = target[internalPropKey];
            if (!value) {
                throw new Error(`Attribute ${propertyKey} is required`);
            }
            return value;
        },
        set(value) {
            target[internalPropKey] = value;
        }
    });
}

/* tslint:disable:no-string-literal */
function resetInternalPropOnDestroy(target: object, internalPropKey) {
    const originalOnDestroy = target['ngOnDestroy'];
    const wrappedOnDestroy = () => {
        originalOnDestroy();
        target[internalPropKey] = undefined;
    };
    const newOnDestroy = () => target[internalPropKey] = undefined;

    target['ngOnDestroy'] = originalOnDestroy ? wrappedOnDestroy : newOnDestroy;
}
