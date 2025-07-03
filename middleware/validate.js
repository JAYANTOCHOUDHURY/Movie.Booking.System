// middleware/validate.js
const validate = (bodySchema, paramSchema, querySchema) => {
  return (req, res, next) => {
    if (bodySchema) {
      const { error } = bodySchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
    }

    if (paramSchema) {
      const { error } = paramSchema.validate(req.params);
      if (error) return res.status(400).json({ message: error.details[0].message });
    }

    if (querySchema) {
      const { error } = querySchema.validate(req.query);
      if (error) return res.status(400).json({ message: error.details[0].message });
    }

    next();
  };
};

module.exports = validate;
