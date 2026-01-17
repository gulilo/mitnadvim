-- PostgreSQL Database Schema for Mitnadvim App
-- This script creates all tables with proper constraints and relationships

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE shift_status AS ENUM ('pending', 'confirmed', 'cancelled'); -- For shift_slot status
CREATE TYPE shift_status_type AS ENUM ('active', 'canceled'); -- For shift status
CREATE TYPE shift_type_enum AS ENUM ('day', 'evening', 'night'); -- For shift_type

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

-- 2. User Info table (additional account details)
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

-- 3. Emergency Contacts table
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

-- 4. Permissions table
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

-- 5. Tag table
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

-- 6. Tag Permission junction table
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

-- 7. Account Tag junction table
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

-- 8. Area table
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

-- Insert sample notifications from notificationPanel.tsx
-- Notification 1: "הודעה למתנדבים"
INSERT INTO notification (
    id,
    user_id,
    title,
    message,
    date,
    read,
    created_at,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cc64fcef-5edb-4ad7-b8ef-e205e4d8fafd',
    'הודעה למתנדבים',
    'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק.',
    '2025-07-11 14:45:00+00'::timestamp with time zone,
    FALSE,
    '2025-07-11 14:45:00+00'::timestamp with time zone,
    '2c722ede-eb04-413f-b30b-aec09fa83caa'
);

-- Notification 2: "בקשת השיבוץ שלך אושרה 😃"
INSERT INTO notification (
    id,
    user_id,
    title,
    message,
    date,
    read,
    created_at,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cc64fcef-5edb-4ad7-b8ef-e205e4d8fafd',
    'בקשת השיבוץ שלך אושרה 😃',
    'שובצת למשמרת ערב ביום רביעי (16/7/2025) בנה״ז ת״א 2.',
    '2025-07-08 11:17:00+00'::timestamp with time zone,
    FALSE,
    '2025-07-08 11:17:00+00'::timestamp with time zone,
    '2c722ede-eb04-413f-b30b-aec09fa83caa'
);

-- Notification 3: "בקשת השיבוץ שלך נדחתה ☹️"
INSERT INTO notification (
    id,
    user_id,
    title,
    message,
    date,
    read,
    created_at,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cc64fcef-5edb-4ad7-b8ef-e205e4d8fafd',
    'בקשת השיבוץ שלך נדחתה ☹️',
    'לצערנו לא ניתן לשבץ אותך למשמרת בוקר ביום שישי (18/7/2025) בנה״ז נט״ן ת״א 1. בכל שאלה או הבהרה אנא פני לרכז שלך.',
    '2025-07-06 08:32:00+00'::timestamp with time zone,
    FALSE,
    '2025-07-06 08:32:00+00'::timestamp with time zone,
    '2c722ede-eb04-413f-b30b-aec09fa83caa'
);

COMMIT;
