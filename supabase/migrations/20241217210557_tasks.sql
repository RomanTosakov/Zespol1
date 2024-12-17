create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "member_id" uuid,
    "title" text not null,
    "description" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "start_date" date,
    "due_date" date
);


alter table "public"."tasks" enable row level security;

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."tasks" add constraint "tasks_member_id_fkey" FOREIGN KEY (member_id) REFERENCES project_members(id) not valid;

alter table "public"."tasks" validate constraint "tasks_member_id_fkey";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";


