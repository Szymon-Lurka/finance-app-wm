const isEmpty = (val: unknown) => val === '' || val === null || val === undefined || typeof val === 'number';

export {
    isEmpty
}