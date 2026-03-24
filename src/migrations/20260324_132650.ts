import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants" ALTER COLUMN "allow_public_read" SET DEFAULT true;
  ALTER TABLE "tenants" ADD COLUMN "has_active_stock" boolean DEFAULT false;
  CREATE INDEX "tenants_has_active_stock_idx" ON "tenants" USING btree ("has_active_stock");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "tenants_has_active_stock_idx";
  ALTER TABLE "tenants" ALTER COLUMN "allow_public_read" SET DEFAULT false;
  ALTER TABLE "tenants" DROP COLUMN "has_active_stock";`)
}
