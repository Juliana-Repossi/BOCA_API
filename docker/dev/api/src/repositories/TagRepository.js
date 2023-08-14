const pool = require('../database/connection')

module.exports = class TagRepository {
  #client
  
  constructor() {
    this.#client = null
  }
  
  ///////////////////////////////////// GETS /////////////////////////////////////
  
  async #getIdsEntityByTagId(contestId,tagid){
    const result = await this.#client.query(`
      SELECT id 
      FROM entitytagtable 
      WHERE contestnumber = ${contestId} and tagid = ${tagid}
    `)
    return result.rows
  }

  async #getTagNameValue(name,value, contestId){
    const result = await this.#client.query(`
      SELECT id 
      FROM tagtable 
      WHERE name = '${name}' and value = '${value}' and contestnumber = ${contestId}
    `)
    return result.rows
  }

  async #getMaxIdTagTable(){
    const result = await this.#client.query(`
      SELECT MAX(id)
      FROM tagtable 
    `)
    return result.rows
  }

  async #getTagsSite(contestId, entityId, tagId, tagName, tagValue){
    tagId = (tagId === undefined) ? 'null' : `'${tagId}'` 
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
    SELECT tagtable.id, name, value
    FROM tagtable INNER JOIN   
    (
      SELECT tagid 
      FROM entitytagtable 
      WHERE 
        contestnumber = ${contestId} and 
        entityidsite = ${entityId} and
        (${tagId} is null or tagid = ${tagId}) 
    ) AS tmp ON tagtable.id = tmp.tagid    
    WHERE (${tagName} is null or name = ${tagName}) and (${tagValue} is null or value = ${tagValue})`)
    return result.rows
  }

  async #getTagsLang(contestId, entityId, tagId, tagName, tagValue){
    tagId = (tagId === undefined) ? 'null' : `'${tagId}'` 
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 

    const result = await pool.query(`
    SELECT tagtable.id, name, value
    FROM tagtable INNER JOIN  
    (
      SELECT tagid 
      FROM entitytagtable 
      WHERE 
        contestnumber = ${contestId} and 
        entityidlanguage = ${entityId} and
        (${tagId} is null or tagid = ${tagId}) 
    ) AS tmp ON tagtable.id = tmp.tagid    
    WHERE (${tagName} is null or name = ${tagName}) and (${tagValue} is null or value = ${tagValue})`)
    

    return result.rows
  }
  
  async #getTagsSiteUser(contestId, entitySite, entityUser, tagId, tagName, tagValue){
    tagId = (tagId === undefined) ? 'null' : `'${tagId}'` 
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
      SELECT tagtable.id, name, value
      FROM tagtable INNER JOIN   
      (
        SELECT tagid 
        FROM entitytagtable 
        WHERE 
          contestnumber = ${contestId} and 
          entityidusersite = ${entitySite} and
          entityiduser = ${entityUser} and
          (${tagId} is null or tagid = ${tagId}) 
      ) AS tmp ON tagtable.id = tmp.tagid   
      WHERE (${tagName} is null or name = ${tagName}) and (${tagValue} is null or value = ${tagValue})
    `)
    return result.rows 
  }

  async #getTagsProblem(contestId, entityId, tagId, tagName, tagValue){
    tagId = (tagId === undefined) ? 'null' : `'${tagId}'` 
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
      SELECT tagtable.id, name, value
      FROM tagtable INNER JOIN   
      (
        SELECT tagid 
        FROM entitytagtable 
        WHERE 
          contestnumber = ${contestId} and 
          entityidproblem = ${entityId} and
          (${tagId} is null or tagid = ${tagId}) 
      ) AS tmp ON tagtable.id = tmp.tagid    
      WHERE (${tagName} is null or name = ${tagName}) and (${tagValue} is null or value = ${tagValue})
    `)
    return result.rows
  }

  async getTagsByEntity(contestId, entityType, entityId, tagId, tagName, tagValue) {
    if(entityType === 'problem'){
      return await this.#getTagsProblem(contestId, entityId,tagId, tagName, tagValue);

    }else if (entityType === 'language'){
      return await this.#getTagsLang(contestId, entityId,tagId, tagName, tagValue);

    }else if (entityType === 'site'){
      return await this.#getTagsSite(contestId, entityId,tagId, tagName, tagValue);
    }
  }

  async getTagsSiteUser(contestId, entitySite, entityUser, tagId, tagName, tagValue) {
    return await this.#getTagsSiteUser(contestId, entitySite, entityUser,tagId, tagName, tagValue);
  }

  ///////////////////////////////////// POSTS /////////////////////////////////////
  
  async #createTag(tagId, name, value, contestId){
    const result = await this.#client.query(`
      INSERT INTO tagtable (id,name,value,contestnumber)
      VALUES (${tagId},'${name}','${value}',${contestId})
      RETURNING id;
    `)
    return result.rows 
  }

  async #createTagIdDefault(name, value, contestId){

    //verificar se valor já existe em outra tag
    const [tag] = await this.#getTagNameValue(name,value, contestId);

    if(tag === undefined){

      //cria uma tag com os dados passados
      //gambiarra para obter valor unico para id - já que o generate não é funcional
      const [id] = await this.#getMaxIdTagTable();

      const result = await this.#createTag(id.max+1, name, value, contestId)

      return result
    }
    else{
      //pega o id da que ja existe
      return tag
    }
  }

  async #createEntityTagProblem(contestId, entityIdProblem, tagId) {
    const result = await this.#client.query(`
      INSERT INTO entitytagtable (contestnumber, entityidproblem, tagid)
      VALUES (${contestId},${entityIdProblem},${tagId})
      RETURNING id;
    `) 
    return result.rows
  }

  async #createEntityTagLanguage(contestId, entityIdLanguage, tagId) {
    const result = await this.#client.query(`
      INSERT INTO entitytagtable ( contestnumber, entityidlanguage, tagid)
      VALUES ( ${contestId}, ${entityIdLanguage}, ${tagId})
      RETURNING id;
    `) 
    return result.rows
  }
  
  async #createEntityTagSite(contestId, entityIdSite, tagId) {
    const result = await this.#client.query(`
      INSERT INTO entitytagtable (contestnumber,entityidsite,tagid)
      VALUES ( ${contestId}, ${entityIdSite}, ${tagId})
      RETURNING id;
    `) 
    return result.rows    
  }

  async #createEntityTagSiteUser(contestId, entityIdSiteUser, entityIdUser, tagId) {
    const result = await this.#client.query(`
      INSERT INTO entitytagtable (contestnumber,entityiduser,entityidusersite,tagid)
      VALUES (${contestId}, ${entityIdUser}, ${entityIdSiteUser}, ${tagId})
      RETURNING id;
    `) 
    return result.rows
  }

  async createTags(contestId, entityTag){
    try {
      this.#client = await pool.connect()
      await this.#client.query('BEGIN')
    
      for (let entity of entityTag) {
        for(let tag of entity.tag){
          let result
          let tagId
          // verificar se a tag existe mesmo que com um id diferente
          const [resul_tag_id] = await this.#getTagNameValue(tag.name, tag.value, contestId);
          //tag não existe no banco ainda, criar
          if (resul_tag_id === undefined) {
            const [newId] = await this.#createTag(tag.id, tag.name, tag.value, contestId);
            tagId = newId.id
          
          } else {
            tagId = resul_tag_id.id
          }

          // inserindo o relacionamento entidade e tag
          if(entity.entityType === 'problem'){
            result = await this.#createEntityTagProblem(contestId, entity.entityId, tagId);

          }else if (entity.entityType === 'language'){
            result = await this.#createEntityTagLanguage(contestId, entity.entityId, tagId)          
      
          }else if (entity.entityType === 'site'){
            result = await this.#createEntityTagSite(contestId, entity.entityId, tagId)

          }else if (entity.entityType === 'site/user'){
            const [entitySiteUser, entityUser] = entity.entityId.split('/', 2);
            result = await this.#createEntityTagSiteUser(contestId, entitySiteUser, entityUser, tagId)
          }
        }
      }
      await this.#client.query('COMMIT')
    
    } catch(error) {
      await this.#client.query('ROLLBACK')
      throw error

    } finally {
      this.#client.release()
      this.#client = null
    }
  }

  ///////////////////////////////////// UPDATES /////////////////////////////////////

  async #updateTag(id, name, value, contestId){
    const result = await this.#client.query(`
      UPDATE tagtable 
      SET  name = '${name}', value = '${value}'
      WHERE contestnumber = ${contestId} and id = ${id}
    `) 
  }

  async #updateEntityTagProblem(contestId, entityId, tagId, newtagId){
    const result = await this.#client.query(`
      UPDATE entitytagtable 
      SET  tagid = ${newtagId}
      WHERE contestnumber = ${contestId} and entityidproblem = ${entityId} and tagid = ${tagId}
    `)
  }

  async #updateEntityTagLanguage(contestId, entityId,  tagId, newtagId){
    const result = await this.#client.query(`
      UPDATE entitytagtable 
      SET  tagid = ${newtagId}
      WHERE contestnumber = ${contestId} and entityidlanguage = ${entityId} and tagid = ${tagId}
    `)
  }

  async #updateEntityTagSite(contestId, entityId, tagId, newtagId){
    const result = await this.#client.query(`
      UPDATE entitytagtable 
      SET  tagid = ${newtagId}
      WHERE contestnumber = ${contestId} and entityidsite = ${entityId} and tagid = ${tagId}
    `)
  }

  async #updateEntityTagSiteUser(contestId, entitySiteUser, entityUser, tagId, newtagId){
    const result = await this.#client.query(`
      UPDATE entitytagtable 
      SET  tagid = ${newtagId}
      WHERE contestnumber = ${contestId} and entityidusersite = ${entitySiteUser} 
                          and entityiduser = ${entityUser} and tagid = ${tagId}
    `)
  }

  async updateTags(contestId, entityTag) {
    try {
      this.#client = await pool.connect()
      await this.#client.query('BEGIN')
      
      for (let entity of entityTag) {
        for(let tag of entity.tag){

          let relationship

          //verificar se a entity tem relação com a tag
          if(entity.entityType === 'problem'){
            [relationship] = await this.#getTagsProblem(contestId, entity.entityId, tag.id, undefined, undefined);
      
          }else if (entity.entityType === 'language'){
            [relationship] = await this.#getTagsLang(contestId, entity.entityId, tag.id, undefined, undefined);
      
          }else if (entity.entityType === 'site'){
            [relationship] = await this.#getTagsSite(contestId, entity.entityId,tag.id, undefined, undefined);
          
          }else if (entity.entityType === 'site/user'){
            [relationship] = await this.#getTagsSiteUser(contestId, entity.entityId,tag.id, undefined, undefined);
          }

          if(relationship === undefined)
          {
            throw { detail: `Relationship in between ${entity.entityType}(${entity.entityId}) and (id)=(${tag.id}) doesn't exist.` }
          }

          //verifica se a tag passada esta relacionada a mais de uma entidade
          const qtdRel = await this.#getIdsEntityByTagId(contestId, tag.id)

          if(qtdRel.length > 1){
            // cria uma nova tag com as mesmas caracteristicas
            const [id] = await this.#createTagIdDefault(tag.name, tag.value, contestId)

            // muda a relação com a tag antiga para a tag nova
            // editando o relacionamento entidade e tag
            if(entity.entityType === 'problem'){
              await this.#updateEntityTagProblem(contestId, entity.entityId, tag.id, id.id)
    
            }else if (entity.entityType === 'language'){
              await this.#updateEntityTagLanguage(contestId, entity.entityId, tag.id, id.id)          
        
            }else if (entity.entityType === 'site'){
              await this.#updateEntityTagSite(contestId, entity.entityId, tag.id, id.id)
    
            }else if (entity.entityType === 'site/user'){
              const [entitySiteUser, entityUser] = entity.entityId.split('/', 2);
              await this.#updateEntityTagSiteUser(contestId, entitySiteUser, entityUser, tag.id, id.id)
            } 
          }
          else if(qtdRel.length === 1) {
            // a tag a ser modificada só tem relação com a relação passada
            // atualiza valor da tag
            await this.#updateTag(tag.id, tag.name, tag.value, contestId)    
          
          } else {
            //nunca entra - só por segurança
            throw { detail: `Key (id)=(${tag.id}) doesn't exist.` }
          }
        }
      }
      await this.#client.query('COMMIT')

    } catch(error) {
      await this.#client.query('ROLLBACK')
      throw error

    } finally {
      this.#client.release()
      this.#client = null
    }
  }

  ///////////////////////////////////// DELETES /////////////////////////////////////
  
  async #deleteTag(id, contestId){
    const result = await this.#client.query(`
      DELETE 
      FROM tagtable 
      WHERE id = ${id} and contestnumber = ${contestId}
    `) 
  }

  async #deleteEntityTagProblem(contestId, entityId, tagId){
    const result = await this.#client.query(`
      DELETE
      FROM entitytagtable 
      WHERE contestnumber = ${contestId} and entityidproblem = ${entityId} and tagid = ${tagId}
    `) 
  }

  async #deleteEntityTagLanguage(contestId, entityId, tagId){
    const result = await this.#client.query(`
      DELETE
      FROM entitytagtable 
      WHERE contestnumber = ${contestId} and entityidlanguage = ${entityId} and tagid = ${tagId}
    `) 
  }

  async #deleteEntityTagSite(contestId, entityId, tagId){
    const result = await this.#client.query(`
      DELETE
      FROM entitytagtable 
      WHERE contestnumber = ${contestId} and entityidsite = ${entityId} and tagid = ${tagId}
    `) 
  }

  async #deleteEntityTagSiteUser(contestId, entitySiteUser, entityUser, tagId){
    const result = await this.#client.query(`
      DELETE
      FROM entitytagtable 
      WHERE contestnumber = ${contestId} and entityiduser = ${entityUser} and entityidusersite = ${entitySiteUser} and tagid = ${tagId}
    `)
  }

  async deleteEntityTags(contestId, entityTag) {
    try {
      this.#client = await pool.connect()
      await this.#client.query('BEGIN')
      
      for (let entity of entityTag) {
        for(let tag of entity.tag){
          const [realTag] = await this.#getTagNameValue(tag.name, tag.value, contestId)

          if(realTag === undefined) {
            throw { detail: `Pair (name, value)=(${tag.name}, ${tag.value}) doesn't exist.` }
          }

          const qtdRel = await this.#getIdsEntityByTagId(contestId, realTag.id)
          
          if(qtdRel.length === 1){ // é a única relação que essa tag possui, deletar relação e tag
            await this.#deleteTag(realTag.id, contestId)
            
          } else { // caso geral, deletar apenas o relacionamento
            if(entity.entityType === 'problem'){
              await this.#deleteEntityTagProblem(contestId, entity.entityId, realTag.id)
    
            }else if (entity.entityType === 'language'){
              await this.#deleteEntityTagLanguage(contestId, entity.entityId, realTag.id)          
        
            }else if (entity.entityType === 'site'){
              await this.#deleteEntityTagSite(contestId, entity.entityId, realTag.id)
    
            }else if (entity.entityType === 'site/user'){
              const [entitySiteUser, entityUser] = entity.entityId.split('/', 2);
              await this.#deleteEntityTagSiteUser(contestId, entitySiteUser, entityUser, realTag.id)
            }
          }
        }
      }
      await this.#client.query('COMMIT')

    } catch(error) {
      await this.#client.query('ROLLBACK')
      throw error

    } finally {
      this.#client.release()
      this.#client = null
    }
  }

  async deleteTags(contestId, tags){
    try {
      this.#client = await pool.connect()
      await this.#client.query('BEGIN')
      
      for(let tag of tags){
        const [realTag] = await this.#getTagNameValue(tag.name, tag.value, contestId)

        if(realTag === undefined) {
          throw { detail: `Pair (name, value)=(${tag.name}, ${tag.value}) doesn't exist.` }
        }

        await this.#deleteTag(realTag.id, contestId)
      }
      await this.#client.query('COMMIT')
    
    } catch(error) {
      await this.#client.query('ROLLBACK')
      throw error
    
    } finally {
      this.#client.release()
      this.#client = null
    }
  }

  /////////////////////////////////////FILTRO////////////////////////////////////////////////////

  async #getEntitiesByTagSite(contestId, tagName, tagValue){
     
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
      SELECT *
      FROM sitetable INNER JOIN
      (
        SELECT DISTINCT entitytagtable.entityidsite, entitytagtable.contestnumber
        FROM entitytagtable INNER JOIN   
        (
          SELECT id 
          FROM tagtable 
          WHERE 
            contestnumber = ${contestId} and 
            (${tagName} is null or name = ${tagName}) and
            (${tagValue} is null or value = ${tagValue}) 
        ) AS tmptagid ON entitytagtable.tagid = tmptagid.id    
      ) AS tmpidsite ON tmpidsite.entityidsite = sitetable.sitenumber and 
                        tmpidsite.contestnumber = sitetable.contestnumber
    `)
    return result.rows
  }

  async #getEntitiesByTagLang(contestId, tagName, tagValue){
     
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
      SELECT *
      FROM langtable INNER JOIN
      (
        SELECT DISTINCT entitytagtable.entityidlanguage, entitytagtable.contestnumber
        FROM entitytagtable INNER JOIN   
        (
          SELECT id 
          FROM tagtable 
          WHERE 
            contestnumber = ${contestId} and 
            (${tagName} is null or name = ${tagName}) and
            (${tagValue} is null or value = ${tagValue}) 
        ) AS tmptagid ON entitytagtable.tagid = tmptagid.id    
      ) AS tmpidlang ON tmpidlang.entityidlanguage = langtable.langnumber and 
                        tmpidlang.contestnumber = langtable.contestnumber
    `)
    return result.rows
  }
  
  async #getEntitiesByTagProblem(contestId, tagName, tagValue){
     
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
      SELECT *
      FROM problemtable INNER JOIN
      (
        SELECT DISTINCT entitytagtable.entityidproblem, entitytagtable.contestnumber
        FROM entitytagtable INNER JOIN   
        (
          SELECT id 
          FROM tagtable 
          WHERE 
            contestnumber = ${contestId} and 
            (${tagName} is null or name = ${tagName}) and
            (${tagValue} is null or value = ${tagValue}) 
        ) AS tmptagid ON entitytagtable.tagid = tmptagid.id    
      ) AS tmpidproblem ON tmpidproblem.entityidproblem = problemtable.problemnumber and 
                              tmpidproblem.contestnumber = problemtable.contestnumber
    `)
    return result.rows
  }

  async getEntitiesByTag(contestId, entityType, tagName, tagValue){

    if(entityType === 'problem'){
      return await this.#getEntitiesByTagProblem(contestId, tagName, tagValue);

    }else if (entityType === 'language'){
      return await this.#getEntitiesByTagLang(contestId, tagName, tagValue);

    }else if (entityType === 'site'){
      return await this.#getEntitiesByTagSite(contestId, tagName, tagValue);
    }
  }

  async getSiteUserByTag(contestId, tagName, tagValue){
     
    tagName = (tagName === undefined) ? 'null' : `'${tagName}'` 
    tagValue = (tagValue === undefined) ? 'null' : `'${tagValue}'` 
    
    const result = await pool.query(`
      SELECT *
      FROM usertable INNER JOIN
      (
        SELECT DISTINCT entitytagtable.entityidusersite, entitytagtable.entityiduser, entitytagtable.contestnumber
        FROM entitytagtable INNER JOIN   
        (
          SELECT id 
          FROM tagtable 
          WHERE 
            contestnumber = ${contestId} and 
            (${tagName} is null or name = ${tagName}) and
            (${tagValue} is null or value = ${tagValue}) 
        ) AS tmptagid ON entitytagtable.tagid = tmptagid.id    
      ) AS tmpidsiteuser ON tmpidsiteuser.entityidusersite = usertable.usersitenumber and 
                            tmpidsiteuser.entityiduser = usertable.usernumber and 
                            tmpidsiteuser.contestnumber = usertable.contestnumber

    `)
    return result.rows
  }
}
