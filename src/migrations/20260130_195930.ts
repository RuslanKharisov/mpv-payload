import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_categories_or_brands_grid_mode" AS ENUM('manual', 'fromCollection');
  CREATE TYPE "public"."enum_pages_blocks_categories_or_brands_grid_collection" AS ENUM('product-categories', 'brands');
  CREATE TYPE "public"."enum_pages_blocks_categories_or_brands_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_categories_or_brands_grid_mode" AS ENUM('manual', 'fromCollection');
  CREATE TYPE "public"."enum__pages_v_blocks_categories_or_brands_grid_collection" AS ENUM('product-categories', 'brands');
  CREATE TYPE "public"."enum__pages_v_blocks_categories_or_brands_grid_columns" AS ENUM('2', '3', '4');
  CREATE TABLE "pages_blocks_categories_or_brands_grid_manual_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_categories_or_brands_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"mode" "enum_pages_blocks_categories_or_brands_grid_mode" DEFAULT 'manual',
  	"collection" "enum_pages_blocks_categories_or_brands_grid_collection",
  	"limit" numeric DEFAULT 9,
  	"columns" "enum_pages_blocks_categories_or_brands_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_categories_or_brands_grid_manual_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_categories_or_brands_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"mode" "enum__pages_v_blocks_categories_or_brands_grid_mode" DEFAULT 'manual',
  	"collection" "enum__pages_v_blocks_categories_or_brands_grid_collection",
  	"limit" numeric DEFAULT 9,
  	"columns" "enum__pages_v_blocks_categories_or_brands_grid_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "product_categories" ADD COLUMN "is_promoted" boolean DEFAULT false;
  ALTER TABLE "brands" ADD COLUMN "description" varchar;
  ALTER TABLE "brands" ADD COLUMN "is_promoted" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_categories_or_brands_grid_manual_items" ADD CONSTRAINT "pages_blocks_categories_or_brands_grid_manual_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_categories_or_brands_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_categories_or_brands_grid" ADD CONSTRAINT "pages_blocks_categories_or_brands_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_categories_or_brands_grid_manual_items" ADD CONSTRAINT "_pages_v_blocks_categories_or_brands_grid_manual_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_categories_or_brands_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_categories_or_brands_grid" ADD CONSTRAINT "_pages_v_blocks_categories_or_brands_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_categories_or_brands_grid_manual_items_order_idx" ON "pages_blocks_categories_or_brands_grid_manual_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_categories_or_brands_grid_manual_items_parent_id_idx" ON "pages_blocks_categories_or_brands_grid_manual_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_categories_or_brands_grid_order_idx" ON "pages_blocks_categories_or_brands_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_categories_or_brands_grid_parent_id_idx" ON "pages_blocks_categories_or_brands_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_categories_or_brands_grid_path_idx" ON "pages_blocks_categories_or_brands_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_categories_or_brands_grid_manual_items_order_idx" ON "_pages_v_blocks_categories_or_brands_grid_manual_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_categories_or_brands_grid_manual_items_parent_id_idx" ON "_pages_v_blocks_categories_or_brands_grid_manual_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_categories_or_brands_grid_order_idx" ON "_pages_v_blocks_categories_or_brands_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_categories_or_brands_grid_parent_id_idx" ON "_pages_v_blocks_categories_or_brands_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_categories_or_brands_grid_path_idx" ON "_pages_v_blocks_categories_or_brands_grid" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_categories_or_brands_grid_manual_items" CASCADE;
  DROP TABLE "pages_blocks_categories_or_brands_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_categories_or_brands_grid_manual_items" CASCADE;
  DROP TABLE "_pages_v_blocks_categories_or_brands_grid" CASCADE;
  ALTER TABLE "product_categories" DROP COLUMN "is_promoted";
  ALTER TABLE "brands" DROP COLUMN "description";
  ALTER TABLE "brands" DROP COLUMN "is_promoted";
  DROP TYPE "public"."enum_pages_blocks_categories_or_brands_grid_mode";
  DROP TYPE "public"."enum_pages_blocks_categories_or_brands_grid_collection";
  DROP TYPE "public"."enum_pages_blocks_categories_or_brands_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_categories_or_brands_grid_mode";
  DROP TYPE "public"."enum__pages_v_blocks_categories_or_brands_grid_collection";
  DROP TYPE "public"."enum__pages_v_blocks_categories_or_brands_grid_columns";`)
}
