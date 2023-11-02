
INSERT INTO industries (name) VALUES 
('Industry 1'),
('Industry 2');

-- Inserting into the `companies` table
INSERT INTO companies (industry_id, name, description) VALUES 
(1, 'CompanyA', 'Description for CompanyA'),
(1, 'CompanyB', 'Description for CompanyB'),
(2, 'CompanyC', 'Description for CompanyC');

-- Inserting into the `frameworks` table
INSERT INTO frameworks (name, description) VALUES 
('Framework1', 'Description for Framework1'),
('Framework2', 'Description for Framework2'),
('Framework3', 'Description for Framework3');

-- Inserting into the `metrics` table
INSERT INTO metrics (name, description) VALUES 
('Metric1', 'Description for Metric1'),
('Metric2', 'Description for Metric2'),
('Metric3', 'Description for Metric3'),
('Metric4', 'Description for Metric4');

-- Inserting into the `indicators` table
INSERT INTO indicators (name, description, source) VALUES 
('Indicator1', 'Description for Indicator1', 'SourceA'),
('Indicator2', 'Description for Indicator2', 'SourceB'),
('Indicator3', 'Description for Indicator3', 'SourceB'),
('Indicator4', 'Description for Indicator4', 'SourceB'),
('Indicator5', 'Description for Indicator5', 'SourceB'),
('Indicator6', 'Description for Indicator6', 'SourceB'),
('Indicator7', 'Description for Indicator7', 'SourceB'),
('Indicator8', 'Description for Indicator8', 'SourceB');

-- Inserting into the `data_values` table
INSERT INTO data_values (indicator_id, company_id, year, rating) VALUES 
(1, 1, 2023, 92),
(1, 2, 2023, 88),
(1, 3, 2023, 89),
(2, 1, 2023, 76),
(2, 2, 2023, 68),
(2, 3, 2023, 72),
(3, 1, 2023, 90),
(3, 2, 2023, 86),
(3, 3, 2023, 87),
(4, 1, 2023, 84),
(4, 2, 2023, 80),
(4, 3, 2023, 79),
(5, 1, 2023, 82),
(5, 2, 2023, 85),
(5, 3, 2023, 78),
(6, 1, 2023, 88),
(6, 2, 2023, 86),
(6, 3, 2023, 84),
(7, 1, 2023, 94),
(7, 2, 2023, 92),
(7, 3, 2023, 91),
(8, 1, 2023, 96),
(8, 2, 2023, 95),
(8, 3, 2023, 94),

(1, 1, 2022, 87),
(1, 2, 2022, 84),
(1, 3, 2022, 88),
(2, 1, 2022, 85),
(2, 2, 2022, 67),
(2, 3, 2022, 78),
(3, 1, 2022, 87),
(3, 2, 2022, 79),
(3, 3, 2022, 81),
(4, 1, 2022, 76),
(4, 2, 2022, 68),
(4, 3, 2022, 67),
(5, 1, 2022, 65),
(5, 2, 2022, 99),
(5, 3, 2022, 89),
(6, 1, 2022, 79),
(6, 2, 2022, 82),
(6, 3, 2022, 86),
(7, 1, 2022, 82),
(7, 2, 2022, 71),
(7, 3, 2022, 90),
(8, 1, 2022, 92),
(8, 2, 2022, 89),
(8, 3, 2022, 75);

-- Framework Metrics Relationship
INSERT INTO framework_metrics (framework_id, metric_id, predefined_weight) VALUES 
(1, 1, 0.30),
(1, 3, 0.20),
(1, 4, 0.50),
(2, 1, 0.50),
(2, 2, 0.30),
(2, 4, 0.20),
(3, 2, 0.10),
(3, 3, 0.50),
(3, 4, 0.40);

-- Company Frameworks Relationship
INSERT INTO company_frameworks (company_id, framework_id) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(3, 3);

-- Metric Indicators Relationship
INSERT INTO metric_indicators (metric_id, indicator_id, predefined_weight) VALUES 
(1, 1, 0.40),
(1, 2, 0.30),
(1, 3, 0.30),
(2, 4, 0.30),
(2, 5, 0.35),
(2, 6, 0.35),
(3, 5, 0.40),
(3, 6, 0.20),
(3, 7, 0.40),
(4, 7, 0.55),
(4, 8, 0.45);
