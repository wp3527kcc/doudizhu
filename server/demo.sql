 CREATE TABLE `user` (
  `islogin` tinyint(1) DEFAULT NULL,
  `score` int NOT NULL,
  `password` varchar(100) NOT NULL,
  `nick` varchar(100) DEFAULT NULL,
  `Id` int NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32