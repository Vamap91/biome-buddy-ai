-- Verificar se o usuário viniciuspaschoa1@hotmail.com existe e tem role de admin
-- Primeiro, vamos buscar o ID do usuário pelo email
DO $$
DECLARE
    user_uuid UUID;
    existing_admin_role UUID;
BEGIN
    -- Buscar o ID do usuário pelo email na tabela auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'viniciuspaschoa1@hotmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'Usuário com email viniciuspaschoa1@hotmail.com não encontrado';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Usuário encontrado com ID: %', user_uuid;
    
    -- Verificar se já existe role de admin para este usuário
    SELECT id INTO existing_admin_role
    FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin';
    
    IF existing_admin_role IS NOT NULL THEN
        RAISE NOTICE 'Usuário já possui role de admin';
    ELSE
        -- Inserir role de admin para o usuário
        INSERT INTO public.user_roles (user_id, role)
        VALUES (user_uuid, 'admin');
        
        RAISE NOTICE 'Role de admin adicionada com sucesso para o usuário';
    END IF;
    
END $$;