alter table "public"."tasks_comments" drop constraint "tasks_comments_member_id_fkey";

alter table "public"."tasks_comments" add constraint "tasks_comments_member_id_fkey" FOREIGN KEY (member_id) REFERENCES project_members(id) ON DELETE CASCADE not valid;

alter table "public"."tasks_comments" validate constraint "tasks_comments_member_id_fkey";


alter table "public"."tasks_comments" drop constraint "tasks_comments_task_id_fkey";

alter table "public"."tasks_comments" add constraint "tasks_comments_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE not valid;

alter table "public"."tasks_comments" validate constraint "tasks_comments_task_id_fkey";
