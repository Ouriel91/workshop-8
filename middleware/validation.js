const {body, validationResult, checkSchema} = require('express-validator');

function validate() {
    return [
        body('id', 'id not valid number').exists().isNumeric(),
        body('name', 'name dosn`t not exists or invalid').exists().isString().escape(),
        body('gender', 'password doesn\'t exists').isIn(['male', 'female']),
        (req, res, next) => {
            try {
                validationResult(req).throw();
                next();
            } catch (err) {
                console.log(err);
                res.status(400).json({
                    status: 400,
                    error: err.errors.map(value => value.msg).join()
                });
            }
        }
    ];
}

function validateSchema(schema) {
    const validationMiddleware = checkSchema(schema);
    return async (req, res, next) => {
        await validationMiddleware.run(req);
        const result = validationResult(req);
        if (result.isEmpty()) {
            next();
            return;
        }
        const error = Error(result.array().map(value => value.msg).join());
        error.statusCode = 400;
        next(error);
    };
}

//TODO 5: Add missing fields
const jediSchema = {
    id: {
        isInt: true,
        errorMessage: 'ID is wrong',
        in: ['body']
    },
    name: {
        isString: {
            errorMessage: "Name is wrong"
        },
        isLength: {
            errorMessage: 'Name should be 4 chars long',
            options: {min: 4},
        },
        in: ['body']
    },
    height: {
        isInt: {
            options: {
                gt: 10,
                lt: 300
            },
            errorMessage: "Height should be between 10 and 300"
        },
        in: ['body']
    },
    mass: {
        isInt: {
            options: {
                gt: 0
            },
            errorMessage: "Mass should be greater than 0"
        },
        in: ['body']
    },
    hair_color: {
        isString: {
            errorMessage: "Hair color is wrong"
        },
        isLength: {
            errorMessage: 'hair_color should be 3 chars long',
            options: {min: 3},
        },
        in: ['body']
    },
    skin_color: {
        isString: {
            errorMessage: "skin_color color is wrong"
        },
        isLength: {
            errorMessage: 'skin_color should be 3 chars long',
            options: {min: 3},
        },
        in: ['body']
    },
    birth_year: {
        isString: {
            errorMessage: "birth_year color is wrong"
        },
        isLength: {
            errorMessage: 'birth_year should be 4 chars long',
            options: {min: 4},
        },
        in: ['body']
    },
    eye_color: {
        isString: {
            errorMessage: "eye_color color is wrong"
        },
        isLength: {
            errorMessage: 'eye_color should be 4 chars long',
            options: {min: 4},
        },
        in: ['body']
    },
    gender: {
        isString: {
            errorMessage: "Gender is wrong"
        },
        in: ['body']
    },
};

module.exports = {
    validateSchema,
    jediSchema
};