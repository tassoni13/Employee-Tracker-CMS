USE employeeTracker_db;

INSERT INTO department (name)
VALUES ("Sales"), ("Quality Control"), ("Finance"), ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Regional Manager", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Assistant to the Regional Manager", 800001, 1),
    ("Quality Assurance Manager", 70000, 2),
    ("Accountant", 80000, 3),
    ("Human Resources Representative", 60000, 4),
    ("Customer Service Representative", 50000, 4),
    ("Receptionist", 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, NULL),
    ("Jim", "Halpert", 2, 1),
    ("Dwight", "Schrute", 3, 1),
    ("Creed", "Bratton", 4, NULL),
    ("Kevin", "Malone", 5, 1),
    ("Toby", "Flenderson", 6, 1),
    ("Kelly", "Kapoor", 7, 4),
    ("Pam", "Beesly", 8, 1);
