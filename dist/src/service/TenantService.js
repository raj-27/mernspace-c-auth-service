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
Object.defineProperty(exports, "__esModule", { value: true });
class TenantService {
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    create(tenantData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tenantRepository.save(tenantData);
        });
    }
    // Updating tenant by id
    update(tenantId, tenantData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tenantRepository.update(tenantId, tenantData);
        });
    }
    // Getting List of Tenant
    getAll(validatedQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryBuilder =
                this.tenantRepository.createQueryBuilder("tenant");
            if (validatedQuery.q) {
                const searchTerm = `%${validatedQuery.q}%`;
                queryBuilder
                    .where("tenant.name ILike :q", { q: searchTerm })
                    .orWhere("tenant.address ILike :q", { q: searchTerm });
            }
            const result = queryBuilder
                .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
                .take(validatedQuery.perPage)
                .orderBy("tenant.id", "DESC")
                .getManyAndCount();
            return result;
        });
    }
    // Getting single tenant by id
    getOne(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tenantRepository.findOne({
                where: {
                    id: tenantId,
                },
            });
        });
    }
    // Delet tenant by id
    deleteById(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tenantRepository.delete(tenantId);
        });
    }
}
exports.default = TenantService;
