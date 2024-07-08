import { Repository } from "typeorm";
import { Tenant } from "../entity";
import { ITenant } from "../types";

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
    async getAll() {
        return await this.tenantRepository.find();
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
