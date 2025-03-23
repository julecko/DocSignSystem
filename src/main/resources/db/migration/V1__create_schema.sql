CREATE TABLE user (
  birth_number VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255)
);

CREATE TABLE document (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      content LONGBLOB,
      birth_number VARCHAR(255) NOT NULL,
      FOREIGN KEY (birth_number) REFERENCES user(birth_number)
);