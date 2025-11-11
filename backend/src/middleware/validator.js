const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors
      });
    }

    next();
  };
};

// Schemas de validação
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
    name: Joi.string().min(2).required().messages({
      'string.min': 'Nome deve ter no mínimo 2 caracteres',
      'any.required': 'Nome é obrigatório'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createVinyl: Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Título é obrigatório'
    }),
    artist: Joi.string().required().messages({
      'any.required': 'Artista é obrigatório'
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),
    categoryId: Joi.string().uuid().required(),
    coverImage: Joi.string().uri().allow(null, ''),
    barcode: Joi.string().allow(null, ''),
    label: Joi.string().allow(null, ''),
    format: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, ''),
    discogsId: Joi.string().allow(null, ''),
    musicbrainzId: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    condition: Joi.string().valid('mint', 'near_mint', 'very_good', 'good', 'fair', 'poor').allow(null),
    purchasePrice: Joi.number().positive().allow(null),
    purchaseDate: Joi.date().allow(null),
    tracks: Joi.array().items(
      Joi.object({
        position: Joi.string().required(),
        title: Joi.string().required(),
        duration: Joi.string().allow(null, '')
      })
    ).allow(null)
  }),

  updateVinyl: Joi.object({
    title: Joi.string(),
    artist: Joi.string(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),
    categoryId: Joi.string().uuid(),
    coverImage: Joi.string().uri().allow(null, ''),
    barcode: Joi.string().allow(null, ''),
    label: Joi.string().allow(null, ''),
    format: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    condition: Joi.string().valid('mint', 'near_mint', 'very_good', 'good', 'fair', 'poor').allow(null),
    purchasePrice: Joi.number().positive().allow(null),
    purchaseDate: Joi.date().allow(null)
  }).min(1),

  updateUser: Joi.object({
    name: Joi.string().min(2),
    avatar: Joi.string().uri().allow(null, ''),
    isPublic: Joi.boolean()
  }).min(1)
};

module.exports = { validate, schemas };

