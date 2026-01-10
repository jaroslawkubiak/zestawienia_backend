INSERT INTO `bookmark` (`id`, `name`, `default`) VALUES
(1, 'PODSUMOWANIE', 1),
(2, 'OŚWIETLENIE, OSPRZĘT ELEKTRYCZNY', 1),
(3, 'ŁAZIENKA', 1),
(4, 'KUCHNIA', 1),
(5, 'PŁYTKI CERAMICZNE', 1),
(6, 'MEBLE NA WYMIAR, MEBLE GOTOWE', 1),
(7, 'ŚCIANY, SUFITY, PODŁOGI', 1);

INSERT INTO `setting` (`id`, `type`, `value`) VALUES
(1, 'senderEmail', 'kontakt@gmail.pl');

INSERT INTO `user` (`id`, `username`, `password`, `role`, `name`) VALUES
(1, 'admin', '$2b$10$JMOdVCMIMHf0cYzaxpN6MuuLrF1kbh3YhoF7dopbAiOpDOQ0yKuk.', 'admin', 'Jarek');