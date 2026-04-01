import joi from "joi";

const validateRegistringUser = (req, res, next) => {
  const schema = joi.object({
    firstName: joi
      .string()
      .min(3)
      .max(20)
      .required()
      .messages({
        "string.min": "First Name must be at least 3 characters long",
        "string.max": "First Name cannot exceed 20 characters",
        "any.required": "First Name is required",
      }),

    lastName: joi
      .string()
      .min(3)
      .max(20)
      .required()
      .messages({
        "string.min": "Last Name must be at least 3 characters long",
        "string.max": "Last Name cannot exceed 20 characters",
        "any.required": "Last Name is required",
      }),

    email: joi
      .string()
      .email()
      .required()
      .messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
      }),

    password: joi
      .string()
      .min(7)
      .max(30)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .messages({
        "string.min": "Password must be at least 7 characters",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase, one lowercase, one number, and one special character",
        "any.required": "Password is required",
      }),

      phone :joi.string()
      .min(10)
      .required()
      .pattern(/^\+?[\d\s\-\(\)]+$/)
      .messages({
         "string.min": "Phone Number must be at least 10 characters",
        "string.max": "Phone Number cannot exceed 10 characters",
        'string.pattern.base': 'Please provide a valid phone number'

      })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "validation failed",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }
  next();
};

const validateLoginCreditials = (req,res,next) =>{
    const schema = joi.object({
        email: joi.string()
        .email()
        .messages({
            'string.email':"enter valid email",
        
        }),
        phone:joi.string()
        .pattern(/^\+?[\d\s\-\(\)]+$/)
        .messages({
           "string.pattern":"enter valid phone number"
        }),

        password: joi.string()
        .min(7)
        .max(20)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .messages({
            'string.pattern' :"Password must contain at least one uppercase, one lowercase, one number, and one special character",
            'any.required':"password required"
        })

    })
    const {error} = schema.validate(req.body)
    if(error){
        
    return res.status(400).json({
      success: false,
      message: "validation failed",
      errors: error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
      })),
    });
    }
    next();
}

export { validateRegistringUser ,validateLoginCreditials};

