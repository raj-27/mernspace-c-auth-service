import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "tenants" })
export default class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;
}
