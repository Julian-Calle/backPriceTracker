DROP DATABASE priceTracker;
CREATE DATABASE IF NOT EXISTS priceTracker CHARSET "utf8mb4" COLLATE "utf8mb4_spanish_ci";

USE priceTracker; 


CREATE TABLE IF NOT EXISTS `items` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `photo` varchar(200) NOT NULL DEFAULT 'default.jpg',
  `url` varchar(100) NOT NULL UNIQUE ,
   `email` varchar(100) NOT NULL ,
  PRIMARY KEY (`id`)
) ;
CREATE TABLE IF NOT EXISTS`status` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `price` DOUBLE UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `itemId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status_items_fk1` (`itemId`),
  CONSTRAINT `status_items_fk1` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`)
) ;