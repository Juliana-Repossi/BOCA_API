const express = require('express')
const router = express.Router()
const TagValidator = require('./validations/TagValidator')
const TagController = require('./controllers/TagController')

/**
 * @swagger
 * definitions:
 *    TagArray:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            example: 1
 *          name:
 *            type: string
 *            example: tagName
 *          value:
 *            type: string
 *            example: tagValue
 * 
 *    getEntityByTagResponse:
 *      type: object
 *      properties:
 *        entityType:
 *          type: string
 *          example: problem|site|language
 *        tagName: 
 *          type: string
 *          example: tagName
 *        tagValue:
 *          type: string
 *          example: tagValue
 *        entities:
 *          type: array
 *          items:
 *            type: object
 * 
 *    getSiteUserByTagResponse:
 *      type: object
 *      properties:
 *        entityType:
 *          type: string
 *          example: site/user
 *        tagName: 
 *          type: string
 *          example: tagName
 *        tagValue:
 *          type: string
 *          example: tagValue
 *        entities:
 *          type: array
 *          items:
 *            type: object
 * 
 *    getTagsResponse:
 *      type: object
 *      properties:
 *        entityTag:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              entityType:
 *                type: string
 *                example: problem|site|language
 *              entityId:
 *                type: number
 *                example: 1
 *              tag:
 *                $ref: '#/definitions/TagArray'
 * 
 *    getTagsSiteUserResponse:
 *      type: object
 *      properties:
 *        entityTag:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              entityType:
 *                type: string
 *                example: site/user
 *              entityId:
 *                type: number
 *                example: 2
 *              tag:
 *                $ref: '#/definitions/TagArray'
 * 
 *    Body:
 *      type: object
 *      properties:
 *        entityTag:     
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              entityType: 
 *                type: string
 *                example: problem
 *              entityId:
 *                type: number
 *                example: 2006
 *              tag:
 *                $ref: '#/definitions/TagArray'   
 *    
 *    requestProcessError:
 *      type: object
 *      properties:
 *        error:
 *          type: object 
 * 
 *    requestFormatError:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: number
 *          example: 400
 *        error:
 *          type: string
 *          example: Bad Request
 *        message:
 *          type: string
 *          example: Validation failed
 *        validation:
 *          type: object
 */

/**
 * @swagger
 * /api/contest/{contestId}/tags/site/user:
 *    get:
 *      summary: Busca dos elementos da entidade site/user em função de uma determinada tag.
 *      description: Rota para consultar entidades pertencentes a site/user que estão relacionados a uma determinada tag.
 *                   A consulta não leva em consideração o tagId, apenas o contestId, name e value.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *      
 *      - in: query
 *        name: tagName
 *        type: string
 *        required: false
 * 
 *      - in: query
 *        name: tagValue
 *        type: string
 *        required: false
 * 
 *      responses:
 *        '200':
 *          description: Consulta efetuada com sucesso.
 *          schema:
 *            $ref: '#/definitions/getSiteUserByTagResponse'
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.get('/api/contest/:contestId/tags/site/user', TagValidator.getSiteUserByTagMiddleware, TagController.getSiteUserByTag)

/**
 * @swagger
 * /api/contest/{contestId}/tags/{entityType}:
 *    get:
 *      summary: Busca dos elementos das entidades problem, language ou site em função de uma determinada tag.
 *      description: Rota para consultar entidades pertencentes a problem, language ou site que estão relacionados a uma determinada tag.
 *                   A consulta não leva em consideração o tagId, apenas o contestId, name e value.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: path
 *        name: entityType
 *        type: string
 *        required: true
 *      
 *      - in: query
 *        name: tagName
 *        type: string
 *        required: false
 * 
 *      - in: query
 *        name: tagValue
 *        type: string
 *        required: false
 * 
 *      responses:
 *        '200':
 *          description: Consulta efetuada com sucesso.
 *          schema:
 *            $ref: '#/definitions/getEntityByTagResponse'
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.get('/api/contest/:contestId/tags/:entityType', TagValidator.getEntitiesByTagMiddleware, TagController.getEntitiesByTag)

/**
 * @swagger
 * /api/contest/{contestId}/tags/site/user/{entitySite}/{entityUser}:
 *    get:
 *      summary: Busca de tags relacionadas a uma instância da entidade site/user.
 *      description: Rota para consultar tags que estão relacionadas a site/user de acordo com suas ids, nomes e/ou valores.
 *                   Estes três parâmetros são opcionais.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: path
 *        name: entitySite
 *        type: number
 *        required: true
 * 
 *      - in: path
 *        name: entityUser
 *        type: number
 *        required: true
 * 
 *      - in: query
 *        name: tagId
 *        type: number
 *        required: false
 *      
 *      - in: query
 *        name: tagName
 *        type: string
 *        required: false
 * 
 *      - in: query
 *        name: tagValue
 *        type: string
 *        required: false
 * 
 *      responses:
 *        '200':
 *          description: Consulta efetuada com sucesso.
 *          schema:
 *            $ref: '#/definitions/getTagsResponse'
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.get('/api/contest/:contestId/tags/site/user/:entitySite/:entityUser', TagValidator.getSiteUserMiddleware, TagController.getTagsSiteUser)

/**
 * @swagger
 * /api/contest/{contestId}/tags/{entityType}/{entityId}:
 *    get:
 *      summary: Busca de tags relacionadas uma instância das entidades problem, site ou language.
 *      description: Rota para consultar tags que estão relacionadas a problem, site ou language de acordo com suas ids, nomes e/ou valores.
 *                   Estes três parâmetros são opcionais.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: path
 *        name: entityType
 *        type: string
 *        required: true
 * 
 *      - in: path
 *        name: entityId
 *        type: number
 *        required: true
 * 
 *      - in: query
 *        name: tagId
 *        type: number
 *        required: false
 *      
 *      - in: query
 *        name: tagName
 *        type: string
 *        required: false
 * 
 *      - in: query
 *        name: tagValue
 *        type: string
 *        required: false
 * 
 *      responses:
 *        '200':
 *          description: Consulta efetuada com sucesso.
 *          schema:
 *            $ref: '#/definitions/getTagsResponse'
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 */
router.get('/api/contest/:contestId/tags/:entityType/:entityId', TagValidator.getMiddleware, TagController.getTagsByEntity)

