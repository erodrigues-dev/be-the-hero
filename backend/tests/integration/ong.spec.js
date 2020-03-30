const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG', () => {

    beforeEach(async()=> {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async ()=>  await connection.destroy())

    it('should be able to create a new ONG', async() => {
        const response = await request(app)
            .post('/ongs')
            .send({
                name: "APAD",
                email: "apad@mail.com",
                whatsapp: "21912341234",
                city: "Rio de Janeiro",
                uf: "RJ"
            })

        expect(response.body).toHaveProperty('id')
        expect(response.body.id).toHaveLength(8)
    })

    it('should be able to list ONGs', async () => {

        const response = await request(app)
            .post('/ongs')
            .send({
                name: "APAD",
                email: "apad@mail.com",
                whatsapp: "21912341234",
                city: "Rio de Janeiro",
                uf: "RJ"
            })

        const {id} = response.body
        
        const responseList = await request(app).get('/ongs')
        const list = responseList.body

        expect(list.length).toBe(1)
        expect(list[0].id).toBe(id)
    })
})