
CREATE TABLE accessories (
  accessoryID INT AUTO_INCREMENT PRIMARY KEY,
  accessoryName VARCHAR(50) NOT NULL,
  accessoryType ENUM('shirt', 'pants', 'hat', 'shoes', 'dress') NOT NULL,
  userID INT DEFAULT NULL,
  petID INT DEFAULT NULL,
  accessoryPrice INT NOT NULL DEFAULT 0,
  accessoryPNG VARCHAR(255)
);
