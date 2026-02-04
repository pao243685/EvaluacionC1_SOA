CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    member_type VARCHAR(30) NOT NULL CHECK(member_type in ('estudiante','alumno', 'otro')) ,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE  
);

CREATE TABLE copies (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('disponible', 'prestado', 'perdido'))
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    copy_id INT NOT NULL REFERENCES copies(id) ON DELETE RESTRICT,
    loaned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP NOT NULL,
    returned_at TIMESTAMP
);

CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    loan_id INT NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    paid_at TIMESTAMP
);
