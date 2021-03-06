const express = require('express')
const { celebrate, Segments, Joi } = require('celebrate')

const SessionController = require('./controllers/SessionController')
const OngController = require('./controllers/OngController')
const IncidentController = require('./controllers/IncidentController')
const ProfileController = require('./controllers/ProfileController')

const routes = express.Router()

routes.post('/sessions', SessionController.create)

routes.get('/ongs', OngController.index)

routes.post('/ongs', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().pattern(/^(\+)?(\d){0,2}\s?(\(?(\d){0,2}\)?)\s?\d?\d{4}-?\d{4}$/),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    })
}), OngController.create)

routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page:Joi.number()
    })
}), IncidentController.index)

routes.post('/incidents', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required().length(8)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description:Joi.string().required(),
        value:Joi.number().required()
    })
}), IncidentController.create)

routes.delete('/incidents/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required().length(8)
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),
}), IncidentController.delete)

routes.get('/profile', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required().length(8)
    }).unknown()
}), ProfileController.index)

module.exports = routes