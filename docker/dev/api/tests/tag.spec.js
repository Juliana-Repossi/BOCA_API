const request = require('supertest')
const app = require('../src/app')
const pool = require('../src/database/connection')

describe('Testes do CRUD de Tags', () => {
  const success = 204
  const successGet = 200
  const badRequest = 400
  const notFound = 404

  ///////////////////////////////////////// POST /////////////////////////////////////////

  /*
  * Casos comtemplados pelo teste (POST - ACEITO):
  * Fazer um POST em cada entidade
  * Fazer POST em entidades diferentes com tags iguais
  * Fazer POST com tag que já existe com um id diferente
  */
  it('Deve cadastrar uma tag com sucesso', async () => {
    const contestId = 1
    const res = await request(app)
      .post(`/api/contest/${contestId}/tags`)
      .send({
        entityTag: [
          {
            entityType: "language",
            entityId: 31,
            tag: [
              {
                id: 1,
                name: "lang",
                value: "mysql"
              },
              {
                id: 2,
                name: "level",
                value: "easy"
              },
              {
                id: 30,
                name: "lang",
                value: "mongodb"
              }
            ]
          },
          {
            entityType: "site",
            entityId: 1,
            tag: [
              {
                id: 3,
                name: "site1",
                value: "atv1"
              },
              {
                id: 40,
                name: "site15",
                value: "atv15"
              }
            ]
          },
          {
            entityType: "problem",
            entityId: 2004,
            tag: [
              {
                id: 5,
                name: "banking",
                value: "4"
              },
              {
                id: 6,
                name: "lang",
                value: "mysql"
              },
              {
                id: 7,
                name: "working",
                value: "p1"
              }
            ]
          },
          {
            entityType: "site/user",
            entityId: "1/1000",
            tag: [
              {
                id: 8,
                name: "working",
                value: "atividade 01"
              }
            ]
          }
        ]
      })
      console.log(res.body)
      expect(res.statusCode).toBe(success)
  })

  
  /*
  * Casos comtemplados pelo teste (POST - RECUSADO):
  * Fazer um POST de uma relação (tag,id) que já existe
  * Testar rollback : primeiros dados deveriam ser aceitos e o ultimo não
  * porém, devido ao rollback nenhum será cadastrado como deveria
  */
  it('Deve tentar cadastrar uma relação já existente', async () => {
    const contestId = 1
    const res = await request(app)
      .post(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "language",
            "entityId": 21,
            "tag": [
              {
                "id": 1,
                "name": "lang",
                "value": "mysql"
              },
              {
                "id": 2,
                "name": "level",
                "value": "easy"
              }
            ]
          },
          {
            "entityType": "problem",
            "entityId": 2013,
            "tag": [
              {
                "id": 5,
                "name": "banking",
                "value": "4"
              },
              {
                "id": 6,
                "name": "lang",
                "value": "mysql"
              },
              {
                "id": 7,
                "name": "working",
                "value": "p1"
              }
            ]
          },
          {
            "entityType": "site/user",
            "entityId": "1/5021",
            "tag": [
              {
                "id": 8,
                "name": "working",
                "value": "atividade 01"
              }
            ]
          },
          {
            "entityType": "site",
            "entityId": 1,
            "tag": [
              {
                "id": 3,
                "name": "site1",
                "value": "atv1"
              }
            ]
          }
        ]        
      })
      
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toHaveProperty('length')
    expect(res.body.error).toHaveProperty('name')
    expect(res.body.error).toHaveProperty('severity')
    expect(res.body.error).toHaveProperty('code')
    expect(res.body.error).toHaveProperty('detail')
    expect(res.body.error).toHaveProperty('schema')
    expect(res.body.error).toHaveProperty('table')
    expect(res.body.error).toHaveProperty('constraint')
    expect(res.body.error).toHaveProperty('file')
    expect(res.body.error).toHaveProperty('line')
    expect(res.body.error).toHaveProperty('routine')
    expect(res.statusCode).toBe(notFound)
  })


  ///////////////////////////////////////// GET /////////////////////////////////////////
  it('Deve efetuar get de tags na entidade language', async () => {
    const contestId = 1
    const entityType = 'language'
    const entityId = 31 
    const tagId = 1
    const tagName = 'lang'
    const tagValue = 'mysql'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}/${entityId}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags na entidade problem', async () => {
    const contestId = 1
    const entityType = 'problem'
    const entityId = 2004
    const tagId = 5
    const tagName = 'banking'
    const tagValue = '4'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}/${entityId}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags na entidade site', async () => {
    const contestId = 1
    const entityType = 'site'
    const entityId = 1
    const tagId = 3
    const tagName = 'site1'
    const tagValue = 'atv1'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}/${entityId}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags na entidade site/user', async () => {
    const contestId = 1
    const entitySite = 1
    const entityUser = 1000
    const tagId = 8
    const tagName = 'working'
    const tagValue = 'atividade 01'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/site/user/${entitySite}/${entityUser}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags com nome/valor inexistente', async () => {
    const contestId = 1
    const entityType = 'site'
    const entityId = 1
    const tagId = 3
    const tagName = 'site2' // não existe
    const tagValue = 'atv1'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}/${entityId}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.body.entityTag[0].tag.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags com nome/valor inexistente na entidade site/user', async () => {
    const contestId = 1
    const entitySite = 1
    const entityUser = 1000
    const tagId = 8
    const tagName = 'working'
    const tagValue = 'atividade 02' // não existe

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/site/user/${entitySite}/${entityUser}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.body.entityTag[0].tag.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags com nome/valor existente na entidade problem', async () => {
    const contestId = 1
    const entityProblem = 2004
    const tagId = 5
    const tagName = 'banking'
    const tagValue = '4' 

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/problem/${entityProblem}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags com tagId errado', async () => {
    const contestId = 1
    const entityType = 'site'
    const entityId = 1
    const tagId = 4 // errado
    const tagName = 'site1'
    const tagValue = 'atv1'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}/${entityId}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.body.entityTag[0].tag.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get de tags com tagId errado na entidade site/user', async () => {
    const contestId = 1
    const entitySite = 1
    const entityUser = 1000
    const tagId = 9 // errado
    const tagName = 'working'
    const tagValue = 'atividade 01'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/site/user/${entitySite}/${entityUser}`)
      .query({
        tagId: tagId,
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.body.entityTag[0].tag.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar get em uma entidade inexistente', async () => {
    const contestId = 1
    const entityType = 'site'
    const entityId = 10 //errado

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}/${entityId}`)

    expect(res.body).toHaveProperty('entityTag')
    expect(res.body.entityTag[0]).toHaveProperty('entityType')
    expect(res.body.entityTag[0]).toHaveProperty('entityId')
    expect(res.body.entityTag[0]).toHaveProperty('tag')
    expect(res.body.entityTag[0].tag.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  ///////////////////////////////////////// FILTROS /////////////////////////////////////////

  it('Deve efetuar um get das instancias de problems que possuem tags', async () => {
    const contestId = 1
    const entityType = 'problem'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)

    console.log(res.body)
 
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de sites que possuem tags', async () => {
    const contestId = 1
    const entityType = 'site'


    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)

        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de user que possuem tags', async () => {
    const contestId = 1


    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/site/user`)

        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de lang que possuem tags', async () => {
    const contestId = 1
    const entityType = 'language'


    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)

        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de problems que possuem tags com o nome banking', async () => {
    const contestId = 1
    const entityType = 'problem'
    const tagName = 'banking'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
      .query({
        tagName: tagName
    })

        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('tagName')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de sites passando um tagName que não tenha correspondência', async () => {
    const contestId = 1
    const entityType = 'site'
    const tagName = 'banking'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
      .query({
        tagName: tagName
    })

        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('tagName')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de user que possuem tags', async () => {
    const contestId = 1


    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/site/user`)
        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das instancias de lang que possuem tags', async () => {
    const contestId = 1
    const entityType = 'language'


    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })


  it('Deve efetuar um get dos problems que possuem uma dada tag', async () => {
    const contestId = 1
    const entityType = 'problem'
    const tagName = 'banking'
    const tagValue = '4'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
      .query({
        tagName: tagName,
        tagValue: tagValue
      })

        
    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get das languages que possuem uma dada tag', async () => {
    const contestId = 1
    const entityType = 'language'
    const tagName = 'lang'
    const tagValue = 'mysql'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
      .query({
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('tagName')
    expect(res.body).toHaveProperty('tagValue')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get dos sites que possuem uma dada tag não existente', async () => {
    const contestId = 1
    const entityType = 'site'
    const tagName = 'nexiste'
    const tagValue = 'nexiste'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
      .query({
        tagName: tagName,
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('tagName')
    expect(res.body).toHaveProperty('tagValue')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities.length).toBe(0)
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get dos site/users que possuem uma tag com dado valor', async () => {
    const contestId = 1
    const tagValue = 'atividade 01'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/site/user`)
      .query({
        tagValue: tagValue
      })

    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('tagValue')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities).not.toBe([])
    expect(res.statusCode).toBe(successGet)
  })

  it('Deve efetuar um get numa entidade que teria ocorrência duplicada', async () => {
    const contestId = 1
    const entityType = 'problem'
    const tagName = 'lang'

    const res = await request(app)
      .get(`/api/contest/${contestId}/tags/${entityType}`)
      .query({
        tagName: tagName
      })

    expect(res.body).toHaveProperty('entityType')
    expect(res.body).toHaveProperty('tagName')
    expect(res.body).toHaveProperty('entities')
    expect(res.body.entities.length).toBe(1)
    expect(res.statusCode).toBe(successGet)
  })

  ///////////////////////////////////////// UPDATE /////////////////////////////////////////

  /*
  * Casos de teste (UPDATE - RELAÇÃO INEXISTENTE)
  * As relações da language existem e poderiam sofre update, porém a problem 2012 com as tags
  *  passadas não existem, logo o rollback não deve deixar nenhuma acontecer
  */
  it('Deve tentar fazer update em uma relação que não existe', async () => {
    const contestId = 1

    const res = await request(app)
      .put(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "language",
            "entityId": 21,
            "tag": [
              {
                "id": 1,
                "name": "lang1",
                "value": "mysql1"
              }
            ]
          },
        ]
      })
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('detail')
      expect(res.statusCode).toBe(notFound)
  })

  it('Deve fazer update em uma tag que tenha relação com mais de uma entidade', async () => {
    const contestId = 1

    const res = await request(app)
      .put(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "language",
            "entityId": 31,
            "tag": [
              {
                "id": 1,
                "name": "lang1",
                "value": "mysql1"
              }
            ]
          },
        ]
      })
      expect(res.statusCode).toBe(success)
  })

  it('Deve fazer update em uma tag que tenha relação com apenas uma entidade', async () => {
    const contestId = 1

    const res = await request(app)
      .put(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "site",
            "entityId": 1,
            "tag": [
              {
                "id": 3,
                "name": "nova",
                "value": "nova2"
              }
            ]
          },
        ]
      })
      expect(res.statusCode).toBe(success)
  })

  it('Deve fazer update em uma tag que nao existe', async () => {
    const contestId = 1

    const res = await request(app)
      .put(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "site",
            "entityId": 1,
            "tag": [
              {
                "id": 13,
                "name": "nova",
                "value": "nova2"
              }
            ]
          },
        ]
      })
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('detail')
      expect(res.statusCode).toBe(notFound)
  })

  ///////////////////////////////////////// DELETE /////////////////////////////////////////
  it('Deve remover o relacionamento entre uma language e uma dada tag', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "language",
            "entityId": 31,
            "tag": [
              {
                "id": 2,
                "name": "level",
                "value": "easy"
              },
              {
                "id": 3,
                "name": "lang",
                "value": "mongodb"
              }
            ]
          },
        ]
      })

      expect(res.statusCode).toBe(success)
  })

  it('Deve remover o relacionamento entre um site e uma dada tag', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "site",
            "entityId": 1,
            "tag": [
              {
                "id": 40,
                "name": "site15",
                "value": "atv15"
              }
            ]
          },
        ]
      })

      expect(res.statusCode).toBe(success)
  })

  it('Deve remover o relacionamento entre um problem e uma dada tag', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "problem",
            "entityId": 2004,
            "tag": [
              {
                "id": 7,
                "name": "working",
                "value": "p1"
              }
            ]
          },
        ]
      })

      expect(res.statusCode).toBe(success)
  })

  it('Deve remover o relacionamento entre um site/user e uma dada tag', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "site/user",
            "entityId": "1/1000",
            "tag": [
              {
                "id": 8,
                "name": "working",
                "value": "atividade 01"
              }
            ]
          },
        ]
      })

      expect(res.statusCode).toBe(success)
  })

  it('Deve tentar remover o relacionamento entre uma entidade e uma dada tag inexistente', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tags`)
      .send({
        "entityTag": [
          {
            "entityType": "problem",
            "entityId": 2004,
            "tag": [
              {
                "id": 5,
                "name": "banking",
                "value": "4"
              },
              {
                "id": 6,
                "name": "banking500", // não existe
                "value": "4500" // não existe
              }
            ]
          },
        ]
      })

      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('detail')
      expect(res.statusCode).toBe(notFound)
  })

  it('Deve remover uma tag isoladamente e seus relacionamentos em cascata', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tag`)
      .send({
        "tags": [
          {
            "id": 5,
            "name": "banking",
            "value": "4"
          },
          {
            "id": 6,
            "name": "lang",
            "value": "mysql"
          }
        ]
      })

      expect(res.statusCode).toBe(success)
  })

  it('Deve remover uma tag isoladamente que não existe', async () => {
    const contestId = 1

    const res = await request(app)
      .delete(`/api/contest/${contestId}/tag`)
      .send({
        "tags": [
          {
            "id": 1000,
            "name": "banking100",
            "value": "400"
          }
        ]
      })

      expect(res.body).toHaveProperty('error')
      expect(res.statusCode).toBe(notFound)
  })
})
