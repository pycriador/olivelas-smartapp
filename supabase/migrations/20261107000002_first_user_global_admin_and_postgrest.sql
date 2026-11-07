-- =============================================================================
-- Migration 002: First User = Global Admin Trigger & Supabase PostgREST Grants
-- Target: Supabase PostgreSQL (`olivelas_smartapp` isolated schema)
-- Rule: The very first user registered in `olivelas_smartapp.users` automatically
--       receives `role = 'Global Admin'` and `primary_group_id = 'grp_admin'`.
-- =============================================================================

SET search_path TO olivelas_smartapp, public;

-- 1. Trigger Function: Promote First User to Global Admin before insert
CREATE OR REPLACE FUNCTION olivelas_smartapp.fn_before_user_insert_first_global_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO existing_count FROM olivelas_smartapp.users;
    IF existing_count = 0 THEN
        NEW.role := 'Global Admin';
        NEW.primary_group_id := 'grp_admin';
        NEW.status := 'Active';
        NEW.is_active := TRUE;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_before_user_insert_first_global_admin ON olivelas_smartapp.users;
CREATE TRIGGER trg_before_user_insert_first_global_admin
BEFORE INSERT ON olivelas_smartapp.users
FOR EACH ROW
EXECUTE FUNCTION olivelas_smartapp.fn_before_user_insert_first_global_admin();

-- 2. Trigger Function: Sync primary group membership & active_user_id after insert
CREATE OR REPLACE FUNCTION olivelas_smartapp.fn_after_user_insert_sync_group()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_after INTEGER;
    ug_id VARCHAR(64);
BEGIN
    IF NEW.primary_group_id IS NOT NULL AND NEW.primary_group_id <> '' THEN
        ug_id := 'ug_' || substr(md5(NEW.id || '_' || NEW.primary_group_id), 1, 12);
        INSERT INTO olivelas_smartapp.user_groups (id, user_id, group_id, created_at)
        SELECT ug_id, NEW.id, NEW.primary_group_id, NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM olivelas_smartapp.user_groups
            WHERE user_id = NEW.id AND group_id = NEW.primary_group_id
        );
    END IF;

    SELECT COUNT(*) INTO total_after FROM olivelas_smartapp.users;
    IF total_after = 1 AND NEW.role = 'Global Admin' THEN
        INSERT INTO olivelas_smartapp.system_states (key, value)
        VALUES ('active_user_id', jsonb_build_object('user_id', NEW.id))
        ON CONFLICT (key) DO UPDATE
        SET value = jsonb_build_object('user_id', NEW.id);
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_after_user_insert_sync_group ON olivelas_smartapp.users;
CREATE TRIGGER trg_after_user_insert_sync_group
AFTER INSERT ON olivelas_smartapp.users
FOR EACH ROW
EXECUTE FUNCTION olivelas_smartapp.fn_after_user_insert_sync_group();

-- 3. Grant Schema & Table Access for Supabase API Roles (PostgREST)
GRANT USAGE ON SCHEMA olivelas_smartapp TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA olivelas_smartapp TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA olivelas_smartapp TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA olivelas_smartapp TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA olivelas_smartapp
GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA olivelas_smartapp
GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA olivelas_smartapp
GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 4. Expose `olivelas_smartapp` schema in Supabase PostgREST Data API
DO $$
BEGIN
    EXECUTE 'ALTER ROLE authenticator SET pgrst.db_schemas = ''public, storage, graphql_public, olivelas_smartapp''';
    NOTIFY pgrst, 'reload config';
    NOTIFY pgrst, 'reload schema';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not alter authenticator role pgrst.db_schemas: %', SQLERRM;
END;
$$;
