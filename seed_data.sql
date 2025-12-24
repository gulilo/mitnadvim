-- Seed data for account and user_info tables
-- Data extracted from Figma design: MDA Scheduling App - Profile Page

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, ensure we have a system account for created_by references
DO $$
DECLARE
    system_account_id UUID;
BEGIN
    -- Get or create system account
    SELECT id INTO system_account_id FROM account WHERE email = 'system@mitnadvim.com' LIMIT 1;
    
    IF system_account_id IS NULL THEN
        -- Create system account if it doesn't exist
        INSERT INTO account (id, display_name, email, created_by) 
        VALUES ('00000000-0000-0000-0000-000000000001', 'System', 'system@mitnadvim.com', '00000000-0000-0000-0000-000000000001')
        RETURNING id INTO system_account_id;
        
        -- Update created_by to self-reference
        UPDATE account SET created_by = id WHERE id = system_account_id;
    END IF;
END $$;

-- Get system account ID for created_by references
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
    -- Note: Elisha is only an emergency contact, not a user account
    
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

COMMIT;

