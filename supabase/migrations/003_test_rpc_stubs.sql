-- Stub ROTAS Map filter RPCs for local/CI monitor smoke tests
CREATE OR REPLACE FUNCTION get_distinct_type()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$ SELECT ARRAY[]::text[] $$;

CREATE OR REPLACE FUNCTION get_distinct_script()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$ SELECT ARRAY[]::text[] $$;

CREATE OR REPLACE FUNCTION get_distinct_location()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$ SELECT ARRAY[]::text[] $$;

CREATE OR REPLACE FUNCTION get_distinct_text()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$ SELECT ARRAY[]::text[] $$;

CREATE OR REPLACE FUNCTION get_distinct_place()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$ SELECT ARRAY[]::text[] $$;

CREATE OR REPLACE FUNCTION get_distinct_first_word()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$ SELECT ARRAY[]::text[] $$;
