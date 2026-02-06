
-- VIEW: vw_most_borrowed_books
-- Qué devuelve:
--   Los libros mas prestados 
-- Grain:
--   1 fila representa 1 libro
-- Métricas:
--   count de libros prestados
-- VERIFY:
--   SELECT * FROM vw_most_borrowed_books LIMIT 5;
--   SELECT COUNT(*) FROM vw_most_borrowed_books;

CREATE OR REPLACE VIEW vw_most_borrowed_books AS
  SELECT
    b.id AS libro_id,
    b.author AS libro_autor,
    b.title AS libro_titulo,
      COUNT(l.id) AS total_prestados,
      RANK() OVER (
        ORDER BY COUNT(l.id) DESC
        ) AS prestados_rank
  FROM books b
  LEFT JOIN copies c ON b.id = c.book_id
  LEFT JOIN loans l ON c.id = l.copy_id
  GROUP BY b.id, b.title, b.author;


-- VIEW: vw_overdue_loans
-- Qué devuelve:
--   Prestamos vencidos con dias de retraso y monto sugerido.
-- Grain:
--   1 fila representa 1 prestamo vencido
-- Métricas:
--   count de dias_retraso, sum de monto_sugerido
-- VERIFY:
--   SELECT * FROM vw_overdue_loans LIMIT 5;
--   SELECT COUNT(*) FROM vw_overdue_loans;

CREATE OR REPLACE VIEW vw_overdue_loans AS
WITH multas_cte AS (
    SELECT
        l.id AS loan_id,
        m.id AS member_id,
        m.name AS member_name,
        c.barcode AS copy_barcode,
        b.title AS book_titulo,
        l.loaned_at AS loaned_at,
        l.due_at AS due_at,
        
        -- convertir a días enteros
        EXTRACT(DAY FROM (CURRENT_DATE - l.due_at))::int AS dias_retraso,

        CASE
            WHEN EXTRACT(DAY FROM (CURRENT_DATE - l.due_at))::int <= 0 THEN 0
            ELSE GREATEST(5, EXTRACT(DAY FROM (CURRENT_DATE - l.due_at))::int * 1)
        END AS monto_sugerido

    FROM loans l
    JOIN members m ON l.member_id = m.id
    JOIN copies c  ON l.copy_id = c.id
    JOIN books b   ON c.book_id = b.id
    WHERE l.returned_at IS NULL
)
SELECT *
FROM multas_cte
WHERE dias_retraso >= 1
ORDER BY dias_retraso DESC;




-- VIEW: vw_fines_summary
-- Qué devuelve:
--  Resumen mensual de multas pagadas y pendientes
-- Grain:
--   1 fila representa 1 multa
-- Métricas:
--   conut de total de multas, suma de multas pagas y por pagar
-- VERIFY:
--   SELECT * FROM vw_fines_summary LIMIT 5;
--   SELECT COUNT(*) FROM vw_fines_summary;

CREATE OR REPLACE VIEW vw_fines_summary AS
SELECT
    m.id AS usuario_id,
    DATE_TRUNC('month', COALESCE(f.paid_at, CURRENT_DATE)) AS mes,
    COUNT(*) AS total_multas,
    SUM(CASE WHEN f.paid_at IS NOT NULL THEN 1 ELSE 0 END) AS pagadas,
    SUM(CASE WHEN f.paid_at IS NULL THEN 1 ELSE 0 END) AS pendientes
FROM fines f
JOIN loans l ON f.loan_id = l.id
JOIN members m ON l.member_id = m.id
GROUP BY m.id, DATE_TRUNC('month', COALESCE(f.paid_at, CURRENT_DATE))
having COUNT(*) > 0;




-- VIEW: vw_member_activity
-- Qué devuelve:
--   Socios activos y tasa de atraso
-- Grain:
--   1 fila representa 1 miembro
-- Métricas:
--   
-- VERIFY:
--   SELECT * FROM vw_member_activity LIMIT 5;
--   SELECT COUNT(*) FROM vw_member_activity;

CREATE OR REPLACE VIEW vw_member_activity AS
WITH consulta1 AS (
    SELECT 
        m.id AS id_miembro,
        m.name AS nombre_miembro,
        COUNT(l.id) AS total_prestamos,
        COUNT(f.id) AS total_multas,
        SUM(
            CASE 
                WHEN l.due_at < CURRENT_DATE AND l.returned_at IS NULL THEN 1 
                ELSE 0 
            END
        ) AS prestamos_atrasados
    FROM members m
    LEFT JOIN loans l ON m.id = l.member_id
    LEFT JOIN fines f ON l.id = f.loan_id
    GROUP BY m.id, m.name
)
SELECT 
    id_miembro,
    nombre_miembro,
    total_prestamos,
    total_multas,
    prestamos_atrasados,
    ROUND(
        COALESCE(prestamos_atrasados::decimal / NULLIF(total_prestamos, 0), 0) * 100,
        2
    ) AS tasa_atraso
FROM consulta1
GROUP BY 
    id_miembro,
    nombre_miembro,
    total_prestamos,
    total_multas,
    prestamos_atrasados
HAVING total_prestamos > 0;



-- VIEW: vw_inventory_health
-- Qué devuelve:
--   Salud de inventario por categoria de libro
-- Grain:
--   1 fila representa 1 categoria de libro
-- Métricas:
--   count de libros, count de copias disponibles, count de copias prestadas, count de copias perdidas

-- VERIFY:
--   SELECT * FROM vw_inventory_health LIMIT 5;
--   SELECT COUNT(*) FROM vw_inventory_health;

CREATE OR REPLACE VIEW vw_inventory_health AS
SELECT 
    b.category AS categoria,
    COUNT(DISTINCT b.id) AS total_libros,
    COUNT(c.id) AS total_copias,
    SUM(CASE WHEN c.status = 'disponible' THEN 1 ELSE 0 END) AS copias_disponibles,
    SUM(CASE WHEN c.status = 'prestado' THEN 1 ELSE 0 END) AS copias_prestadas,
    SUM(CASE WHEN c.status = 'perdido' THEN 1 ELSE 0 END) AS copias_perdidas
FROM books b
LEFT JOIN copies c ON b.id = c.book_id
GROUP BY b.category;


   

