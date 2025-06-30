function validate(schema, target = 'body'){
    return (req, res, next) => {
        const data = req[target];

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                message: `No data found in ${target}`,
            });
        }

        const {error, value} = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true, 
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                message: `Validation failed for ${target}`,
                errors: errorMessages,
            });
        }
        req[target] = value; // Update the request with validated data
        next();
    };
}
export default validate;