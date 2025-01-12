create table "public"."sprints" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "project_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."tasks" add column "sprint_id" uuid;

CREATE UNIQUE INDEX sprint_pkey ON public.sprints USING btree (id);

alter table "public"."sprints" add constraint "sprint_pkey" PRIMARY KEY using index "sprint_pkey";

alter table "public"."sprints" add constraint "sprint_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."sprints" validate constraint "sprint_project_id_fkey";

alter table "public"."tasks" add constraint "tasks_sprint_id_fkey" FOREIGN KEY (sprint_id) REFERENCES sprints(id) not valid;

alter table "public"."tasks" validate constraint "tasks_sprint_id_fkey";

grant delete on table "public"."sprints" to "anon";

grant insert on table "public"."sprints" to "anon";

grant references on table "public"."sprints" to "anon";

grant select on table "public"."sprints" to "anon";

grant trigger on table "public"."sprints" to "anon";

grant truncate on table "public"."sprints" to "anon";

grant update on table "public"."sprints" to "anon";

grant delete on table "public"."sprints" to "authenticated";

grant insert on table "public"."sprints" to "authenticated";

grant references on table "public"."sprints" to "authenticated";

grant select on table "public"."sprints" to "authenticated";

grant trigger on table "public"."sprints" to "authenticated";

grant truncate on table "public"."sprints" to "authenticated";

grant update on table "public"."sprints" to "authenticated";

grant delete on table "public"."sprints" to "service_role";

grant insert on table "public"."sprints" to "service_role";

grant references on table "public"."sprints" to "service_role";

grant select on table "public"."sprints" to "service_role";

grant trigger on table "public"."sprints" to "service_role";

grant truncate on table "public"."sprints" to "service_role";

grant update on table "public"."sprints" to "service_role";


