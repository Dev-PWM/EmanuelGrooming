CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),  -- Changed to DECIMAL for better precision
    price_range ENUM('Small', 'Medium', 'Large', 'Extra Large') NOT NULL, -- Price range based on pet size
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Full Package
INSERT INTO Services (service_name, service_description, price, price_range)
VALUES 
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 50.00, 'Small'),
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 70.00, 'Medium'),
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 100.00, 'Large'),
('Full Package', 'Includes Bath, Shampoo, Haircut, Nail Clipping, Ear Cleaning, Teeth Brushing, and Anal Gland Expression (for pets)', 200.00, 'Extra Large'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 40.00, 'Small'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 60.00, 'Medium'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 90.00, 'Large'),
('Basic Package', 'Includes Bath, Shampoo, and Basic Haircut', 120.00, 'Extra Large');
