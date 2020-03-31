const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database/connection");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("Session", () => {
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

    it("should be able to create a new Session", async () => {
        const ong = factory.createONG();
        const responseONG = await request(app).post('/ongs').send(ong)
        const response = await request(app).post("/sessions").send(responseONG.body);
        
        expect(response.status).toBe(200)
        expect(response.body.name).toBe(ong.name)
    });

    it("should not be able to create a new Session with invalid ong_id", async () => {
        const response = await request(app).post("/sessions").send({id: '1234' });
        
        expect(response.status).toBe(400)
    });
});
