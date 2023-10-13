\c esglow;

-- Companies
INSERT INTO companies (name, description) VALUES
('EcoTech Ltd', 'A technology company focusing on sustainable solutions.'),
('GreenPower Corp', 'A leading renewable energy company.'),
('CleanWater Systems', 'Providers of water purification systems for both residential and commercial use.'),
('PureAir Enterprises', 'Innovators in clean air technology solutions.'),
('BioLife Foods', 'Organic and sustainable food products.'),
('EcoBuild Constructions', 'Green building and sustainable construction designs.'),
('SolarTech Energy', 'Leaders in solar panel technology and installation.');

-- Frameworks
INSERT INTO frameworks (name, description) VALUES
('Sustainable Development Goals', 'The 17 SDGs by the United Nations for a more sustainable future.'),
('GRESB', 'An ESG benchmark for real assets globally.'),
('SASB', 'Identifies a subset of ESG issues most relevant to financial performance in each of 77 industries.'),
('Ceres', 'A sustainability nonprofit organisation working with influential investors and companies.');

-- Metrics 
INSERT INTO metrics (name, description) VALUES
('Carbon Emission', 'Measurement of total greenhouse gas emissions produced.'),
('Water Usage', 'Total freshwater withdrawn by the company.'),
('Worker Safety', 'Indicators related to the safety and well-being of employees.'),
('Energy Consumption', 'Total energy consumed by the company in a given period.'),
('Waste Management', 'Metrics related to the generation and disposal of waste.');

-- Indicators for Carbon Emission
INSERT INTO indicators (name, description, source) VALUES
('CO2 Emission', 'Direct carbon dioxide emissions in tons.', 'Annual Sustainability Report'),
('Methane Emission', 'Direct methane emissions in tons.', 'Annual Sustainability Report');

-- Indicators for Water Usage
INSERT INTO indicators (name, description, source) VALUES
('Freshwater Withdrawal', 'Total volume of freshwater withdrawn.', 'Water Usage Report'),
('Water Recycled', 'Volume of water recycled and used again within the organisation.', 'Water Usage Report');

-- Indicators for Worker Safety
INSERT INTO indicators (name, description, source) VALUES
('Workplace Injuries', 'Number of recorded workplace injuries.', 'HR Report'),
('Safety Training Hours', 'Total hours of safety training provided to employees.', 'HR Report');

-- Indicators for Energy Consumption
INSERT INTO indicators (name, description, source) VALUES
('Electricity Consumption', 'Total electricity consumption in kWh.', 'Annual Energy Report'),
('Fossil Fuel Consumption', 'Total fossil fuels consumed measured in tons.', 'Annual Energy Report');

-- Indicators for Waste Management
INSERT INTO indicators (name, description, source) VALUES
('Waste Generated', 'Total waste generated in tons.', 'Waste Management Report'),
('Waste Recycled', 'Total waste that was recycled.', 'Waste Management Report');

-- Indicator data values
INSERT INTO data_values (indicator_id, company_id, year, value) VALUES
(1, 1, 2022, 12000),
(1, 2, 2022, 10000),
(1, 3, 2022, 5000),
(2, 1, 2022, 800),
(2, 2, 2022, 600),
(2, 3, 2022, 300),
(3, 1, 2022, 100000),
(3, 2, 2022, 90000),
(3, 3, 2022, 80000),
(4, 1, 2022, 25000),
(4, 2, 2022, 20000),
(4, 3, 2022, 15000),
(5, 1, 2022, 12),
(5, 2, 2022, 10),
(5, 3, 2022, 9),
(6, 1, 2022, 150),
(6, 2, 2022, 130),
(6, 3, 2022, 100),
(7, 1, 2022, 12000),
(7, 2, 2022, 14000),
(7, 3, 2022, 13000),
(7, 4, 2022, 15000),
(7, 5, 2022, 11000),
(8, 1, 2022, 2000),
(8, 2, 2022, 2500),
(8, 3, 2022, 2100),
(8, 4, 2022, 2400),
(8, 5, 2022, 2200),
(9, 1, 2022, 50),
(9, 2, 2022, 60),
(9, 3, 2022, 55),
(9, 4, 2022, 52),
(9, 5, 2022, 57),
(10, 1, 2022, 25),
(10, 2, 2022, 28),
(10, 3, 2022, 27),
(10, 4, 2022, 26),
(10, 5, 2022, 24);

-- Framework-Metric relationship
INSERT INTO framework_metrics (framework_id, metric_id, predefined_weight) VALUES
(1, 1, 0.5),
(1, 2, 0.3),
(1, 3, 0.2),
(2, 1, 0.6),
(2, 2, 0.2),
(2, 3, 0.2),
(3, 1, 0.7),
(3, 2, 0.1),
(3, 3, 0.2),
(4, 1, 0.4),
(4, 4, 0.3),
(4, 5, 0.3);

-- Metric-Indicator relationship
INSERT INTO metric_indicators (metric_id, indicator_id, predefined_weight) VALUES
(1, 1, 0.6),
(1, 2, 0.4),
(2, 3, 0.7),
(2, 4, 0.3),
(3, 5, 0.5),
(3, 6, 0.5),
(4, 7, 0.4),
(4, 8, 0.6),
(5, 9, 0.5),
(5, 10, 0.5);
