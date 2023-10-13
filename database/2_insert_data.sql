\c esglow;


-- Companies
INSERT INTO companies (name, description) VALUES 
('GreenTech Innovations', 'Innovative solutions for sustainable urban living.'),
('CareCommunity Health', 'Providing quality healthcare in underserved regions.'),
('FairTrade Enterprises', 'Promoting ethical sourcing and trading practices.');


-- Frameworks
INSERT INTO frameworks (name, description) VALUES 
('ESG Global Standard', 'A comprehensive measure for Environmental, Social, and Governance standards.'),
('EarthCare Compliance', 'A protocol emphasising on environmental integrity and sustainable practices.');


-- Metrics
INSERT INTO metrics (name, description) VALUES 
('Emission Standards', 'Compliance with global emission norms and practices.'),
('Community Engagement', 'Commitment to local communities and upholding societal values.'),
('Corporate Transparency', 'Openness in financial and operational reporting.'),
('Supply Chain Integrity', 'Assessing responsible sourcing and ethical supply chain management.'),
('Employee Well-being', 'Measuring initiatives and results for employee health and satisfaction.'),
('Product Responsibility', 'Assessing quality, safety, and impact of products on consumers and environment.'),
('Stakeholder Relations', 'Evaluation of relations and dealings with various stakeholders.');


-- Indicators
INSERT INTO indicators (name, description, source) VALUES 
-- Emission Standards
('CO2 Emission Compliance', 'Adherence to CO2 emission standards.', 'PlanetCare Reports'),
('Use of Clean Energy', 'Percentage of energy sourced from clean and renewable methods.', 'EcoMetrics'),
('Hazardous Waste Management', 'Proper disposal and reduction of hazardous waste.', 'AquaStats'),
-- Community Engagement
('Local Community Programs', 'Engagement and programs run in local communities.', 'SocioLink Analytics'),
('Healthcare Initiatives', 'Support for healthcare in local communities.', 'HealthFirst Surveys'),
('Education & Training', 'Initiatives for local education and training programs.', 'EduMetrics'),
-- Corporate Transparency
('Financial Disclosure Accuracy', 'Accuracy in financial disclosures and statements.', 'EthicsWatch'),
('Ethical Business Practices', 'Adherence to ethical business and operational standards.', 'GovernGuard'),
('Stakeholder Communication', 'Regular and clear communication with stakeholders.', 'CorpComm Reports'),
-- Supply Chain Integrity
('Ethical Sourcing', 'Percentage of products sourced ethically.', 'SupplyGuard Reports'),
('Supplier Audits', 'Number of supplier audits conducted.', 'AuditMaster'),
-- Employee Well-being
('Employee Satisfaction', 'Employee satisfaction score out of 100.', 'WorkWell Surveys'),
('Health & Safety Initiatives', 'Number of health and safety initiatives taken.', 'SafeWork Metrics'),
-- Product Responsibility
('Product Quality Score', 'Average product quality score.', 'ProdQual Reviews'),
('Recall Instances', 'Number of product recalls in a year due to quality/safety concerns.', 'ConsumerSafe Alerts'),
('Eco-friendly Products', 'Percentage of products deemed environmentally friendly.', 'EcoLabel Analytics'),
('Consumer Complaints', 'Number of consumer complaints received.', 'CustomerCare Data'),
-- Stakeholder Relations
('Investor Relations Score', 'Score assessing relations with investors.', 'InvestLink Metrics'),
('Community Feedback', 'Score based on community feedback on company.', 'LocalVoices Surveys'),
('Regulatory Compliance', 'Percentage compliance with industry regulations.', 'RegulTrack Insights'),
('Media Relations Score', 'Score based on media interactions and relations.', 'MediaMaven Reports');


-- Indicator data Values for each company
INSERT INTO data_values (indicator_id, company_id, year, rating) VALUES 
-- Emission Standards
(1, 1, 2023, 92),
(1, 2, 2023, 88),
(1, 3, 2023, 89),
(2, 1, 2023, 76),
(2, 2, 2023, 68),
(2, 3, 2023, 72),
(3, 1, 2023, 90),
(3, 2, 2023, 86),
(3, 3, 2023, 87),
-- Community Engagement
(4, 1, 2023, 84),
(4, 2, 2023, 80),
(4, 3, 2023, 79),
(5, 1, 2023, 82),
(5, 2, 2023, 85),
(5, 3, 2023, 78),
(6, 1, 2023, 88),
(6, 2, 2023, 86),
(6, 3, 2023, 84),
-- Corporate Transparency
(7, 1, 2023, 94),
(7, 2, 2023, 92),
(7, 3, 2023, 91),
(8, 1, 2023, 96),
(8, 2, 2023, 95),
(8, 3, 2023, 94),
(9, 1, 2023, 93),
(9, 2, 2023, 91),
(9, 3, 2023, 90),
-- Supply Chain Integrity
(10, 1, 2023, 95),
(10, 2, 2023, 90),
(10, 3, 2023, 92),
(11, 1, 2023, 85),
(11, 2, 2023, 74),
(11, 3, 2023, 46),
-- Employee Well-being
(12, 1, 2023, 88),
(12, 2, 2023, 85),
(12, 3, 2023, 87),
(13, 1, 2023, 33),
(13, 2, 2023, 52),
(13, 3, 2023, 74),
-- Product Responsibility
(14, 1, 2023, 92),
(14, 2, 2023, 90),
(14, 3, 2023, 89),
(15, 1, 2023, 71),
(15, 2, 2023, 70),
(15, 3, 2023, 62),
(16, 1, 2023, 70),
(16, 2, 2023, 65),
(16, 3, 2023, 68),
(17, 1, 2023, 78),
(17, 2, 2023, 62),
(17, 3, 2023, 81),
-- Stakeholder Relations
(18, 1, 2023, 94),
(18, 2, 2023, 92),
(18, 3, 2023, 90),
(19, 1, 2023, 90),
(19, 2, 2023, 88),
(19, 3, 2023, 89),
(20, 1, 2023, 98),
(20, 2, 2023, 96),
(20, 3, 2023, 97),
(21, 1, 2023, 92),
(21, 2, 2023, 91),
(21, 3, 2023, 89);


-- Framework Metrics Relationship
INSERT INTO framework_metrics (framework_id, metric_id, predefined_weight) VALUES 
(1, 1, 0.30),
(1, 3, 0.20),
(1, 4, 0.15),
(1, 5, 0.35),
(2, 1, 0.10),
(2, 2, 0.30),
(2, 4, 0.20),
(2, 6, 0.15),
(2, 7, 0.25);


-- Metric Indicators Relationship
INSERT INTO metric_indicators (metric_id, indicator_id, predefined_weight) VALUES 
(1, 1, 0.40),
(1, 2, 0.30),
(1, 3, 0.30),
(2, 4, 0.30),
(2, 5, 0.35),
(2, 6, 0.35),
(3, 7, 0.40),
(3, 8, 0.20),
(3, 9, 0.40),
(4, 10, 0.45),
(4, 11, 0.55),
(5, 12, 0.65),
(5, 13, 0.35),
(6, 14, 0.25),
(6, 15, 0.25),
(6, 16, 0.25),
(6, 17, 0.25),
(7, 18, 0.35),
(7, 19, 0.25),
(7, 20, 0.25),
(7, 21, 0.15);
