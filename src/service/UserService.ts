import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { User } from "../entity";

class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const error = createHttpError(400, "Email is already eixst");
            throw error;
        }
        // Hashed the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to store the data in the database",
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            select: ["id", "email", "firstName", "lastName", "password"],
        });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
}
export default UserService;
