import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1719641620323 implements MigrationInterface {
    name = "RenameTables1719641620323";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("user", "users");
        await queryRunner.renameTable("refreshToken", "refreshTokens");

        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
        );
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "refreshTokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
