const { celebrate, Segments, Joi } = require('celebrate')

// tag a ser passada em requisições post, put e delete.
const tagRequired = Joi.object().keys({
  id: Joi.number().integer().positive().allow(0),
  name: Joi.string().required(),
  value: Joi.string().required()
})

// fullTag a ser passada em requisições post, put e delete.
const fullTagRequired = Joi.object().keys({
  entityType: Joi.string().valid('problem', 'language', 'site', 'site/user').required(),
  entityId: Joi.alternatives().conditional('entityType', {
    is: 'site/user', 
    then: Joi.string().regex(/^\d+\/\d+$/).required(),
    otherwise: Joi.number().integer().positive().allow(0).required()
  }),
  tag: Joi.array().items(tagRequired).required()
})

// Middleware para requisições get Site User
const middlewareTypeSiteUser = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    contestId: Joi.number().integer().positive().allow(0).required(),
    entitySite: Joi.number().integer().positive().allow(0).required(),
    entityUser: Joi.number().integer().positive().allow(0).required()
  }),

  [Segments.QUERY]: Joi.object().keys({
    tagId: Joi.number().integer().positive().allow(0),
    tagName: Joi.string(),
    tagValue: Joi.string()
  })
})

// Middleware para requisições get.
const middlewareType1 = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    contestId: Joi.number().integer().positive().allow(0).required(),
    entityType: Joi.string().valid('problem', 'language', 'site').required(),
    entityId: Joi.number().integer().positive().allow(0).required()
  }),

  [Segments.QUERY]: Joi.object().keys({
    tagId: Joi.number().integer().positive().allow(0),
    tagName: Joi.string(),
    tagValue: Joi.string()
  })
})

// Middleware para requisições post, put e delete.
const middlewareType2 = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    contestId: Joi.number().integer().positive().allow(0).required()
  }),

  [Segments.BODY]: Joi.object().keys({
    entityTag: Joi.array().items(fullTagRequired).required()
  })
})

// Middleware para delete de tags
const middlewareTags = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    contestId: Joi.number().integer().positive().allow(0).required()
  }),

  [Segments.BODY]: Joi.object().keys({
    tags: Joi.array().items(tagRequired).required()
  })
})

// Middleware para recuperar entidades de acordo com uma tag.
const middlewareGetEntities = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    contestId: Joi.number().integer().positive().allow(0).required(),
    entityType: Joi.string().valid('problem', 'language', 'site').required(),
  }),

  [Segments.QUERY]: Joi.object().keys({
    tagName: Joi.string(),
    tagValue: Joi.string()
  })
})

// Middleware para recuperar entidades do tipo site/user de acordo com uma tag.
const middlewareGetSiteUser = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    contestId: Joi.number().integer().positive().allow(0).required(),
  }),

  [Segments.QUERY]: Joi.object().keys({
    tagName: Joi.string(),
    tagValue: Joi.string()
  })
})

module.exports = class TagsValidator {
  static getSiteUserMiddleware(req, res, next) {
    middlewareTypeSiteUser(req, res, next)
  }

  static getMiddleware(req, res, next) {
    middlewareType1(req, res, next)
  }
  
  static postMiddleware(req, res, next) {
    middlewareType2(req, res, next)
  }

  static putMiddleware(req, res, next) {
    middlewareType2(req, res, next)
  }

  static deleteEntityTagsMiddleware(req, res, next) {
    middlewareType2(req, res, next)
  }

  static deleteTagsMiddleware(req, res, next) {
    middlewareTags(req, res, next)
  }

  static getEntitiesByTagMiddleware(req, res, next) {
    middlewareGetEntities(req, res, next)
  }

  static getSiteUserByTagMiddleware(req, res, next) {
    middlewareGetSiteUser(req, res, next)
  }
}
