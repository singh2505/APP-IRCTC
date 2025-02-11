CREATE DATABASE irctc;
USE irctc;

-- Table for storing user information
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
);

-- Table for managing train details
CREATE TABLE trains (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL
);

-- Table for handling train bookings
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  train_id INT NOT NULL,
  seat_count INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);
