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
  ('Biologist', '170000', 4),
  ('Chemical engineer', '215000', 4),
  ('Family Doctor', '220000', 2),
  ('Art teacher', '100000', 3),
  ('Backend developer', '90000', 1),
  ('Construction worker', '140000', 6),
  ('Nurse', '90000', 2),
  ('Family lawyer', '60000', 5),
  ('Criminal lawyer', '190000', 5),
  ('Fullstack developer', '250000', 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Charles', 'LeRoi', 2, NULL),
  ('Virginia', 'Woolf', 4, NULL),
  ('Katherine', 'Mansfield', 2, NULL),
  ('Montague', 'Summers', 3, NULL),
  ('Arthur', 'Machen',  6, NULL),
  ('Susan', 'Hill',  5, NULL),
  ('Ronald', 'Firbank', 1, 1),
  ('Piers', 'Gaveston', 1, 2),
  ('Dora', 'Carrington', 4, 3),
  ('Edward', 'Bellamy', 3, 2),
  ('Octavia', 'Butler', 3, 3),
  ('Unica', 'Zurn', 5, 5),
  ('Vernon', 'Lee',  4, 5),
  ('Frederick', 'Marryat',  2, 4),
  ('Harriet', 'Martineau', 3, 6),
  ('George', 'Meredith',  1, 6),
  ('Margaret', 'Oliphant',  3, 2),
  ('Eliza', 'Parsons',  4, 1),
  ('Sydney', 'Owenson',  6, 2);
