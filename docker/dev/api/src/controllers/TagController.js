const TagRepository = require('../repositories/TagRepository')

const success = 204 
const successGet = 200
//badRequest já tratado no validação
const badRequest = 400
const notFound = 404

module.exports = class TagController {
  static tagRepository = new TagRepository()

  static async getTagsSiteUser(req, res) {
    const { contestId, entitySite, entityUser } = req.params
    const { tagId, tagName, tagValue } = req.query
    
    try {
      const result = await TagController.tagRepository.getTagsSiteUser(contestId, entitySite, entityUser, tagId, tagName, tagValue)
      return res.status(successGet).json({
        entityTag: [
          {
            entityType: 'site/user',
            entityId: `${entitySite}/${entityUser}`,
            tag: result
          }
        ]
      })
      
    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }

  static async getTagsByEntity(req, res) {
    const { contestId, entityType, entityId } = req.params
    const { tagId, tagName, tagValue } = req.query
    
    try {
      const result = await TagController.tagRepository.getTagsByEntity(contestId, entityType, entityId, tagId, tagName, tagValue)
      return res.status(successGet).json({
        entityTag: [
          {
            entityType: entityType,
            entityId: entityId,
            tag: result
          }
        ]
      })
      
    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }
  
  static async createTags(req, res) {
    const { contestId } = req.params
    const { entityTag } = req.body

    try{
      const result = await TagController.tagRepository.createTags(contestId, entityTag)
      return res.status(success).send()
      
    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }

  static async updateTags(req, res) {
    const { contestId } = req.params
    const { entityTag } = req.body

    try{
      const result = await TagController.tagRepository.updateTags(contestId, entityTag)
      return res.status(success).send()
      
    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }

  static async deleteEntityTags(req, res) {
    const { contestId } = req.params
    const { entityTag } = req.body

    try{
      const result = await TagController.tagRepository.deleteEntityTags(contestId, entityTag)
      return res.status(success).send()
      
    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }

  static async deleteTags(req, res) {
    const { contestId } = req.params
    const { tags } = req.body

    try{
      const result = await TagController.tagRepository.deleteTags(contestId, tags)
      return res.status(success).send()
      
    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }

  static async getEntitiesByTag(req, res) {
    const { contestId, entityType} = req.params
    const { tagName, tagValue  } = req.query

    try{
      const result = await TagController.tagRepository.getEntitiesByTag(contestId, entityType, tagName, tagValue)
      return res.status(successGet).json({
        entityType: entityType,
        tagName: tagName,
        tagValue: tagValue,
        entities: result
      })

    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }

  static async getSiteUserByTag(req, res) {
    const { contestId } = req.params
    const { tagName, tagValue  } = req.query

    try{
      const result = await TagController.tagRepository.getSiteUserByTag(contestId, tagName, tagValue)
      return res.status(successGet).json({
        entityType: 'site/user',
        tagName: tagName,
        tagValue: tagValue,
        entities: result
      })

    } catch(error) {
      return res.status(notFound).json({ error })
    }
  }
}
