import { Repository } from "typeorm";
import { Tenant } from "../entity";
import { ITenant } from "../types";

export default class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }
}
