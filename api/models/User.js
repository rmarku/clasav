module.exports = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        nombre: {
            type: 'string',
            required: false //true
        },

        apellido: {
            type: 'string',
            required: false //true
        },

        sexo: {
            type: 'string',
            enum: ['masculino', 'femenino'],
            required: false //true
        },
        username: { type: 'string', unique: true },
        email: { type: 'email', unique: true},
        passports: { collection: 'Passport', via: 'user' }
    }
};