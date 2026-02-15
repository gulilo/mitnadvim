-- PostgreSQL Database Schema for Mitnadvim App
-- This script creates all tables with proper constraints, relationships, and seed data

BEGIN;

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable pgcrypto extension for password hashing (used by seed data)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create custom enum types
CREATE TYPE shift_status AS ENUM ('pending', 'confirmed', 'cancelled'); -- For shift_slot status
CREATE TYPE shift_status_type AS ENUM ('active', 'canceled'); -- For shift status
CREATE TYPE shift_type_enum AS ENUM ('day', 'evening', 'night'); -- For shift_type
CREATE TYPE "ambulance_type" AS ENUM('white', 'atan');


-- Create tables in dependency order (referenced tables first)

-- 1. Account table (referenced by many other tables)
-- Note: created_by and updated_by reference account itself, so we'll need to handle this carefully
CREATE TABLE account (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_account_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_account_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 2. Area table (referenced by user_info and launch_point)
CREATE TABLE area (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_area_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_area_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 3. User Info table (additional account details)
CREATE TABLE user_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    address TEXT,
    area_id UUID NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_user_info_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_info_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_info_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_info_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 4. Emergency Contacts table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_emergency_contacts_user FOREIGN KEY (user_id) REFERENCES user_info(id) ON DELETE CASCADE,
    CONSTRAINT fk_emergency_contacts_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_emergency_contacts_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 5. Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_permissions_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_permissions_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 6. Tag table
CREATE TABLE tag (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_tag_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_tag_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 7. Tag Permission junction table
CREATE TABLE tag_permission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_tag_permission_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    CONSTRAINT fk_tag_permission_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_tag_permission_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_tag_permission_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate tag-permission relationships
    CONSTRAINT uk_tag_permission UNIQUE (tag_id, permission_id)
);

-- 8. Account Tag junction table
CREATE TABLE account_tag (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_account_tag_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_account_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    CONSTRAINT fk_account_tag_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_account_tag_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate account-tag relationships
    CONSTRAINT uk_account_tag UNIQUE (account_id, tag_id)
);

-- 9. Launch Point table
CREATE TABLE launch_point (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_launch_point_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE,
    CONSTRAINT fk_launch_point_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_launch_point_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 10. Ambulance table
CREATE TABLE ambulance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(255) NOT NULL,
    atan BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_ambulance_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_ambulance_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 11. Permanent Shift table
CREATE TABLE permanent_shift (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL,
    launch_point_id UUID NOT NULL,
    shift_type shift_type_enum NOT NULL,
    week_day INTEGER NOT NULL CHECK (week_day >= 0 AND week_day <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    adult_only BOOLEAN NOT NULL DEFAULT FALSE,
    number_of_slots INTEGER NOT NULL DEFAULT 1,
    ambulance_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_permanent_shift_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE,
    CONSTRAINT fk_permanent_shift_launch_point FOREIGN KEY (launch_point_id) REFERENCES launch_point(id) ON DELETE CASCADE,
    CONSTRAINT fk_permanent_shift_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_permanent_shift_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Check constraint to ensure end_time is after start_time
    CONSTRAINT chk_permanent_shift_times CHECK (end_time > start_time)
);

-- 12. Shift table
CREATE TABLE shift (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permanent_shift_id UUID,
    launch_point_id UUID,
    ambulance_id UUID NOT NULL,
    driver_id UUID,
    date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    shift_type shift_type_enum,
    adult_only BOOLEAN DEFAULT FALSE,
    number_of_slots INTEGER DEFAULT 1,
    status shift_status_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_shift_permanent_shift FOREIGN KEY (permanent_shift_id) REFERENCES permanent_shift(id) ON DELETE SET NULL,
    CONSTRAINT fk_shift_launch_point FOREIGN KEY (launch_point_id) REFERENCES launch_point(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_ambulance FOREIGN KEY (ambulance_id) REFERENCES ambulance(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_driver FOREIGN KEY (driver_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Check constraint to ensure end_time is after start_time (only when both are provided)
    CONSTRAINT chk_shift_times CHECK (start_time IS NULL OR end_time IS NULL OR end_time > start_time)
);

-- 13. Shift Slot table
CREATE TABLE shift_slot (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status shift_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_shift_slot_shift FOREIGN KEY (shift_id) REFERENCES shift(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_slot_user FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_slot_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_slot_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate shift slot registrations
    CONSTRAINT uk_shift_slot UNIQUE (shift_id, user_id)
);

-- 14. Notification table
CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_account_email ON account(email);
CREATE INDEX idx_account_display_name ON account(display_name);
CREATE INDEX idx_user_info_account_id ON user_info(account_id);
CREATE INDEX idx_user_info_area_id ON user_info(area_id);
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_tag_permission_tag_id ON tag_permission(tag_id);
CREATE INDEX idx_tag_permission_permission_id ON tag_permission(permission_id);
CREATE INDEX idx_account_tag_account_id ON account_tag(account_id);
CREATE INDEX idx_account_tag_tag_id ON account_tag(tag_id);
CREATE INDEX idx_launch_point_area_id ON launch_point(area_id);
CREATE INDEX idx_permanent_shift_area_id ON permanent_shift(area_id);
CREATE INDEX idx_permanent_shift_launch_point_id ON permanent_shift(launch_point_id);
CREATE INDEX idx_permanent_shift_week_day ON permanent_shift(week_day);
CREATE INDEX idx_shift_permanent_shift_id ON shift(permanent_shift_id);
CREATE INDEX idx_shift_launch_point_id ON shift(launch_point_id);
CREATE INDEX idx_shift_ambulance_id ON shift(ambulance_id);
CREATE INDEX idx_shift_driver_id ON shift(driver_id);
CREATE INDEX idx_shift_status ON shift(status);
CREATE INDEX idx_shift_date ON shift(date);
CREATE INDEX idx_shift_slot_shift_id ON shift_slot(shift_id);
CREATE INDEX idx_shift_slot_user_id ON shift_slot(user_id);
CREATE INDEX idx_shift_slot_status ON shift_slot(status);
CREATE INDEX idx_notification_user_id ON notification(user_id);
CREATE INDEX idx_notification_read ON notification(read);
CREATE INDEX idx_notification_date ON notification(date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at for all tables with updated_at column
CREATE TRIGGER update_account_updated_at BEFORE UPDATE ON account FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_info_updated_at BEFORE UPDATE ON user_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tag_updated_at BEFORE UPDATE ON tag FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tag_permission_updated_at BEFORE UPDATE ON tag_permission FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_account_tag_updated_at BEFORE UPDATE ON account_tag FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_area_updated_at BEFORE UPDATE ON area FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_launch_point_updated_at BEFORE UPDATE ON launch_point FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ambulance_updated_at BEFORE UPDATE ON ambulance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permanent_shift_updated_at BEFORE UPDATE ON permanent_shift FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_updated_at BEFORE UPDATE ON shift FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_slot_updated_at BEFORE UPDATE ON shift_slot FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_updated_at BEFORE UPDATE ON notification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
-- Create a system user for initial records
-- Note: We need to temporarily disable the foreign key constraint for created_by
-- We'll create the system user first, then update the constraint
ALTER TABLE account ALTER COLUMN created_by DROP NOT NULL;

INSERT INTO account (id, display_name, email, created_by) 
VALUES ('00000000-0000-0000-0000-000000000001', 'System', 'system@mitnadvim.com', NULL);

UPDATE account SET created_by = id WHERE id = '00000000-0000-0000-0000-000000000001';

ALTER TABLE account ALTER COLUMN created_by SET NOT NULL;

-- Create default permissions
INSERT INTO permissions (id, name, created_by) VALUES 
('00000000-0000-0000-0000-000000000006', 'create_user', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000007', 'edit_user', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000008', 'delete_user', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000009', 'create_shift', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000010', 'edit_shift', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000011', 'register_shift', '00000000-0000-0000-0000-000000000001');

-- ============================================
-- Seed data (accounts, users, areas, tags, account_tag)
-- Data extracted from Figma design: MDA Scheduling App - Profile Page
-- ============================================

DO $$
DECLARE
    system_account_id UUID;
    area_tel_aviv_id UUID;
    account_gal_id UUID;
    gal_user_info_id UUID;
    account_yaara_id UUID;
    yaara_user_info_id UUID;
    account_avishag_id UUID;
    avishag_user_info_id UUID;
    account_michal_id UUID;
    michal_user_info_id UUID;
    account_moshe_id UUID;
    moshe_user_info_id UUID;
    account_ofek_id UUID;
    ofek_user_info_id UUID;
    account_yair_id UUID;
    yair_user_info_id UUID;
    account_daniel_id UUID;
    daniel_user_info_id UUID;
BEGIN
    -- Get system account
    SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
    
    -- Ensure system account exists
    IF system_account_id IS NULL THEN
        RAISE EXCEPTION 'System account not found. Please ensure the system account is created first.';
    END IF;
    
    -- Create or get Tel Aviv area
    SELECT id INTO area_tel_aviv_id FROM area WHERE name = 'תל-אביב, יפו' LIMIT 1;
    
    IF area_tel_aviv_id IS NULL THEN
        INSERT INTO area (id, name, created_by)
        VALUES (uuid_generate_v4(), 'תל-אביב, יפו', system_account_id)
        RETURNING id INTO area_tel_aviv_id;
    END IF;
    
    -- Ensure area was created or found
    IF area_tel_aviv_id IS NULL THEN
        RAISE EXCEPTION 'Failed to create or find Tel Aviv area.';
    END IF;
    
    -- ============================================
    -- 1. Main User: Gal Goldman (גל גולדמן)
    -- ============================================
    
    -- Check if account already exists
    SELECT id INTO account_gal_id FROM account WHERE email = 'Goldman_Gal@mail.co' LIMIT 1;
    
    IF account_gal_id IS NULL THEN
        -- Ensure we have valid IDs before creating records
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Create account for Gal Goldman
        -- Password: Goldman_Gal (email name before @)
        INSERT INTO account (
            id,
            display_name,
            email,
            phone,
            password_hash,
            created_at,
            updated_at,
            created_by,
            updated_by
        ) VALUES (
            uuid_generate_v4(),
            'גל גולדמן',
            'Goldman_Gal@mail.co',
            '(057) 555-1234',
            crypt('Goldman_Gal', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(),
            NULL,
            system_account_id,
            NULL
        ) RETURNING id INTO account_gal_id;
        
        -- Create user_info for Gal Goldman
        INSERT INTO user_info (
            id,
            account_id,
            first_name,
            last_name,
            image_url,
            address,
            area_id,
            role,
            created_at,
            updated_at,
            created_by,
            updated_by
        ) VALUES (
            uuid_generate_v4(),
            account_gal_id,
            'גל',
            'גולדמן',
            NULL, -- Image URL can be added later
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id,
            'פאראמדיקית',
            NOW(),
            NULL,
            system_account_id,
            NULL
        ) RETURNING id INTO gal_user_info_id;
    ELSE
        -- Get existing user_info ID
        SELECT ui.id INTO gal_user_info_id 
        FROM user_info ui 
        WHERE ui.account_id = account_gal_id 
        LIMIT 1;
    END IF;
    
    -- ============================================
    -- 2. Emergency Contact: Elisha the Shunamite (אלישע השונמי)
    -- ============================================
    
    -- Create emergency contact relationship for Gal
    IF gal_user_info_id IS NOT NULL THEN
        -- Check if emergency contact already exists
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = gal_user_info_id 
            AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id,
                user_id,
                name,
                relationship,
                phone,
                email,
                address,
                created_at,
                updated_at,
                created_by,
                updated_by
            ) VALUES (
                uuid_generate_v4(),
                gal_user_info_id,
                'אלישע השונמי',
                'הורה',
                '(055) 555-4321',
                'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(),
                NULL,
                system_account_id,
                NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 3. User: Yaara Yankelovitz (יערה ינקלוביץ)
    -- ============================================
    
    SELECT id INTO account_yaara_id FROM account WHERE email = 'Y.B.Shushan@mail.co' LIMIT 1;
    
    IF account_yaara_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: Y.B.Shushan (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'יערה ינקלוביץ', 'Y.B.Shushan@mail.co', '(054) 555-1234',
            crypt('Y.B.Shushan', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_yaara_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_yaara_id, 'יערה', 'ינקלוביץ', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'מגישת עזרה ראשונה',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO yaara_user_info_id;
    ELSE
        SELECT ui.id INTO yaara_user_info_id FROM user_info ui WHERE ui.account_id = account_yaara_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Yaara
    IF yaara_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = yaara_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), yaara_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 4. User: Avishag Hashunamit (אבישג השונמית)
    -- ============================================
    
    SELECT id INTO account_avishag_id FROM account WHERE email = 'Avishag@mail.co' LIMIT 1;
    
    IF account_avishag_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: Avishag (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'אבישג השונמית', 'Avishag@mail.co', '(055) 555-1234',
            crypt('Avishag', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_avishag_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_avishag_id, 'אבישג', 'השונמית', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'חובשת רפואת חירום',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO avishag_user_info_id;
    ELSE
        SELECT ui.id INTO avishag_user_info_id FROM user_info ui WHERE ui.account_id = account_avishag_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Avishag
    IF avishag_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = avishag_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), avishag_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 5. User: Michal Moskin (מיכל מוסקין)
    -- ============================================
    
    SELECT id INTO account_michal_id FROM account WHERE email = 'MP_MDA@mail.co' LIMIT 1;
    
    IF account_michal_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: MP_MDA (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'מיכל מוסקין', 'MP_MDA@mail.co', '(053) 555-1234',
            crypt('MP_MDA', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_michal_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_michal_id, 'מיכל', 'מוסקין', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'מגישת עזרה ראשונה',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO michal_user_info_id;
    ELSE
        SELECT ui.id INTO michal_user_info_id FROM user_info ui WHERE ui.account_id = account_michal_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Michal
    IF michal_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = michal_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), michal_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 6. User: Moshe Markovitz (משה מרקוביץ׳)
    -- ============================================
    
    SELECT id INTO account_moshe_id FROM account WHERE email = 'Moses@mail.co' LIMIT 1;
    
    IF account_moshe_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: Moses (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'משה מרקוביץ׳', 'Moses@mail.co', '(050) 555-1234',
            crypt('Moses', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_moshe_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_moshe_id, 'משה', 'מרקוביץ׳', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'חובש - נהג משתלם',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO moshe_user_info_id;
    ELSE
        SELECT ui.id INTO moshe_user_info_id FROM user_info ui WHERE ui.account_id = account_moshe_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Moshe
    IF moshe_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = moshe_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), moshe_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 7. User: Ofek Aharonov (אופק אהרונוב)
    -- ============================================
    
    SELECT id INTO account_ofek_id FROM account WHERE email = 'Ofek_Cohen@mail.co' LIMIT 1;
    
    IF account_ofek_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: Ofek_Cohen (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'אופק אהרונוב', 'Ofek_Cohen@mail.co', '(056) 555-1234',
            crypt('Ofek_Cohen', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_ofek_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_ofek_id, 'אופק', 'אהרונוב', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'חובש - נהג',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO ofek_user_info_id;
    ELSE
        SELECT ui.id INTO ofek_user_info_id FROM user_info ui WHERE ui.account_id = account_ofek_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Ofek
    IF ofek_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = ofek_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), ofek_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 8. User: Yair Yadin (יאיר ידין)
    -- ============================================
    
    SELECT id INTO account_yair_id FROM account WHERE email = 'Y.CornB@mail.co' LIMIT 1;
    
    IF account_yair_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: Y.CornB (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'יאיר ידין', 'Y.CornB@mail.co', '(051) 555-1234',
            crypt('Y.CornB', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_yair_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_yair_id, 'יאיר', 'ידין', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'חובש - נהג',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO yair_user_info_id;
    ELSE
        SELECT ui.id INTO yair_user_info_id FROM user_info ui WHERE ui.account_id = account_yair_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Yair
    IF yair_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = yair_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), yair_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
    
    -- ============================================
    -- 9. User: Daniel Douglas (דניאל דגלאס)
    -- ============================================
    
    SELECT id INTO account_daniel_id FROM account WHERE email = 'D.Levi@mail.co' LIMIT 1;
    
    IF account_daniel_id IS NULL THEN
        IF system_account_id IS NULL OR area_tel_aviv_id IS NULL THEN
            RAISE EXCEPTION 'Cannot create user: system_account_id or area_tel_aviv_id is NULL';
        END IF;
        
        -- Password: D.Levi (email name before @)
        INSERT INTO account (
            id, display_name, email, phone, password_hash,
            created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), 'דניאל דגלאס', 'D.Levi@mail.co', '(052) 555-1234',
            crypt('D.Levi', gen_salt('bf', 12)), -- bcrypt hash of email name
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO account_daniel_id;
        
        INSERT INTO user_info (
            id, account_id, first_name, last_name, image_url, address,
            area_id, role, created_at, updated_at, created_by, updated_by
        ) VALUES (
            uuid_generate_v4(), account_daniel_id, 'דניאל', 'דגלאס', NULL,
            'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
            area_tel_aviv_id, 'מגיש עזרה ראשונה',
            NOW(), NULL, system_account_id, NULL
        ) RETURNING id INTO daniel_user_info_id;
    ELSE
        SELECT ui.id INTO daniel_user_info_id FROM user_info ui WHERE ui.account_id = account_daniel_id LIMIT 1;
    END IF;
    
    -- Emergency contact for Daniel
    IF daniel_user_info_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM emergency_contacts 
            WHERE user_id = daniel_user_info_id AND email = 'Alisha.Shu@mail.com'
        ) THEN
            INSERT INTO emergency_contacts (
                id, user_id, name, relationship, phone, email, address,
                created_at, updated_at, created_by, updated_by
            ) VALUES (
                uuid_generate_v4(), daniel_user_info_id, 'אלישע השונמי', 'הורה',
                '(055) 555-4321', 'Alisha.Shu@mail.com',
                'רחוב יגאל אלון 96, כניסה א׳, קומה 2, דירה 4, תל-אביב, יפו 1234567',
                NOW(), NULL, system_account_id, NULL
            );
        END IF;
    END IF;
END $$;

-- ============================================
-- Seed Tags with Categories
-- ============================================
DO $$
DECLARE
    system_account_id UUID;
BEGIN
    -- Get system account
    SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
    
    IF system_account_id IS NULL THEN
        RAISE EXCEPTION 'System account not found. Please ensure the system account is created first.';
    END IF;
    
    -- Insert tags with category "גזרה"
    INSERT INTO tag (id, name, category, created_at, updated_at, created_by, updated_by)
    SELECT 
        uuid_generate_v4(),
        tag_name,
        'גזרה',
        NOW(),
        NULL,
        system_account_id,
        NULL
    FROM (VALUES 
        ('צפון'),
        ('דרום'),
        ('מרכז'),
        ('מזרח'),
        ('חוץ'),
        ('וירטואלי'),
        ('שכבה י'),
        ('שכבה יא'),
        ('שכבה יב')
    ) AS tag_values(tag_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM tag WHERE name = tag_values.tag_name AND category = 'גזרה'
    );
    
    -- Insert tags with category "גיל"
    INSERT INTO tag (id, name, category, created_at, updated_at, created_by, updated_by)
    SELECT 
        uuid_generate_v4(),
        tag_name,
        'גיל',
        NOW(),
        NULL,
        system_account_id,
        NULL
    FROM (VALUES 
        ('בוגרים'),
        ('נוער')
    ) AS tag_values(tag_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM tag WHERE name = tag_values.tag_name AND category = 'גיל'
    );
    
    -- Insert tags with category "סאאוס"
    INSERT INTO tag (id, name, category, created_at, updated_at, created_by, updated_by)
    SELECT 
        uuid_generate_v4(),
        tag_name,
        'סאאוס',
        NOW(),
        NULL,
        system_account_id,
        NULL
    FROM (VALUES 
        ('נהג שכיר'),
        ('מורשה נט"ן'),
        ('משתלם נהיגה'),
        ('נהג מתנדב'),
        ('פרמדיק'),
        ('חניך'),
        ('חונך'),
        ('חובש משתלם')
    ) AS tag_values(tag_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM tag WHERE name = tag_values.tag_name AND category = 'סאאוס'
    );
    
    -- Insert tags with category "תחנת אם"
    INSERT INTO tag (id, name, category, created_at, updated_at, created_by, updated_by)
    SELECT 
        uuid_generate_v4(),
        tag_name,
        'תחנת אם',
        NOW(),
        NULL,
        system_account_id,
        NULL
    FROM (VALUES 
        ('תל-אביב'),
        ('רמת גן')
    ) AS tag_values(tag_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM tag WHERE name = tag_values.tag_name AND category = 'תחנת אם'
    );
    
    -- Insert tags with category "ניהול"
    INSERT INTO tag (id, name, category, created_at, updated_at, created_by, updated_by)
    SELECT 
        uuid_generate_v4(),
        tag_name,
        'ניהול',
        NOW(),
        NULL,
        system_account_id,
        NULL
    FROM (VALUES 
        ('א. צפון'),
        ('א.דרום'),
        ('א. מרכז'),
        ('א. מזרח'),
        ('א. חוץ'),
        ('א. ויראואלי'),
        ('א. שכבה י'),
        ('א. שכבה יא'),
        ('א.שכבה יב'),
        ('סדרן עבודה'),
        ('יצירת משתמשים חדשים'),
        ('רכז שיבוצים'),
        ('רכז גזרה')
    ) AS tag_values(tag_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM tag WHERE name = tag_values.tag_name AND category = 'ניהול'
    );
END $$;

-- ============================================
-- Assign Tags to Accounts
-- ============================================
DO $$
DECLARE
    system_account_id UUID;
    account_gal_id UUID;
    account_yaara_id UUID;
    account_avishag_id UUID;
    account_michal_id UUID;
    account_moshe_id UUID;
    account_ofek_id UUID;
    account_yair_id UUID;
    account_daniel_id UUID;
    current_tag_id UUID;
BEGIN
    -- Get system account
    SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
    
    IF system_account_id IS NULL THEN
        RAISE EXCEPTION 'System account not found. Please ensure the system account is created first.';
    END IF;
    
    -- Get account IDs
    SELECT id INTO account_gal_id FROM account WHERE email = 'Goldman_Gal@mail.co' LIMIT 1;
    SELECT id INTO account_yaara_id FROM account WHERE email = 'Y.B.Shushan@mail.co' LIMIT 1;
    SELECT id INTO account_avishag_id FROM account WHERE email = 'Avishag@mail.co' LIMIT 1;
    SELECT id INTO account_michal_id FROM account WHERE email = 'MP_MDA@mail.co' LIMIT 1;
    SELECT id INTO account_moshe_id FROM account WHERE email = 'Moses@mail.co' LIMIT 1;
    SELECT id INTO account_ofek_id FROM account WHERE email = 'Ofek_Cohen@mail.co' LIMIT 1;
    SELECT id INTO account_yair_id FROM account WHERE email = 'Y.CornB@mail.co' LIMIT 1;
    SELECT id INTO account_daniel_id FROM account WHERE email = 'D.Levi@mail.co' LIMIT 1;
    
    -- Gal Goldman tags: וירטואלי, מורשה נט"ן, בוגרים, תל-אביב
    IF account_gal_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'וירטואלי' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_gal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_gal_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'מורשה נט"ן' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_gal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_gal_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'בוגרים' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_gal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_gal_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'תל-אביב' AND category = 'תחנת אם' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_gal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_gal_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Yaara Yankelovitz tags: שכבה יב, מורשה נט"ן, נוער
    IF account_yaara_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'שכבה יב' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yaara_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yaara_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'מורשה נט"ן' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yaara_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yaara_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'נוער' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yaara_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yaara_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Avishag Hashunamit tags: מרכז, בוגרים, תל-אביב
    IF account_avishag_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'מרכז' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_avishag_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_avishag_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'בוגרים' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_avishag_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_avishag_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'תל-אביב' AND category = 'תחנת אם' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_avishag_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_avishag_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Michal Moskin tags: שכבה יא, מורשה נט"ן, חונך, נוער
    IF account_michal_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'שכבה יא' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_michal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_michal_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'מורשה נט"ן' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_michal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_michal_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'חונך' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_michal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_michal_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'נוער' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_michal_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_michal_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Moshe Markovitz tags: חוץ, משתלם נהיגה, בוגרים
    IF account_moshe_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'חוץ' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_moshe_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_moshe_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'משתלם נהיגה' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_moshe_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_moshe_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'בוגרים' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_moshe_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_moshe_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Ofek Aharonov tags: נהג שכיר, תל-אביב
    IF account_ofek_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'נהג שכיר' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_ofek_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_ofek_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'תל-אביב' AND category = 'תחנת אם' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_ofek_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_ofek_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Yair Yadin tags: מזרח, מורשה נט"ן, נהג מתנדב, בוגרים
    IF account_yair_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'מזרח' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yair_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yair_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'מורשה נט"ן' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yair_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yair_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'נהג מתנדב' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yair_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yair_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'בוגרים' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_yair_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_yair_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
    
    -- Daniel Douglas tags: שכבה י, חניך, נוער
    IF account_daniel_id IS NOT NULL THEN
        SELECT id INTO current_tag_id FROM tag WHERE name = 'שכבה י' AND category = 'גזרה' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_daniel_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_daniel_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'חניך' AND category = 'סאאוס' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_daniel_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_daniel_id AND at.tag_id = current_tag_id
            );
        END IF;
        SELECT id INTO current_tag_id FROM tag WHERE name = 'נוער' AND category = 'גיל' LIMIT 1;
        IF current_tag_id IS NOT NULL THEN
            INSERT INTO account_tag (account_id, tag_id, created_at, created_by)
            SELECT account_daniel_id, current_tag_id, NOW(), system_account_id
            WHERE NOT EXISTS (
                SELECT 1 FROM account_tag at WHERE at.account_id = account_daniel_id AND at.tag_id = current_tag_id
            );
        END IF;
    END IF;
END $$;

COMMIT;
