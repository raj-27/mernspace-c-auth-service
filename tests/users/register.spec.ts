import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { truncateTable } from "../utils";

describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await truncateTable(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all field", () => {
        it("Should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firstName: "Raj",
                lastName: "Yadav",
                email: "demo123@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it("It should return valid json", async () => {
            // Arrange
            const userData = {
                firstName: "Raj",
                lastName: "Yadav",
                email: "demo123@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist the user in the database", async () => {
            // Arrange
            const userData = {
                firstName: "Raj",
                lastName: "Yadav",
                email: "demo123@gmail.com",
                password: "secret",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });
    });
    describe("Fields are missing", () => {});
});
