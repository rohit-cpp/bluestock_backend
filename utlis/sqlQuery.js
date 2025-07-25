// sqlQuery.js

// --- Company Table Queries ---
export const createCompanyTableQuery = `
CREATE TABLE IF NOT EXISTS company_details (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(100),
  founded_year INT CHECK (founded_year > 1800),
  employee_count INT CHECK (employee_count >= 0)
);
`;

export const getAllCompanyQuery = `
SELECT * FROM company_details ORDER BY id;
`;

export const insertCompanyQuery = `
INSERT INTO company_details (name, email, industry, location, founded_year, employee_count)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
`;

export const updateCompanyByIdQuery = `
UPDATE company_details 
SET name = $1, email = $2, industry = $3, location = $4, founded_year = $5, employee_count = $6
WHERE id = $7
RETURNING *;
`;

export const deleteCompanyByIdQuery = `
DELETE FROM company_details WHERE id = $1 RETURNING *;
`;

export const getCompanyByIdQuery = `
SELECT * FROM company_details WHERE id = $1;
`;

// --- IPO Table Queries ---
export const createIpoTableQuery = `
CREATE TABLE IF NOT EXISTS ipos (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES company_details(id) ON DELETE CASCADE,
  issue_price NUMERIC(10,2) NOT NULL,
  open_date DATE NOT NULL,
  close_date DATE NOT NULL,
  shares_offered INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const getAllIposQuery = `
SELECT ipos.*, company_details.name AS company_name
FROM ipos
JOIN company_details ON company_details.id = ipos.company_id
ORDER BY open_date DESC;
`;

export const searchIposQuery = `
SELECT ipos.*, company_details.name AS company_name
FROM ipos
JOIN company_details ON company_details.id = ipos.company_id
WHERE company_details.name ILIKE $1 OR CAST(issue_price AS TEXT) ILIKE $1;
`;

export const getIpoByIdQuery = `
SELECT ipos.*, company_details.name AS company_name
FROM ipos
JOIN company_details ON company_details.id = ipos.company_id
WHERE ipos.id = $1;
`;

export const insertIpoQuery = `
INSERT INTO ipos (company_id, issue_price, open_date, close_date, shares_offered)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const updateIpoByIdQuery = `
UPDATE ipos
SET company_id = $1, issue_price = $2, open_date = $3, close_date = $4, shares_offered = $5
WHERE id = $6
RETURNING *;
`;

export const deleteIpoByIdQuery = `
DELETE FROM ipos WHERE id = $1 RETURNING *;
`;
