-- PostgreSQL Database Schema for Mitnadvim App
-- This script creates all tables with proper constraints and relationships

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum type for shift status
CREATE TYPE shift_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create tables in dependency order (referenced tables first)

-- 1. User Group table (referenced by user)
CREATE TABLE user_group (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID
);

-- 2. Account table (referenced by many other tables)
CREATE TABLE account (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    password_hash TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_group_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_user_group FOREIGN KEY (user_group_id) REFERENCES user_group(id),
    CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 3. User Info table (additional account details)
CREATE TABLE user_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    image TEXT,
    address TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_user_info_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_info_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_info_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
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

-- 5. Team table
CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    manager_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_team_manager FOREIGN KEY (manager_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 6. User Team junction table (many-to-many relationship)
CREATE TABLE user_team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    team_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_user_team_user FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_team_team FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_team_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_team_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate user-team relationships
    CONSTRAINT uk_user_team UNIQUE (user_id, team_id)
);

-- 7. User Group Permission junction table
CREATE TABLE user_group_permission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_group_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_ugp_user_group FOREIGN KEY (user_group_id) REFERENCES user_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_ugp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_ugp_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_ugp_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate group-permission relationships
    CONSTRAINT uk_user_group_permission UNIQUE (user_group_id, permission_id)
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

-- 10. Schedule table
CREATE TABLE schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_schedule_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE
);

-- 11. Shift table
CREATE TABLE shift (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL,
    driver_id UUID,
    launch_point_id UUID NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    slots INTEGER NOT NULL CHECK (slots > 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_shift_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_driver FOREIGN KEY (driver_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_launch_point FOREIGN KEY (launch_point_id) REFERENCES launch_point(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Check constraint to ensure end_date is after start_date
    CONSTRAINT chk_shift_dates CHECK (end_date > start_date)
);

-- 12. Shift Register table
CREATE TABLE shift_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status shift_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_shift_register_shift FOREIGN KEY (shift_id) REFERENCES shift(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_register_user FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_register_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_register_updated_by FOREIGN KEY (updated_by) REFERENCES account(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate shift registrations
    CONSTRAINT uk_shift_register UNIQUE (shift_id, user_id)
);

-- 13. Notification table
CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    
    -- Foreign key constraints
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_created_by FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_account_email ON account(email);
CREATE INDEX idx_account_display_name ON account(display_name);
CREATE INDEX idx_account_user_group_id ON account(user_group_id);
CREATE INDEX idx_user_info_account_id ON user_info(account_id);
CREATE INDEX idx_team_manager_id ON team(manager_id);
CREATE INDEX idx_user_team_user_id ON user_team(user_id);
CREATE INDEX idx_user_team_team_id ON user_team(team_id);
CREATE INDEX idx_shift_schedule_id ON shift(schedule_id);
CREATE INDEX idx_shift_driver_id ON shift(driver_id);
CREATE INDEX idx_shift_launch_point_id ON shift(launch_point_id);
CREATE INDEX idx_shift_register_shift_id ON shift_register(shift_id);
CREATE INDEX idx_shift_register_user_id ON shift_register(user_id);
CREATE INDEX idx_shift_register_status ON shift_register(status);
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

-- Create triggers to automatically update updated_at for all tables
CREATE TRIGGER update_account_updated_at BEFORE UPDATE ON account FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_team_updated_at BEFORE UPDATE ON user_team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_group_updated_at BEFORE UPDATE ON user_group FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_group_permission_updated_at BEFORE UPDATE ON user_group_permission FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_area_updated_at BEFORE UPDATE ON area FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_launch_point_updated_at BEFORE UPDATE ON launch_point FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedule_updated_at BEFORE UPDATE ON schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_updated_at BEFORE UPDATE ON shift FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_register_updated_at BEFORE UPDATE ON shift_register FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
-- Create a system user for initial records
INSERT INTO account (id, display_name, email, created_by) 
VALUES ('00000000-0000-0000-0000-000000000001', 'System', 'system@mitnadvim.com', '00000000-0000-0000-0000-000000000001');

-- Create default user groups
INSERT INTO user_group (id, name, created_by) VALUES 
('00000000-0000-0000-0000-000000000002', 'Admin', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', 'Manager', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000004', 'Driver', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000005', 'User', '00000000-0000-0000-0000-000000000001');

-- Create default permissions
INSERT INTO permissions (id, name, created_by) VALUES 
('00000000-0000-0000-0000-000000000006', 'create_user', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000007', 'edit_user', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000008', 'delete_user', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000009', 'create_shift', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000010', 'edit_shift', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000011', 'register_shift', '00000000-0000-0000-0000-000000000001');

-- Grant all permissions to Admin group
INSERT INTO user_group_permission (user_group_id, permission_id, created_by) 
SELECT '00000000-0000-0000-0000-000000000002', id, '00000000-0000-0000-0000-000000000001' 
FROM permissions;

-- Update system user to be in Admin group
UPDATE account SET user_group_id = '00000000-0000-0000-0000-000000000002'
WHERE id = '00000000-0000-0000-0000-000000000001';

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
