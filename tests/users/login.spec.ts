import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";

describe.skip("POST /auth/login", () => {
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
        it("Should return 201 Status Code", async () => {
            // Arrange
            const userData = {
                email: "johndoe12@gmail.com",
                password: "secret",
            };

            // Act
            const response = await request(app)
                .post("/auth/login")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(201);
        });
    });
});
