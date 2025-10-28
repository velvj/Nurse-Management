// middleware/validation/nurseValidation.js
import * as yup from 'yup';
import moment from 'moment';

const baseSchema = {
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  licenseNumber: yup
    .string()
    .required("License Number is required")
    .matches(/^[A-Z0-9]+$/, "License Number must be alphanumeric")
    .length(5, "License Number must be exactly 5 characters"),

  dob: yup
    .date()
    .required("Date of Birth is required")
    // .test("valid-date", "Invalid date format (use DD-MM-YYYY or YYYY-MM-DD)", (value, ctx) => {
    //   const parsed = moment(value, ["YYYY-MM-DD", "DD-MM-YYYY"], true);
    //   if (!parsed.isValid()) return false;
    //   if (parsed.isAfter(moment())) {
    //     return ctx.createError({ message: "Date of Birth cannot be in the future" });
    //   }
    //   return true;
    // })
    ,

  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(18, "Age must be at least 18")
    .max(65, "Age must be at most 65"),
};

const nurseSchema = yup.object().shape(baseSchema);
const updateNurseSchema = yup.object().shape(baseSchema);

const createValidator = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.inner?.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {}) || { general: error.message };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
  };
};

export const validateNurse = () => createValidator(nurseSchema);
export const validateUpdateNurse = () => createValidator(updateNurseSchema);
