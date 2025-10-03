import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_meta_meta_image_idx" ON "site_settings" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_meta_image_id_media_id_fk";
  
  DROP INDEX "site_settings_meta_meta_image_idx";
  ALTER TABLE "site_settings" DROP COLUMN "meta_title";
  ALTER TABLE "site_settings" DROP COLUMN "meta_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "meta_description";`)
}
