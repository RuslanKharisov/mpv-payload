import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_clicks_src" AS ENUM('web', 'ai', 'telegram', 'email');
  CREATE TABLE "clicks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_id" varchar,
  	"tenant_id" integer,
  	"src" "enum_clicks_src" DEFAULT 'web' NOT NULL,
  	"ctx" varchar,
  	"query" varchar,
  	"target" varchar NOT NULL,
  	"ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clicks_id" integer;
  ALTER TABLE "clicks" ADD CONSTRAINT "clicks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "clicks_tenant_idx" ON "clicks" USING btree ("tenant_id");
  CREATE INDEX "clicks_updated_at_idx" ON "clicks" USING btree ("updated_at");
  CREATE INDEX "clicks_created_at_idx" ON "clicks" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clicks_fk" FOREIGN KEY ("clicks_id") REFERENCES "public"."clicks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_clicks_id_idx" ON "payload_locked_documents_rels" USING btree ("clicks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clicks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "clicks" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clicks_fk";
  
  DROP INDEX "payload_locked_documents_rels_clicks_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clicks_id";
  DROP TYPE "public"."enum_clicks_src";`)
}
