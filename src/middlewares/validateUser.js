const Joi = require("joi");

const userSchema = Joi.object({
  firstname: Joi.string().max(255).required(),
  lastname: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  city: Joi.string().max(255).required(),
  language: Joi.string().max(255).required(),
});

const validateUser = (req, res, next) => {
  const { firstname, lastname, email, city, language } = req.body;
  const { error } = userSchema.validate(
    { firstname, lastname, email, city, language },

    { abortEarly: false }
  );
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = validateUser;
// const validateUser = (req, res, next) =>
// const { firstname, lastname, email, city, language } = req.body;
// const errors = [];
// if (firstname == null) {
//   errors.push({ field: "firstname", message: "IL MANQUE QUELQUECHOSE LA" });
// } else if (firstname.length >= 255) {
//   errors.push({
//     field: "title",
//     message: "Should contain less than 255 characters",
//   });
// }

// if (lastname == null) {
//   errors.push({ field: "director", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
// }
// const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
// if (!emailRegex.test(email)) {
//   errors.push({ field: "email", message: "EMAIL PAS VALIDE" });
// }

// if (city == null) {
//   errors.push({ field: "color", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
// }

// if (language == null) {
//   errors.push({ field: "duration", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
// }

// if (errors.length) {
//   res.status(422).json({ validationErrors: errors });
// } else {
//   next();
// }
// };
