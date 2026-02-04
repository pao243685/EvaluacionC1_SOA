
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_copies_status ON copies(status);
CREATE INDEX idx_loans_member ON loans(member_id);
CREATE INDEX idx_loans_due_at ON loans(due_at);