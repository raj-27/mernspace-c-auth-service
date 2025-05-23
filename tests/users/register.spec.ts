import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { RefreshToken, User } from "../../src/entity";

describe("POST /auth/register", () => {
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

    describe("Given all field", () => {
        it("Should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
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
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
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
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
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

        it("should assign a customer role", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRespository = connection.getRepository(User);
            const users = await userRespository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it("It should store hashed password in the database", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRespository = connection.getRepository(User);
            const users = await userRespository.find({ select: ["password"] });
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
        });

        it("should return 400 status code if email is already exits", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
            };

            const userRespository = connection.getRepository(User);
            await userRespository.save({ ...userData, role: Roles.CUSTOMER });

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const users = await userRespository.find();
            // Assert
            expect(response.statusCode).toBe(400);
            expect(users.length).toBe(1);
        });

        // it.skip("should return the access token and refresh token inside the cookies ", async () => {
        //     // Arrange
        //     const userData = {
        //         firstName: "John",
        //         lastName: "Doe",
        //         email: "johndoe12@gmail.com",
        //         password: "secret",
        //     };

        //     // Act
        //     const response = await request(app)
        //         .post("/auth/register")
        //         .send(userData);

        //     // Assert
        //     interface Headers {
        //         ["set-cookie"]: string[];
        //     }
        //     let accessToken = null;
        //     let refreshToken = null;

        //     const cookies = (response.headers as Headers)["set-cookie"] || [];
        //     cookies.forEach((cookie: any) => {
        //         if (cookie.startsWith("accessToken=")) {
        //             accessToken = cookie.split(":")[0].split("=")[1];
        //         }
        //         if (cookie.startsWith("refreshToken=")) {
        //             refreshToken = cookie.split(":")[0].split("=")[1];
        //         }
        //     });
        //     expect(accessToken).not.toBeNull();
        //     expect(refreshToken).not.toBeNull();

        //     expect(isJWT(accessToken)).toBeTruthy();
        //     expect(isJWT(refreshToken)).toBeTruthy();
        // });

        it("should store refresh token in the database", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe12@gmail.com",
                password: "secret",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepo.find();
            expect(refreshToken).toHaveLength(1);

            // const token = await refreshTokenRepo
            //     .createQueryBuilder("refreshToken")
            //     .where("refreshToken.userId= :userId", {
            //         userId: (response.body as Record<string, string>).id,
            //     })
            //     .getMany();
            // expect(token).toHaveLength(1);
        });
    });
    describe("Fields are missing", () => {
        it("should return 404 status code if email field is missing", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "secret",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRespository = connection.getRepository(User);
            const users = await userRespository.find();
            expect(users).toHaveLength(0);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim email field", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: " johndoe12@gmail.com ",
                password: "secret",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe("johndoe12@gmail.com");
        });
    });
});
