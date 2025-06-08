"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    create({ firstName, lastName, email, password, role, tenantId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { email: email },
            });
            if (user) {
                const error = (0, http_errors_1.default)(
                    400,
                    "Email is already eixst",
                );
                throw error;
            }
            // Hashed the password
            const saltRounds = 10;
            const hashedPassword = yield bcryptjs_1.default.hash(
                password,
                saltRounds,
            );
            try {
                return yield this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role,
                    tenant: tenantId ? { id: tenantId } : null,
                });
            } catch (err) {
                const error = (0, http_errors_1.default)(
                    500,
                    "Failed to store the data in the database",
                );
                throw error;
            }
        });
    }
    getAll(validatedQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryBuilder = this.userRepository.createQueryBuilder("user");
            if (validatedQuery.q) {
                const searchTerm = `%${validatedQuery.q}%`;
                queryBuilder.where(
                    new typeorm_1.Brackets((qb) => {
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
            const result = yield queryBuilder
                .leftJoinAndSelect("user.tenant", "tenant")
                .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
                .take(validatedQuery.perPage)
                .orderBy("user.id", "DESC")
                .getManyAndCount();
            return result;
        });
    }
    update(userId, { firstName, lastName, email, role, tenantId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.update(userId, {
                    firstName,
                    lastName,
                    email,
                    role,
                    tenant: tenantId ? { id: tenantId } : null,
                });
            } catch (error) {
                const err = (0, http_errors_1.default)(
                    400,
                    "Failed to update user in the database",
                );
                throw err;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
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
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: {
                    id,
                },
                relations: {
                    tenant: true,
                },
            });
        });
    }
}
exports.default = UserService;