/**
 * @swagger
 * /api/contest/{contestId}/tags:
 *    post:
 *      summary: Cadastro de tags relacionadas a uma instância das entidades problem, site ou language.
 *      description: Rota para cadastrar tags que serão relacionadas a problem, site ou language.
 *                   Deve se passar a contest, o entityType, a entityId e todas as tags que farão parte deste
 *                   relacionamento. O campo id de uma tag é opcional, enquanto os campos name e value
 *                   são obrigatórios. Caso alguma tag passada já exista, ou a contestId ou entityId sejam inválidas,
 *                   ocorrerá um erro.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: body
 *        name: entityTag
 *        schema:
 *          $ref: '#/definitions/Body'
 * 
 *      responses:
 *        '204':
 *          description: Cadastros efetuados com sucesso.
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.post('/api/contest/:contestId/tags', TagValidator.postMiddleware, TagController.createTags)

/**
 * @swagger
 * /api/contest/{contestId}/tags:
 *    put:
 *      summary: Edição de tags relacionadas as entidades problem, site, language ou site/user.
 *      description: Rota para editar tags que serão a uma instância relacionadas a problem, site, language ou site/user.
 *                   Deve se passar o entityType, a entityId e todas as tags que serão editadas. 
 *                   Se a instância da entidade tiver relação com a tag passada, e id da tag correto,
 *                   a tag relacionada com a entidade é modificada para os valores "name" e "value" passados. 
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: body
 *        name: entityTag
 *        schema:
 *          $ref: '#/definitions/Body'
 * 
 *      responses:
 *        '204':
 *          description: Edições efetuadas com sucesso.
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.put('/api/contest/:contestId/tags', TagValidator.putMiddleware, TagController.updateTags)

/**
 * @swagger
 * /api/contest/{contestId}/tags:
 *    delete:
 *      summary: Remoção de relacionamentos entre as entidades problem, site, language ou site/user e suas tags.
 *      description: Rota para remover relacionamentos entre tags e instâncias de entidades.
 *                   Deve se passar a contest, o entityType, a entityId e todas as tags que serão excluídas. 
 *                   O campo id de uma tag é opcional, enquanto os campos name e value são obrigatórios. 
 *                   Caso alguma tag passada não exista, ocorrerá um erro.
 *                   Se o relacionamento deletado for o único da tag em questão, essa tag é removida junto.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: body
 *        name: entityTag
 *        schema:
 *          $ref: '#/definitions/Body'
 * 
 *      responses:
 *        '204':
 *          description: Remoções efetuadas com sucesso.
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.delete('/api/contest/:contestId/tags', TagValidator.deleteEntityTagsMiddleware, TagController.deleteEntityTags)

/**
 * @swagger
 * /api/contest/{contestId}/tag:
 *    delete:
 *      summary: Remoção de tags.
 *      description: Rota para remover tags. Todos os relacionamentos em que ela está presente são removidos em cascata.
 *                   Deve se passar a contestId, o entityType, a entityId e todas as tags que serão excluídas. 
 *                   O campo id de uma tag é opcional, enquanto os campos name e value são obrigatórios. 
 *                   Caso alguma tag passada não exista, ocorrerá um erro.
 *      tags: [Tag]
 * 
 *      parameters:
 *      - in: path
 *        name: contestId
 *        type: number
 *        required: true
 *     
 *      - in: body
 *        name: tags
 *        schema:
 *          type: object
 *          properties:
 *            tags:
 *              $ref: '#/definitions/TagArray'
 * 
 *      responses:
 *        '204':
 *          description: Remoções efetuadas com sucesso.
 *      
 *        '400':
 *          description: Requisição com parâmetro(s) inválido(s).
 *          schema:
 *            $ref: '#/definitions/requestFormatError'
 * 
 *        '404':
 *          description: Erro ao processar requisição.
 *          schema:
 *            $ref: '#/definitions/requestProcessError'
 */
router.delete('/api/contest/:contestId/tag', TagValidator.deleteTagsMiddleware, TagController.deleteTags)

module.exports = router
