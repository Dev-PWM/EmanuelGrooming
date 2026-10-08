-- Create Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Services Table
CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    price_range ENUM('Small', 'Medium', 'Large', 'Extra Large') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Full and Basic Packages
INSERT INTO Services (service_name, service_description, price, price_range) VALUES 
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 70.00, 'Medium'),
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 100.00, 'Large'),
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 200.00, 'Extra Large'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 60.00, 'Medium'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 90.00, 'Large'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 120.00, 'Extra Large');

-- Create Orders Table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    payment_status ENUM('Paid', 'Unpaid') NOT NULL DEFAULT 'Unpaid',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (service_id)
);

-- Create Pets Table
CREATE TABLE Pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_name VARCHAR(50) NOT NULL,
    pet_type ENUM('Dog', 'Cat') NOT NULL,
    breed VARCHAR(50) NOT NULL,
    age INT NOT NULL CHECK (age >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
);

-- Create Appointments Table
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    pet_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('Scheduled', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Scheduled',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (service_id),
    INDEX (pet_id)
);

-- Optional: Create a table for storing breed options
CREATE TABLE Breeds (
    breed_id INT AUTO_INCREMENT PRIMARY KEY,
    breed_name VARCHAR(50) NOT NULL UNIQUE
);

-- Example Insert for Breeds
INSERT INTO Breeds (breed_name) VALUES
('Bulldog'),
('Poodle'),
('Labrador'),
('Pomeranian');

-- Optional: Modify the Pets table to reference the Breeds table
ALTER TABLE Pets 
ADD COLUMN breed_id INT,
ADD FOREIGN KEY (breed_id) REFERENCES Breeds(breed_id) ON DELETE SET NULL;

-- Create a table for reviews
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE
);
