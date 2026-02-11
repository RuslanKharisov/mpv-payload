import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stocks" ADD COLUMN "_city" varchar;
  ALTER TABLE "stocks" ADD COLUMN "_region" varchar;
  CREATE INDEX "stocks__city_idx" ON "stocks" USING btree ("_city");
  CREATE INDEX "stocks__region_idx" ON "stocks" USING btree ("_region");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "stocks__city_idx";
  DROP INDEX "stocks__region_idx";
  ALTER TABLE "stocks" DROP COLUMN "_city";
  ALTER TABLE "stocks" DROP COLUMN "_region";`)
}
