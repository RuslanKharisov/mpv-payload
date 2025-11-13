import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_features_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "icons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "icons_id" integer;
  ALTER TABLE "pages_blocks_features_block_items" ADD CONSTRAINT "pages_blocks_features_block_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_block_items" ADD CONSTRAINT "pages_blocks_features_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_block" ADD CONSTRAINT "pages_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_block_items" ADD CONSTRAINT "_pages_v_blocks_features_block_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_block_items" ADD CONSTRAINT "_pages_v_blocks_features_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_block" ADD CONSTRAINT "_pages_v_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_features_block_items_order_idx" ON "pages_blocks_features_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_block_items_parent_id_idx" ON "pages_blocks_features_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_block_items_icon_idx" ON "pages_blocks_features_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_features_block_order_idx" ON "pages_blocks_features_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_block_parent_id_idx" ON "pages_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_block_path_idx" ON "pages_blocks_features_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_block_items_order_idx" ON "_pages_v_blocks_features_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_block_items_parent_id_idx" ON "_pages_v_blocks_features_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_block_items_icon_idx" ON "_pages_v_blocks_features_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_features_block_order_idx" ON "_pages_v_blocks_features_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_block_parent_id_idx" ON "_pages_v_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_block_path_idx" ON "_pages_v_blocks_features_block" USING btree ("_path");
  CREATE UNIQUE INDEX "icons_key_idx" ON "icons" USING btree ("key");
  CREATE INDEX "icons_updated_at_idx" ON "icons" USING btree ("updated_at");
  CREATE INDEX "icons_created_at_idx" ON "icons" USING btree ("created_at");
  CREATE UNIQUE INDEX "icons_filename_idx" ON "icons" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_icons_fk" FOREIGN KEY ("icons_id") REFERENCES "public"."icons"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_icons_id_idx" ON "payload_locked_documents_rels" USING btree ("icons_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_features_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_features_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_features_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_features_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "icons" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_features_block_items" CASCADE;
  DROP TABLE "pages_blocks_features_block" CASCADE;
  DROP TABLE "_pages_v_blocks_features_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_block" CASCADE;
  DROP TABLE "icons" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_icons_fk";
  
  DROP INDEX "payload_locked_documents_rels_icons_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "icons_id";`)
}
