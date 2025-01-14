alter table "public"."tasks_comments" drop constraint "tasks_comments_member_id_fkey";

alter table "public"."tasks_comments" drop constraint "tasks_comments_task_id_fkey";

create table "public"."task_files" (
    "id" uuid not null default gen_random_uuid(),
    "file_name" text not null,
    "file_url" text not null,
    "overview_url" text not null,
    "download_url" text not null,
    "project_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX task_files_pkey ON public.task_files USING btree (id);

alter table "public"."task_files" add constraint "task_files_pkey" PRIMARY KEY using index "task_files_pkey";

alter table "public"."task_files" add constraint "task_files_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."task_files" validate constraint "task_files_project_id_fkey";

alter table "public"."tasks_comments" add constraint "tasks_comments_member_id_fkey" FOREIGN KEY (member_id) REFERENCES project_members(id) ON DELETE CASCADE not valid;

alter table "public"."tasks_comments" validate constraint "tasks_comments_member_id_fkey";

alter table "public"."tasks_comments" add constraint "tasks_comments_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE not valid;

alter table "public"."tasks_comments" validate constraint "tasks_comments_task_id_fkey";

grant delete on table "public"."task_files" to "anon";

grant insert on table "public"."task_files" to "anon";

grant references on table "public"."task_files" to "anon";

grant select on table "public"."task_files" to "anon";

grant trigger on table "public"."task_files" to "anon";

grant truncate on table "public"."task_files" to "anon";

grant update on table "public"."task_files" to "anon";

grant delete on table "public"."task_files" to "authenticated";

grant insert on table "public"."task_files" to "authenticated";

grant references on table "public"."task_files" to "authenticated";

grant select on table "public"."task_files" to "authenticated";

grant trigger on table "public"."task_files" to "authenticated";

grant truncate on table "public"."task_files" to "authenticated";

grant update on table "public"."task_files" to "authenticated";

grant delete on table "public"."task_files" to "service_role";

grant insert on table "public"."task_files" to "service_role";

grant references on table "public"."task_files" to "service_role";

grant select on table "public"."task_files" to "service_role";

grant trigger on table "public"."task_files" to "service_role";

grant truncate on table "public"."task_files" to "service_role";

grant update on table "public"."task_files" to "service_role";


alter table "public"."task_files" add column "task_id" uuid not null;

alter table "public"."task_files" add constraint "task_files_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) not valid;

alter table "public"."task_files" validate constraint "task_files_task_id_fkey";
