// sqlQuery.js

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

// --- IPO Queries ---

export const createIpoTableQuery = `
  CREATE TABLE IF NOT EXISTS ipo_details (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    price_band VARCHAR(50) NOT NULL,
    lot_size INT NOT NULL,
    open_date DATE NOT NULL,
    close_date DATE NOT NULL,
    issue_size VARCHAR(50) NOT NULL,
    ipo_type VARCHAR(50),
    FOREIGN KEY (company_id) REFERENCES company_details(id) ON DELETE CASCADE
  );
`;

export const getAllIpoQuery = `
  SELECT i.*, c.name AS company_name
  FROM ipo_details i
  JOIN company_details c ON i.company_id = c.id
  ORDER BY i.id DESC;
`;

export const insertIpoQuery = `
  INSERT INTO ipo_details (company_id, price_band, lot_size, open_date, close_date, issue_size, ipo_type)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

export const updateIpoByIdQuery = `
  UPDATE ipo_details
  SET company_id = $1,
      price_band = $2,
      lot_size = $3,
      open_date = $4,
      close_date = $5,
      issue_size = $6,
      ipo_type = $7
  WHERE id = $8
  RETURNING *;
`;

export const deleteIpoByIdQuery = `
  DELETE FROM ipo_details
  WHERE id = $1
  RETURNING *;
`;

export const getIpoByIdQuery = `
  SELECT i.*, c.name AS company_name
  FROM ipo_details i
  JOIN company_details c ON i.company_id = c.id
  WHERE i.id = $1;
`;
