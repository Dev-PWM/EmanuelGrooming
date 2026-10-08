CREATE TABLE Pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_name VARCHAR(50) NOT NULL,
    pet_type ENUM('Dog', 'Cat') NOT NULL,
    breed VARCHAR(50) NOT NULL,
    age INT NOT NULL CHECK (age >= 0),  -- Ensure age cannot be negative
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
);
