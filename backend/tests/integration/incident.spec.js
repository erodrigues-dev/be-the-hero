const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('Incident', () => {

    function createONG() {
        return request(app)
            .post('/ongs')
            .send({
                name: "APAD-10",
                email: "apad@mail.com",
                whatsapp: "21912341234",
                city: "Rio de Janeiro",
                uf: "RJ"
            })
    }

    function createIncident(ongId){
        return request(app)
            .post('/incidents')
            .set('authorization', ongId)
            .send({
                "title": "titulo do caso",
                "description": "Detalhes do caso",
                "value": 200
        })
    }

    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => await connection.destroy())

    it('should be able create incident', async () => {
        const {id:ongId} = (await createONG()).body
        const response = await createIncident(ongId)

        expect(response.body).toHaveProperty('id')
        expect(response.body.id).not.toBeNaN()
    })

    it('shold be able list incidents', async () => {
        const {id:ongId} = (await createONG()).body
        const {id:incidentId} = (await createIncident(ongId)).body

        const response = await request(app).get('/incidents')

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('title')
        expect(response.body[0]).toHaveProperty('description')
        expect(response.body[0]).toHaveProperty('value')
        expect(response.body[0]).toHaveProperty('ong_id')
        expect(response.body[0]).toHaveProperty('name')
        expect(response.body[0]).toHaveProperty('email')
        expect(response.body[0]).toHaveProperty('whatsapp')
        expect(response.body[0]).toHaveProperty('city')
        expect(response.body[0]).toHaveProperty('uf')

        expect(response.body[0].ong_id).toBe(ongId)
        expect(response.body[0].id).toBe(incidentId)
    })

    it('should be able paginate incidents', async () => {
        const {id:ongId} = (await createONG()).body

        for(let i = 0; i < 6; i++)
            await createIncident(ongId)

        const page1 = await request(app).get('/incidents')
        const page2 = await request(app).get('/incidents').query({ page: 2 })

        expect(page1.body).toHaveLength(5)
        expect(page2.body).toHaveLength(1)
    })
})