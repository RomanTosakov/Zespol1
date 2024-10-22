alter table "public"."profiles" drop constraint "profiles_user_id_fkey";

alter table "public"."profiles" drop column "user_id";

alter table "public"."profiles" alter column "id" drop default;

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";


