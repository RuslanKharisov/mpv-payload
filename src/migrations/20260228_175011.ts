import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tenants_status" AS ENUM('ACTIVE', 'LIQUIDATING', 'LIQUIDATED', 'BANKRUPT', 'REORGANIZING');
  ALTER TABLE "warehouses" ALTER COLUMN "capacity" SET DEFAULT 50;
  ALTER TABLE "tenants" ADD COLUMN "inn" varchar;
  ALTER TABLE "tenants" ADD COLUMN "status" "enum_tenants_status";
  CREATE INDEX "tenants_inn_idx" ON "tenants" USING btree ("inn");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "tenants_inn_idx";
  ALTER TABLE "warehouses" ALTER COLUMN "capacity" SET DEFAULT 10;
  ALTER TABLE "tenants" DROP COLUMN "inn";
  ALTER TABLE "tenants" DROP COLUMN "status";
  DROP TYPE "public"."enum_tenants_status";`)
}
