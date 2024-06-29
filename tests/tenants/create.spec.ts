import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();

        adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
    });

    afterEach(async () => {
        jwks.stop();
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
                .set("Cookie", [`accessToken=${adminToken}`])
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
            await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // Asserts
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });

        it("should return 401 if user is not authenticated", async () => {
            // Arrange
            const tenantData = {
                name: "John Doe",
                address: "Shivaji Nagar",
            };

            // Act
            const response = await request(app)
                .post("/tenants")
                .send(tenantData);
            expect(response.statusCode).toBe(401);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // Asserts
            expect(tenants).toHaveLength(0);
        });
    });
});
