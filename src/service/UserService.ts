import { Brackets, Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { LimitedUserData, UserData, UserQueryParams } from "../types";
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
                tenant: tenantId ? { id: tenantId } : null,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to store the data in the database",
            );
            throw error;
        }
    }
    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder("user");
        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        // "CONCAT(user.firstName,' ',user.lastName) ILike :q",
                        "user.firstName ILike :q",
                        { q: searchTerm },
                    ).orWhere("user.email ILike :q", { q: searchTerm });
                }),
            );
        }

        if (validatedQuery.role) {
            queryBuilder.andWhere("user.role = :role", {
                role: validatedQuery.role,
            });
        }

        const result = await queryBuilder
            .leftJoinAndSelect("user.tenant", "tenant")
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy("user.id", "DESC")
            .getManyAndCount();
        return result;
    }
    async update(
        userId: number,
        { firstName, lastName, email, role, tenantId }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                email,
                role,
                tenant: tenantId ? { id: tenantId } : null,
            });
        } catch (error) {
            const err = createHttpError(
                400,
                "Failed to update user in the database",
            );
            throw err;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            select: [
                "id",
                "email",
                "firstName",
                "lastName",
                "password",
                "role",
            ],
        });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                tenant: true,
            },
        });
    }
}
export default UserService;
