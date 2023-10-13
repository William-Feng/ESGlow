\c esglow;

-- Companies
INSERT INTO companies (name, description) VALUES 
('GreenTech Innovations', 'Innovative solutions for sustainable urban living.'),
('CareCommunity Health', 'Providing quality healthcare in underserved regions.'),
('FairTrade Enterprises', 'Promoting ethical sourcing and trading practices.');

-- Frameworks
INSERT INTO frameworks (name, description) VALUES 
('ESG Global Standard', 'A comprehensive measure for Environmental, Social, and Governance standards.'),
('EarthCare Compliance', 'A protocol emphasizing on environmental integrity and sustainable practices.');

-- Metrics
INSERT INTO metrics (name, description) VALUES 
('Emission Standards', 'Compliance with global emission norms and practices.'),
('Community Engagement', 'Commitment to local communities and upholding societal values.'),
('Corporate Transparency', 'Openness in financial and operational reporting.');

-- Indicators
INSERT INTO indicators (name, description, source) VALUES 
('CO2 Emission Compliance', 'Adherence to CO2 emission standards.', 'PlanetCare Reports'),
('Use of Clean Energy', 'Percentage of energy sourced from clean and renewable methods.', 'EcoMetrics'),
('Hazardous Waste Management', 'Proper disposal and reduction of hazardous waste.', 'AquaStats'),
('Local Community Programs', 'Engagement and programs run in local communities.', 'SocioLink Analytics'),
('Healthcare Initiatives', 'Support for healthcare in local communities.', 'HealthFirst Surveys'),
('Education & Training', 'Initiatives for local education and training programs.', 'EduMetrics'),
('Financial Disclosure Accuracy', 'Accuracy in financial disclosures and statements.', 'EthicsWatch'),
('Ethical Business Practices', 'Adherence to ethical business and operational standards.', 'GovernGuard'),
('Stakeholder Communication', 'Regular and clear communication with stakeholders.', 'CorpComm Reports');

-- Indicator data Values for each company
INSERT INTO data_values (indicator_id, company_id, year, value) VALUES 
-- Emission Standards
(1, 1, 2023, 0.98),
(1, 2, 2023, 0.93),
(1, 3, 2023, 0.96),
(2, 1, 2023, 0.75),
(2, 2, 2023, 0.50),
(2, 3, 2023, 0.60),
(3, 1, 2023, 0.90),
(3, 2, 2023, 0.85),
(3, 3, 2023, 0.88),
-- Community Engagement
(4, 1, 2023, 10),
(4, 2, 2023, 8),
(4, 3, 2023, 7),
(5, 1, 2023, 2),
(5, 2, 2023, 3),
(5, 3, 2023, 1),
(6, 1, 2023, 5),
(6, 2, 2023, 4),
(6, 3, 2023, 3),
-- Corporate Transparency
(7, 1, 2023, 0.98),
(7, 2, 2023, 0.95),
(7, 3, 2023, 0.96),
(8, 1, 2023, 0.99),
(8, 2, 2023, 0.97),
(8, 3, 2023, 0.98),
(9, 1, 2023, 12),
(9, 2, 2023, 10),
(9, 3, 2023, 11);

-- Framework Metrics Relationship
INSERT INTO framework_metrics (framework_id, metric_id, predefined_weight) VALUES 
(1, 1, 0.4),
(1, 2, 0.3),
(1, 3, 0.3),
(2, 1, 0.5),
(2, 2, 0.3),
(2, 3, 0.2);

-- Metric Indicators Relationship
INSERT INTO metric_indicators (metric_id, indicator_id, predefined_weight) VALUES 
(1, 1, 0.4),
(1, 2, 0.3),
(1, 3, 0.3),
(2, 4, 0.4),
(2, 5, 0.3),
(2, 6, 0.3),
(3, 7, 0.4),
(3, 8, 0.3),
(3, 9, 0.3);