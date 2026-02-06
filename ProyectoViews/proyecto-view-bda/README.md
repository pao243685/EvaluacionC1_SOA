# Lab Reportes - Next.js Dashboard con PostgreSQL

## Descripción del Proyecto

Aplicación Next.js que visualiza reportes SQL mediante VIEWS de PostgreSQL. La aplicación se ejecuta con Docker Compose y utiliza un usuario de base de datos con permisos mínimos para garantizar la seguridad.

---

## Ejecutar el Proyecto


### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/pao243685/EvaluacionC1_SOA.git
cd EvaluacionC1_SOA/ProyectoViews/proyecto-view-bda
```

2. **Levantar los servicios**
```bash
docker compose up --build
```

3. **Detener los servicios**
```bash
docker compose down
```

---

## Justificación de Índices

Para mejorar el rendimiento de las VIEWS se crearon los siguientes índices. Cada índice fue probado con `EXPLAIN ANALYZE` para observar cómo optimiza el plan de ejecución.

> **Nota:** Se utilizó `SET enable_seqscan = off;` para las pruebas, ya que con tablas pequeñas (<50 filas) el planner de PostgreSQL prefiere usar Sequential Scan.

### 1. Índice en `copies.book_id`

**Creación:**
```sql
CREATE INDEX idx_copies_book_id ON copies(book_id);
```

**Consulta de prueba:**
```sql
EXPLAIN ANALYZE
SELECT * FROM copies WHERE book_id = 10;
```

**Resultado:**
```
Index Scan using idx_copies_book_id on copies  
  (cost=0.14..8.16 rows=1 width=184) 
  (actual time=1.928..1.929 rows=1 loops=1)
  Index Cond: (book_id = 10)
Planning Time: 0.056 ms
Execution Time: 1.943 ms
```

---

### 2. Índice en `loans.member_id`

**Creación:**
```sql
CREATE INDEX idx_loans_member ON loans(member_id);
```

**Consulta de prueba:**
```sql
EXPLAIN ANALYZE
SELECT * FROM loans WHERE member_id = 5;
```

**Resultado:**
```
Index Scan using idx_loans_member on loans  
  (cost=0.14..8.18 rows=2 width=36) 
  (actual time=0.080..0.082 rows=2 loops=1)
  Index Cond: (member_id = 5)
Planning Time: 0.075 ms
Execution Time: 0.095 ms
```

---

### 3. Índice en `loans.copy_id`

**Creación:**
```sql
CREATE INDEX idx_loans_copy_id ON loans(copy_id);
```

**Consulta de prueba:**
```sql
EXPLAIN ANALYZE
SELECT * FROM loans WHERE copy_id = 12;
```

**Resultado:**
```
Index Scan using idx_loans_copy_id on loans  
  (cost=0.14..8.16 rows=1 width=36) 
  (actual time=0.077..0.077 rows=0 loops=1)
  Index Cond: (copy_id = 12)
Planning Time: 0.073 ms
Execution Time: 0.089 ms
```

---

## Pruebas de Permisos de Roles

Se creó un usuario `vw_user` con permisos restringidos únicamente a las vistas (VIEWS).

**Verificación de permisos:**
```sql
SET ROLE vw_user;

SELECT * FROM members;                    -- Debe fallar (sin permisos)
SELECT * FROM vw_most_borrowed_books;     -- Debe funcionar (tiene permisos)
```

---

## Tecnologías Utilizadas

- **Frontend:** Next.js
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker Compose
- **Seguridad:** Roles y permisos de PostgreSQL

