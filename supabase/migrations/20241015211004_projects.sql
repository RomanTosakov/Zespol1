alter table "public"."project_members" add column "email" text not null;

alter table "public"."project_members" add column "name" text not null;

alter table "public"."projects" add column "primary_owner" uuid not null;

alter table "public"."projects" add column "slug" text not null;

alter table "public"."projects" add constraint "projects_primary_owner_fkey" FOREIGN KEY (primary_owner) REFERENCES profiles(id) not valid;

alter table "public"."projects" validate constraint "projects_primary_owner_fkey";


