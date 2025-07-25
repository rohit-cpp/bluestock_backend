// sqlQueries.js

export const createIndexesQuery = `
CREATE INDEX IF NOT EXISTS idx_company_name ON company_details(name);
CREATE INDEX IF NOT EXISTS idx_ipo_company_id ON ipos(company_id);
CREATE INDEX IF NOT EXISTS idx_doc_ipo_id ON documents(ipo_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

// ---------------------- Company Table ----------------------
export const createCompaniesDetailsTableQuery = `
  CREATE TABLE IF NOT EXISTS companies_details (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    ceo VARCHAR(255),
    headquarters VARCHAR(255),
    founded_year INTEGER
  );
`;
export const createCompanyTableQuery = `
CREATE TABLE IF NOT EXISTS company_details (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(100),
  founded_year INT CHECK (founded_year > 1800),
  employee_count INT CHECK (employee_count >= 0)
);`;

export const getAllCompanyQuery = `
SELECT * FROM company_details ORDER BY id;`;

export const insertCompanyQuery = `
INSERT INTO company_details (name, email, industry, location, founded_year, employee_count)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;`;

export const updateCompanyByIdQuery = `
UPDATE company_details 
SET name = $1, email = $2, industry = $3, location = $4, founded_year = $5, employee_count = $6
WHERE id = $7
RETURNING *;`;

export const deleteCompanyByIdQuery = `
DELETE FROM company_details WHERE id = $1 RETURNING *;`;

export const getCompanyByIdQuery = `
SELECT * FROM company_details WHERE id = $1;`;

// ---------------------- IPO Table ----------------------
export const createIpoTableQuery = `
CREATE TABLE IF NOT EXISTS ipos (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES company_details(id) ON DELETE CASCADE,
  issue_price NUMERIC(10, 2) NOT NULL,
  open_date DATE NOT NULL,
  close_date DATE NOT NULL,
  shares_offered INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

export const getAllIposQuery = `
SELECT ipos.*, company_details.name AS company_name
FROM ipos
JOIN company_details ON company_details.id = ipos.company_id
ORDER BY open_date DESC;`;

export const searchIposQuery = `
SELECT ipos.*, company_details.name AS company_name
FROM ipos
JOIN company_details ON company_details.id = ipos.company_id
WHERE company_details.name ILIKE $1 OR CAST(issue_price AS TEXT) ILIKE $1;`;

export const getIpoByIdQuery = `
SELECT ipos.*, company_details.name AS company_name
FROM ipos
JOIN company_details ON company_details.id = ipos.company_id
WHERE ipos.id = $1;`;

export const insertIpoQuery = `
INSERT INTO ipos (company_id, issue_price, open_date, close_date, shares_offered)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;

export const updateIpoByIdQuery = `
UPDATE ipos
SET company_id = $1, issue_price = $2, open_date = $3, close_date = $4, shares_offered = $5
WHERE id = $6
RETURNING *;`;

export const deleteIpoByIdQuery = `
DELETE FROM ipos WHERE id = $1 RETURNING *;`;

// ---------------------- Users Table ----------------------

export const createLoginLogsTableQuery = `
CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(100),
  role VARCHAR(20),
  action VARCHAR(10), -- LOGIN or LOGOUT
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

export const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

export const insertUserQuery = `
INSERT INTO users (name, email, password, role)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, role;`;

export const getUserByEmailQuery = `
SELECT * FROM users WHERE email = $1;`;

export const getAllUsersQuery = `
SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC;`;

// ---------------------- Documents Table ----------------------
export const createDocumentsTableQuery = `
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  ipo_id INTEGER REFERENCES ipos(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

export const insertDocumentQuery = `
INSERT INTO documents (ipo_id, user_id, filename, file_path)
VALUES ($1, $2, $3, $4)
RETURNING *;`;

export const getAllDocumentsQuery = `
SELECT documents.*, ipos.company_id, users.name AS uploaded_by
FROM documents
LEFT JOIN ipos ON documents.ipo_id = ipos.id
LEFT JOIN users ON documents.user_id = users.id
ORDER BY uploaded_at DESC;`;

export const getDocumentByIdQuery = `
SELECT documents.*, users.name AS uploaded_by
FROM documents
LEFT JOIN users ON documents.user_id = users.id
WHERE documents.id = $1;`;

export const deleteDocumentByIdQuery = `
DELETE FROM documents WHERE id = $1 RETURNING *;`;

export const getDocumentsByIPOIdQuery = `
SELECT documents.*, users.name AS uploaded_by
FROM documents
LEFT JOIN users ON documents.user_id = users.id
WHERE documents.ipo_id = $1
ORDER BY uploaded_at DESC;`;

// Get company and IPO stats with detailed IPO info per company
export const getAdminCompanyStatsQuery = `
  SELECT 
    c.id AS company_id,
    c.name AS company_name,
    c.industry,
    c.location,
    c.founded_year,
    c.employee_count,
    COUNT(i.id) AS ipo_count,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'ipo_id', i.id,
        'issue_price', i.issue_price,
        'open_date', i.open_date,
        'close_date', i.close_date,
        'shares_offered', i.shares_offered,
        'created_at', i.created_at
      )
    ) FILTER (WHERE i.id IS NOT NULL) AS ipos
  FROM company_details c
  LEFT JOIN ipos i ON i.company_id = c.id
  GROUP BY c.id
  ORDER BY ipo_count DESC;
`;

// Get full login/logout logs with user metadata
export const getAllLoginLogsQuery = `
  SELECT 
    l.id AS log_id,
    l.user_id,
    l.email,
    l.role,
    l.action,
    l.timestamp,
    u.name AS user_name
  FROM login_logs l
  LEFT JOIN users u ON u.id = l.user_id
  ORDER BY l.timestamp DESC;
`;
