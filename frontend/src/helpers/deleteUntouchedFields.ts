const whitelist = ['type'];

const deleteUntouchedFields = (data, fields) => {
    fields.forEach((field) => {
        if (whitelist.includes(field.name)) return;
        if (!field.meta.dirty) {
            delete data[field.label];
        }
    });
};

export {deleteUntouchedFields};
