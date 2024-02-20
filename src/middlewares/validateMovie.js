const Joi = require("joi");

const userSchema = Joi.object({
  title: Joi.string().max(255).required(),
  director: Joi.string().max(255).required(),
  year: Joi.number().required(),
  color: Joi.string().max(255).required(),
  duration: Joi.number().required(),
});

const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;
  const { error } = userSchema.validate(
    { title, director, year, color, duration },

    { abortEarly: false }
  );
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = validateMovie;
// const validateMovie = (req, res, next) => {
//   const { title, director, year, color, duration } = req.body;
//   const errors = [];
//   if (title == null) {
//     errors.push({ field: "title", message: "IL MANQUE QUELQUECHOSE LA" });
//   } else if (title.length >= 255) {
//     errors.push({
//       field: "title",
//       message: "Should contain less than 255 characters",
//     });
//   }

//   if (director == null) {
//     errors.push({ field: "director", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
//   }

//   if (year == null) {
//     errors.push({ field: "year", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
//   }

//   if (color == null) {
//     errors.push({ field: "color", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
//   }

//   if (duration == null) {
//     errors.push({ field: "duration", message: "AAAAAAAAAAAAAAAAAAAAAAAAA" });
//   }

//   if (errors.length) {
//     res.status(422).json({ validationErrors: errors });
//   } else {
//     next();
//   }
// };
