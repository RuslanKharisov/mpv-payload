import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_blocks_media_block_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_pages_blocks_media_block_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_tenants_blocks_media_block_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  ALTER TABLE "warehouses" ALTER COLUMN "capacity" SET DEFAULT 10;
  ALTER TABLE "products_blocks_media_block" ADD COLUMN "size" "enum_products_blocks_media_block_size" DEFAULT 'medium' NOT NULL;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "size" "enum_pages_blocks_media_block_size" DEFAULT 'medium';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "size" "enum__pages_v_blocks_media_block_size" DEFAULT 'medium';
  ALTER TABLE "tenants_blocks_media_block" ADD COLUMN "size" "enum_tenants_blocks_media_block_size" DEFAULT 'medium' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "warehouses" ALTER COLUMN "capacity" SET DEFAULT 0;
  ALTER TABLE "products_blocks_media_block" DROP COLUMN "size";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "size";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "size";
  ALTER TABLE "tenants_blocks_media_block" DROP COLUMN "size";
  DROP TYPE "public"."enum_products_blocks_media_block_size";
  DROP TYPE "public"."enum_pages_blocks_media_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_size";
  DROP TYPE "public"."enum_tenants_blocks_media_block_size";`)
}
