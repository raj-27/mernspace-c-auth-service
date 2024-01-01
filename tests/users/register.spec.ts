import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
    describe("Given all field", () => {
        it("Should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firstname: "Raj",
                lastName: "Yadav",
                email: "raj819314@gmail.com",
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
                firstname: "Raj",
                lastName: "Yadav",
                email: "raj819314@gmail.com",
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

        // it("should persist the user in the database", async () => {
        //     // Arrange
        //     const userData = {
        //         firstname: "Raj",
        //         lastName: "Yadav",
        //         email: "raj819314@gmail.com",
        //         password: "secret",
        //     };
        //     // Act
        //     const response = await request(app)
        //         .post("/auth/register")
        //         .send(userData);
        //     // Assert
        // });
    });
    describe("Fields are missing", () => {});
});
