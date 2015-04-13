module.exports = {
    // Enforce model schema in the case of schemaless databases
    //  schema: true,

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

        fecha_nacimiento: {
            type: 'date',
            required: false
        },

        pais: {
            type: 'string',
            required: false
        },

        provincia: {
            type: 'string',
            required: false
        },

        ciudad: {
            type: 'string',
            required: false
        },

        calle: {
            type: 'string',
            required: false
        },

        numero_calle: {
            type: 'integer',
            required: false
        },

        departamento: {
            type: 'string',
            size: 1,
            required: false
        },

        personajes: {
            collection: 'personaje',
            via: 'duenio'
        },

        clases: {
            collection: 'clase',
            via: 'users',
            required: false
        },

        clase_x_user: {
            collection: 'clase_x_user',
            via: 'user',
            required: false
        },

        tipo: {
            type: 'string',
            enum: ['profesor', 'alumno','administrador']
        },

        institucion_x_user: {
            collection: 'institucion_x_user',
            via: 'user',
            required: false
        },

        instituciones: {
            collection: 'institucion',
            via: 'users',
            required: false
        },

        // passport
        username: {type: 'string', unique: true},
        email: {type: 'email', unique: true},
        passports: {collection: 'Passport', via: 'user'}
    }
};
