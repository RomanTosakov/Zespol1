alter table "public"."profiles" alter column "name" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_into_profiles()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);

    RETURN NEW;
END;
$function$
;


