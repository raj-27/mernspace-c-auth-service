import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity";

describe("POST /tenants", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Fields are Given", () => {
        it("should return 201 status code", async () => {
            // Arrange
            const tenantData = {
                name: "John Doe",
                address: "Shivaji Nagar",
            };

            // Act
            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            // Asserts
            expect(response.statusCode).toBe(201);
        });
        it("should create a tenant in database", async () => {
            // Arrange
            const tenantData = {
                name: "John Doe",
                address: "Shivaji Nagar",
            };

            // Act
            await request(app).post("/tenants").send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // Asserts
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
    });
});
