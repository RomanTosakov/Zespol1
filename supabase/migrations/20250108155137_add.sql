alter table "public"."tasks" add column "member_it" uuid;

alter table "public"."tasks" add constraint "tasks_member_it_fkey" FOREIGN KEY (member_it) REFERENCES project_members(id) not valid;

alter table "public"."tasks" validate constraint "tasks_member_it_fkey";


