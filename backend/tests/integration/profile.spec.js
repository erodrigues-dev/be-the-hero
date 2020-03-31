const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')
const factory = require('../factories')
const truncate = require('../utils/truncate')

describe('Profile', () => {

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

    it('should be able list only incident from ONG', async () => {

        const responseCreateOng1 = await createONG()
        await createIncident(responseCreateOng1.body.id)

        const responseCreateOng2 = await createONG()
        await createIncident(responseCreateOng2.body.id)

        const response = await request(app).get('/profile').set('authorization', responseCreateOng2.body.id)

        expect(response.status).toBe(200)
        expect(response.body.length > 0).toBe(true)
        expect(response.body.every(x=> x.ong_id === responseCreateOng2.body.id)).toBe(true)
    })

    it('should not be able list incident without ong_id authorization', async()=> {
        
        const response = await request(app).get('/profile')

        expect(response.status).toBe(400)
    })
})