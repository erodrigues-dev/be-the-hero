const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')
const factory = require('../factories')
const truncate = require('../utils/truncate')

describe('Incident', () => {

    function createONG() {
        return request(app)
            .post('/ongs')
            .send(factory.createONG())
    }

    function createIncident(ongId) {
        return request(app)
            .post('/incidents')
            .set('authorization', ongId)
            .send(factory.createIncident())
    }

    beforeEach(async () => {
        await truncate()
    })
    
    beforeAll(async()=> {
        await connection.migrate.latest()
    })
    
    afterAll(async () => {
        await connection.migrate.rollback()
        await connection.destroy()
    })

    it('should be able create incident', async () => {

        const responseCreateOng = await createONG()
        const response = await createIncident(responseCreateOng.body.id)

        expect(response.body).toHaveProperty('id')
        expect(response.body.id).not.toBeNaN()
    })

    it('should not be able create incident without ong_id', async () => {

        const incident = factory.createIncident()
        const response = await request(app).post('/incidents').send(incident)

        expect(response.status).toBe(400)
    })

    it('should be able list incidents', async () => {
        const { id: ongId } = (await createONG()).body
        const { id: incidentId } = (await createIncident(ongId)).body

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
        const { id: ongId } = (await createONG()).body

        for (let i = 0; i < 6; i++)
            await createIncident(ongId)

        const page1 = await request(app).get('/incidents')
        const page2 = await request(app).get('/incidents').query({ page: 2 })

        expect(page1.body).toHaveLength(5)
        expect(page2.body).toHaveLength(1)
    })

    it('should be able delete incident', async () => {
        const responseONG = await createONG()
        const responseIncident = await createIncident(responseONG.body.id)

        const response = await request(app)
            .delete(`/incidents/${responseIncident.body.id}`)
            .set('authorization', responseONG.body.id)

        expect(response.status).toBe(204)
    })

    it('should not be able delete incident from another ONG', async()=>{
        const responseONG = await createONG()
        const responseONG2 = await createONG()
        const responseIncident = await createIncident(responseONG.body.id)

        const response = await request(app)
            .delete(`/incidents/${responseIncident.body.id}`)
            .set('authorization', responseONG2.body.id)

        expect(response.status).toBe(401)
    })
})