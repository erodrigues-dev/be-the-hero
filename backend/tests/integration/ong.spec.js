const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database/connection");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("ONG", () => {
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

    it("should be able to create a new ONG", async () => {
        const ong = factory.createONG();

        const response = await request(app).post("/ongs").send(ong);

        expect(response.body).toHaveProperty("id");
        expect(response.body.id).toHaveLength(8);
    });

    it("should be able to list ONGs", async () => {
        const ong = factory.createONG()
        const response = await request(app).post("/ongs").send(ong);
        const { id } = response.body;

        const responseList = await request(app).get("/ongs");
        const list = responseList.body;

        expect(list.length).toBe(1);
        expect(list[0].id).toBe(id);
    });
});
