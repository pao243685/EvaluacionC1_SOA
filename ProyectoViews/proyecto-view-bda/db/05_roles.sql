-- Rol solo para vistas
CREATE ROLE just_vw_role;

-- Usuario de vistas
CREATE USER vw_user WITH PASSWORD 'annara20';

-- Relación entre ellos
GRANT just_vw_role TO vw_user;

-- Permiso para conexion con BD
GRANT CONNECT ON DATABASE tarea5 TO just_vw_role;

-- Permiso para usar el esquema 
GRANT USAGE ON SCHEMA public TO just_vw_role;

-- Quitar permisos en tablas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM just_vw_role;

-- Permisos en vistas
GRANT SELECT ON
  vw_most_borrowed_books,
  vw_overdue_loans,
  vw_fines_summary,
  vw_member_activity,
  vw_inventory_health
TO just_vw_role;

-- Permisos para nuevas vistas
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO just_vw_role;
