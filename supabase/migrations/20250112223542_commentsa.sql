create table "public"."tasks_comments" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "created_at" timestamp with time zone not null default now(),
    "member_id" uuid not null,
    "edited_at" timestamp without time zone,
    "task_id" uuid not null
);



alter table "public"."sprints" add column "description" text;

alter table "public"."sprints" add column "end_date" date;

alter table "public"."sprints" add column "start_date" date;

CREATE UNIQUE INDEX tasks_comments_pkey ON public.tasks_comments USING btree (id);

alter table "public"."tasks_comments" add constraint "tasks_comments_pkey" PRIMARY KEY using index "tasks_comments_pkey";

alter table "public"."tasks_comments" add constraint "tasks_comments_member_id_fkey" FOREIGN KEY (member_id) REFERENCES project_members(id) not valid;

alter table "public"."tasks_comments" validate constraint "tasks_comments_member_id_fkey";

alter table "public"."tasks_comments" add constraint "tasks_comments_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) not valid;

alter table "public"."tasks_comments" validate constraint "tasks_comments_task_id_fkey";

grant delete on table "public"."tasks_comments" to "anon";

grant insert on table "public"."tasks_comments" to "anon";

grant references on table "public"."tasks_comments" to "anon";

grant select on table "public"."tasks_comments" to "anon";

grant trigger on table "public"."tasks_comments" to "anon";

grant truncate on table "public"."tasks_comments" to "anon";

grant update on table "public"."tasks_comments" to "anon";

grant delete on table "public"."tasks_comments" to "authenticated";

grant insert on table "public"."tasks_comments" to "authenticated";

grant references on table "public"."tasks_comments" to "authenticated";

grant select on table "public"."tasks_comments" to "authenticated";

grant trigger on table "public"."tasks_comments" to "authenticated";

grant truncate on table "public"."tasks_comments" to "authenticated";

grant update on table "public"."tasks_comments" to "authenticated";

grant delete on table "public"."tasks_comments" to "service_role";

grant insert on table "public"."tasks_comments" to "service_role";

grant references on table "public"."tasks_comments" to "service_role";

grant select on table "public"."tasks_comments" to "service_role";

grant trigger on table "public"."tasks_comments" to "service_role";

grant truncate on table "public"."tasks_comments" to "service_role";

grant update on table "public"."tasks_comments" to "service_role";


