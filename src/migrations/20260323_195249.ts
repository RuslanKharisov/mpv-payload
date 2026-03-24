import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tenants_source" AS ENUM('manual', 'parsing');
  CREATE TABLE "company_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"tenant_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "tenants" ADD COLUMN "description" varchar;
  ALTER TABLE "tenants" ADD COLUMN "country" varchar;
  ALTER TABLE "tenants" ADD COLUMN "address" varchar;
  ALTER TABLE "tenants" ADD COLUMN "isForeign" boolean DEFAULT false;
  ALTER TABLE "tenants" ADD COLUMN "source" "enum_tenants_source" DEFAULT 'manual';
  ALTER TABLE "tenants_rels" ADD COLUMN "company_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "company_tags_id" integer;
  CREATE UNIQUE INDEX "company_tags_slug_idx" ON "company_tags" USING btree ("slug");
  CREATE INDEX "company_tags_updated_at_idx" ON "company_tags" USING btree ("updated_at");
  CREATE INDEX "company_tags_created_at_idx" ON "company_tags" USING btree ("created_at");
  ALTER TABLE "tenants_rels" ADD CONSTRAINT "tenants_rels_company_tags_fk" FOREIGN KEY ("company_tags_id") REFERENCES "public"."company_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_company_tags_fk" FOREIGN KEY ("company_tags_id") REFERENCES "public"."company_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tenants_rels_company_tags_id_idx" ON "tenants_rels" USING btree ("company_tags_id");
  CREATE INDEX "payload_locked_documents_rels_company_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("company_tags_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "company_tags" CASCADE;
  ALTER TABLE "tenants_rels" DROP CONSTRAINT "tenants_rels_company_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_company_tags_fk";
  
  DROP INDEX "tenants_rels_company_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_company_tags_id_idx";
  ALTER TABLE "tenants" DROP COLUMN "description";
  ALTER TABLE "tenants" DROP COLUMN "country";
  ALTER TABLE "tenants" DROP COLUMN "address";
  ALTER TABLE "tenants" DROP COLUMN "isForeign";
  ALTER TABLE "tenants" DROP COLUMN "source";
  ALTER TABLE "tenants_rels" DROP COLUMN "company_tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "company_tags_id";
  DROP TYPE "public"."enum_tenants_source";`)
}
