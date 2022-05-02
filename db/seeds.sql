INSERT INTO department (name)
VALUES
  ('Tech'),
  ('Medical'),
  ('Education'),
  ('Science'),
  ('Law'),
  ('Construction');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Frontend developer', '150000', 1),
  ('Biologist ', '170000', 4),
  ('Doctor', '220000', 2),
  ('Art teacher', '100000', 3),
  ('Backend developer', '90000', 1),
  ('Construction worker', '140000', 6),
  ('Nurse', '90000', 2),
  ('Criminal lawyer', '190000', 5),
  ('Fullstack developer', '250000', 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, 8),
  ('Virginia', 'Woolf', 4, 5),
  ('Piers', 'Gaveston', 1, 2),
  ('Charles', 'LeRoi', 2, 1),
  ('Katherine', 'Mansfield', 2, 4),
  ('Dora', 'Carrington', 4, 9),
  ('Edward', 'Bellamy', 3, 14),
  ('Montague', 'Summers', 3, 1),
  ('Octavia', 'Butler', 3, 6),
  ('Unica', 'Zurn', 5, 1),
  ('Vernon', 'Lee',  4, 1),
  ('Arthur', 'Machen',  6, 5),
  ('Frederick', 'Marryat',  2, 1),
  ('Harriet', 'Martineau', 3, 1),
  ('George', 'Meredith',  1, 1),
  ('Margaret', 'Oliphant',  3, 4),
  ('Eliza', 'Parsons',  4, 6),
  ('Susan', 'Hill',  5, 11),
  ('Sydney', 'Owenson',  6, 3);

