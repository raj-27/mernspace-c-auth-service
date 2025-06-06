import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";
import { Tenant, User } from "../../src/entity";
import { createTenant } from "../utils";

describe("POST /user", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(async () => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given All Fields", () => {
        it("should persist the user in database", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };
            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
        });
        it("should create a manager user", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };
            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0].role).toBe(Roles.MANAGER);
        });
        it("should return 403 if non admin user tries to create a user", async () => {
            const managerToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });

            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
                tenantId: 1,
            };
            const response = await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${managerToken}`])
                .send(userData);
            expect(response.statusCode).toBe(403);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });
});
