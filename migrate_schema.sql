-- Migration script to update database schema
-- This script migrates from the old schema to the new schema
-- Run this script on an existing database to apply all changes

-- ============================================
-- 1. Remove user_group table and references
-- ============================================

-- Drop foreign key constraint from account table
ALTER TABLE account DROP CONSTRAINT IF EXISTS fk_account_user_group;

-- Drop the user_group_id column from account table
ALTER TABLE account DROP COLUMN IF EXISTS user_group_id;

-- Drop the user_group table (do this last to avoid foreign key issues)
DROP TABLE IF EXISTS user_group CASCADE;

-- ============================================
-- 2. Add audit fields to user_info table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_info'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first (if they don't exist)
        ALTER TABLE user_info 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        -- Update existing rows with default values
        IF system_account_id IS NOT NULL THEN
            UPDATE user_info 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL after setting values
        ALTER TABLE user_info
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_info'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_info_created_by'
        ) THEN
            ALTER TABLE user_info
                ADD CONSTRAINT fk_user_info_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_info_updated_by'
        ) THEN
            ALTER TABLE user_info
                ADD CONSTRAINT fk_user_info_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 3. Add audit fields to emergency_contacts table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'emergency_contacts'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first
        ALTER TABLE emergency_contacts 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        IF system_account_id IS NOT NULL THEN
            UPDATE emergency_contacts 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL
        ALTER TABLE emergency_contacts
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'emergency_contacts'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_emergency_contacts_created_by'
        ) THEN
            ALTER TABLE emergency_contacts
                ADD CONSTRAINT fk_emergency_contacts_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_emergency_contacts_updated_by'
        ) THEN
            ALTER TABLE emergency_contacts
                ADD CONSTRAINT fk_emergency_contacts_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 4. Add audit fields to area table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'area'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first
        ALTER TABLE area 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        IF system_account_id IS NOT NULL THEN
            UPDATE area 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL
        ALTER TABLE area
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'area'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_area_created_by'
        ) THEN
            ALTER TABLE area
                ADD CONSTRAINT fk_area_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_area_updated_by'
        ) THEN
            ALTER TABLE area
                ADD CONSTRAINT fk_area_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 5. Add audit fields to launch_point table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'launch_point'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first
        ALTER TABLE launch_point 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        IF system_account_id IS NOT NULL THEN
            UPDATE launch_point 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL
        ALTER TABLE launch_point
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'launch_point'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_launch_point_created_by'
        ) THEN
            ALTER TABLE launch_point
                ADD CONSTRAINT fk_launch_point_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_launch_point_updated_by'
        ) THEN
            ALTER TABLE launch_point
                ADD CONSTRAINT fk_launch_point_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 6. Add audit fields to ambulance table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ambulance'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first
        ALTER TABLE ambulance 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        IF system_account_id IS NOT NULL THEN
            UPDATE ambulance 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL
        ALTER TABLE ambulance
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ambulance'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_ambulance_created_by'
        ) THEN
            ALTER TABLE ambulance
                ADD CONSTRAINT fk_ambulance_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_ambulance_updated_by'
        ) THEN
            ALTER TABLE ambulance
                ADD CONSTRAINT fk_ambulance_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 7. Add audit fields to shift table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'shift'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first
        ALTER TABLE shift 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        IF system_account_id IS NOT NULL THEN
            UPDATE shift 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL
        ALTER TABLE shift
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'shift'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_shift_created_by'
        ) THEN
            ALTER TABLE shift
                ADD CONSTRAINT fk_shift_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_shift_updated_by'
        ) THEN
            ALTER TABLE shift
                ADD CONSTRAINT fk_shift_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 8. Add audit fields to shift_slot table
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'shift_slot'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add audit columns as nullable first
        ALTER TABLE shift_slot 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS updated_by UUID;

        -- Try to find system account, otherwise use first account
        SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
        IF system_account_id IS NULL THEN
            SELECT id INTO system_account_id FROM account LIMIT 1;
        END IF;
        
        IF system_account_id IS NOT NULL THEN
            UPDATE shift_slot 
            SET created_by = COALESCE(created_by, system_account_id),
                created_at = COALESCE(created_at, NOW())
            WHERE created_by IS NULL OR created_at IS NULL;
        END IF;

        -- Now make created_at and created_by NOT NULL
        ALTER TABLE shift_slot
            ALTER COLUMN created_at SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT NOW(),
            ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraints
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'shift_slot'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_shift_slot_created_by'
        ) THEN
            ALTER TABLE shift_slot
                ADD CONSTRAINT fk_shift_slot_created_by 
                    FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_shift_slot_updated_by'
        ) THEN
            ALTER TABLE shift_slot
                ADD CONSTRAINT fk_shift_slot_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 9. Add updated_at and updated_by to notification table
-- ============================================

DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notification'
    ) INTO table_exists;
    
    IF table_exists THEN
        ALTER TABLE notification 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS updated_by UUID;
    END IF;
END $$;

-- Add foreign key constraint for updated_by
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notification'
    ) INTO table_exists;
    
    IF table_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_notification_updated_by'
        ) THEN
            ALTER TABLE notification
                ADD CONSTRAINT fk_notification_updated_by 
                    FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 10. Add phone column to account table (if missing)
-- ============================================

ALTER TABLE account 
    ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- ============================================
-- 11. Create/update triggers for updated_at columns
-- ============================================

-- Create or replace the function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create or replace triggers for all tables with updated_at
DROP TRIGGER IF EXISTS update_user_info_updated_at ON user_info;
CREATE TRIGGER update_user_info_updated_at 
    BEFORE UPDATE ON user_info 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emergency_contacts_updated_at ON emergency_contacts;
CREATE TRIGGER update_emergency_contacts_updated_at 
    BEFORE UPDATE ON emergency_contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_area_updated_at ON area;
CREATE TRIGGER update_area_updated_at 
    BEFORE UPDATE ON area 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_launch_point_updated_at ON launch_point;
CREATE TRIGGER update_launch_point_updated_at 
    BEFORE UPDATE ON launch_point 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ambulance_updated_at ON ambulance;
CREATE TRIGGER update_ambulance_updated_at 
    BEFORE UPDATE ON ambulance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shift_updated_at ON shift;
CREATE TRIGGER update_shift_updated_at 
    BEFORE UPDATE ON shift 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shift_slot_updated_at ON shift_slot;
CREATE TRIGGER update_shift_slot_updated_at 
    BEFORE UPDATE ON shift_slot 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_updated_at ON notification;
CREATE TRIGGER update_notification_updated_at 
    BEFORE UPDATE ON notification 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. Drop indexes that are no longer needed
-- ============================================

DROP INDEX IF EXISTS idx_account_user_group_id;

-- ============================================
-- Migration complete!
-- ============================================

COMMIT;

