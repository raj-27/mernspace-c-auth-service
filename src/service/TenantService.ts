import { Repository } from "typeorm";
import { Tenant } from "../entity";
import { ITenant, tenantQueryParams } from "../types";

export default class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }
    // Updating tenant by id
    async update(tenantId: number, tenantData: ITenant) {
        return this.tenantRepository.update(tenantId, tenantData);
    }

    // Getting List of Tenant
    async getAll(validatedQuery: tenantQueryParams) {
        const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");
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
    }

    // Getting single tenant by id
    async getOne(tenantId: number) {
        return this.tenantRepository.findOne({
            where: {
                id: tenantId,
            },
        });
    }

    // Delet tenant by id
    async deleteById(tenantId: number) {
        return this.tenantRepository.delete(tenantId);
    }
}
