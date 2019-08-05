export const Required = () => (target: object, propertyKey: string) => {
    const internalPropKey = propertyKey + 'RequiredInternal';
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
};
