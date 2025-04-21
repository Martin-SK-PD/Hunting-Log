--CREATE DATABASE Hunting_log;


-- ENUM types, in futere some other structure_types or visit_purposes may be added
CREATE TYPE user_role AS ENUM ('Hunter', 'Admin');
CREATE TYPE structure_type AS ENUM ('Posed', 'Krmelec', 'Chatka');
CREATE TYPE visit_purpose AS ENUM ('Lov', 'Obhliadka', 'Prikrmovanie', 'Oprava', 'Prenocovanie');

-- Users 
CREATE TABLE users ( 
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    street VARCHAR(100),
    house_number VARCHAR(20) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL
);


-- Hunting grounds
CREATE TABLE hunting_grounds (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- User-Hunting Ground
CREATE TABLE user_hunting_ground (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    hunting_ground_id INTEGER NOT NULL REFERENCES hunting_grounds(id),
    role user_role NOT NULL
);

-- Hunting areas
CREATE TABLE hunting_areas (
    id SERIAL PRIMARY KEY,
    hunting_ground_id INTEGER NOT NULL REFERENCES hunting_grounds(id),
    name VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE --(soft delete)
);

-- Structures
CREATE TABLE structures (
    id SERIAL PRIMARY KEY,
    hunting_area_id INTEGER NOT NULL REFERENCES hunting_areas(id),
    name VARCHAR(100) NOT NULL,
    type structure_type NOT NULL,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE --(soft delete)
);

-- Visits 
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    hunter_id INTEGER NOT NULL REFERENCES users(id),
    hunting_area_id INTEGER NOT NULL REFERENCES hunting_areas(id),
    structure_id INTEGER REFERENCES structures(id),
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    purpose visit_purpose NOT NULL,
    notes TEXT, 
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE --(soft delete)
);

-- Hunting records 
CREATE TABLE hunting_records (
    id SERIAL PRIMARY KEY,
    visit_id INTEGER NOT NULL REFERENCES visits(id),
    animal VARCHAR(100) NOT NULL,
    weight NUMERIC(6,2),
    date_time TIMESTAMP NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE --(soft delete)
);

-- Announcements
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    hunting_ground_id INTEGER NOT NULL REFERENCES hunting_grounds(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE  --(soft delete)
);
