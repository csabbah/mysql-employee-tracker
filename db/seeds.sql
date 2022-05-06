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
  ('Virginia', 'Woolf', 7, NULL),
  ('Katherine', 'Mansfield', 2, NULL),
  ('Montague', 'Summers', 10, NULL),
  ('Arthur', 'Machen',  6, NULL),
  ('Susan', 'Hill',  5, NULL),
  ('Ronald', 'Firbank', 7, 1),
  ('Piers', 'Gaveston', 8, 2),
  ('Dora', 'Carrington', 4, 3),
  ('Edward', 'Bellamy', 3, 2),
  ('Octavia', 'Butler', 5, 3),
  ('Unica', 'Zurn', 6, 5),
  ('Vernon', 'Lee',  9, 5),
  ('Frederick', 'Marryat', 11, 4),
  ('Harriet', 'Martineau', 10, 6),
  ('George', 'Meredith',  8, 6),
  ('Margaret', 'Oliphant',  5, 2),
  ('Eliza', 'Parsons',  9, 1),
  ('Sydney', 'Owenson',  10, 2);
