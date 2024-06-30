import { DataSource, Repository } from "typeorm";
import { Tenant } from "../../src/entity";

export const truncateTable = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};

export const isJWT = (token: string | null): boolean => {
    if (!token) {
        return false;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        return true;
    } catch (error) {
        return false;
    }
};

export const createTenant = async (respository: Repository<Tenant>) => {
    const tenant = await respository.save({
        name: "Test tenant",
        address: "Test Address",
    });
    return tenant;
};
