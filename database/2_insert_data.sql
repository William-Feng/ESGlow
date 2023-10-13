\c esglow;


-- Companies
INSERT INTO companies (name, description) VALUES 
('GreenTech Innovations', 'Innovative solutions for sustainable urban living.'),
('CareCommunity Health', 'Providing quality healthcare in underserved regions.'),
('FairTrade Enterprises', 'Promoting ethical sourcing and trading practices.'),
('FutureDriven Tech', 'Leveraging technology for a better tomorrow.'),
('UnityGlobal Services', 'Global services with a commitment to diversity and quality.');


-- Frameworks
INSERT INTO frameworks (name, description) VALUES 
('ESG Global Standard', 'A comprehensive measure for Environmental, Social, and Governance standards.'),
('EarthCare Compliance', 'A protocol emphasising on environmental integrity and sustainable practices.'),
('Digital Future Pathways', 'Emphasis on technology adoption, innovation, and digital sustainability.'),
('SASB', 'Identifies a subset of ESG issues most relevant to financial performance in various industries.'),
('GRESB', 'An ESG benchmark for real assets globally.');

-- Metrics
INSERT INTO metrics (name, description) VALUES 
('Emission Standards', 'Compliance with global emission norms and practices.'),
('Community Engagement', 'Commitment to local communities and upholding societal values.'),
('Corporate Transparency', 'Openness in financial and operational reporting.'),
('Supply Chain Integrity', 'Assessing responsible sourcing and ethical supply chain management.'),
('Employee Well-being', 'Measuring initiatives and results for employee health and satisfaction.'),
('Product Responsibility', 'Assessing quality, safety, and impact of products on consumers and environment.'),
('Stakeholder Relations', 'Evaluation of relations and dealings with various stakeholders.'),
('Digital Integration', 'Assessment of the company’s adoption of digital technology and innovation.'),
('Diversity & Inclusion', 'Measuring the commitment to a diverse workforce and inclusive culture.'),
('Sustainable Operations', 'Evaluating practices ensuring business sustainability and resilience.');


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
('Media Relations Score', 'Score based on media interactions and relations.', 'MediaMaven Reports'),
-- Digital Integration
('Tech Infrastructure Score', 'Assessment of the technical infrastructure in place.', 'TechReview Insights'),
('Innovation Initiatives', 'Number of innovative projects launched in the year.', 'InnoTracker'),
-- Diversity & Inclusion
('Workforce Diversity Score', 'Score representing workforce diversity.', 'HRData Metrics'),
('Inclusive Culture Rating', 'Rating based on inclusivity of the company culture.', 'EmployeeSurveys'),
('Training & Development Programs', 'Number of training and development initiatives focused on diversity.', 'LearnUp Analytics'),
-- Sustainable Operations
('Carbon Neutral Initiatives', 'Score representing initiatives taken towards carbon neutrality.', 'EcoBalance Reports'),
('Waste Reduction Score', 'Assessment score for waste management and reduction.', 'EcoGuard Insights'),
('Sustainable Procurement Score', 'Score for procurement practices ensuring sustainability.', 'SupplyChain Data'),
('Energy Efficiency Rating', 'Rating based on energy conservation and efficiency.', 'EnergyWatch Metrics');


-- Indicator data Values for each company
INSERT INTO data_values (indicator_id, company_id, year, rating) VALUES 
-- Emission Standards
(1, 1, 2023, 92),
(1, 2, 2023, 88),
(1, 3, 2023, 89),
(1, 4, 2023, 72),
(1, 5, 2023, 86),
(2, 1, 2023, 76),
(2, 2, 2023, 68),
(2, 3, 2023, 72),
(2, 4, 2023, 80),
(2, 5, 2023, 65),
(3, 1, 2023, 90),
(3, 2, 2023, 86),
(3, 3, 2023, 87),
(3, 4, 2023, 95),
(3, 5, 2023, 97),
-- Community Engagement
(4, 1, 2023, 84),
(4, 2, 2023, 80),
(4, 3, 2023, 79),
(4, 4, 2023, 58),
(4, 5, 2023, 69),
(5, 1, 2023, 82),
(5, 2, 2023, 85),
(5, 3, 2023, 78),
(5, 4, 2023, 78),
(5, 5, 2023, 78),
(6, 1, 2023, 88),
(6, 2, 2023, 86),
(6, 3, 2023, 84),
(6, 4, 2023, 92),
(6, 5, 2023, 75),
-- Corporate Transparency
(7, 1, 2023, 94),
(7, 2, 2023, 92),
(7, 3, 2023, 91),
(7, 4, 2023, 86),
(7, 5, 2023, 90),
(8, 1, 2023, 96),
(8, 2, 2023, 95),
(8, 3, 2023, 94),
(8, 4, 2023, 82),
(8, 5, 2023, 74),
(9, 1, 2023, 93),
(9, 2, 2023, 91),
(9, 3, 2023, 90),
(9, 4, 2023, 98),
(9, 5, 2023, 87),
-- Supply Chain Integrity
(10, 1, 2023, 95),
(10, 2, 2023, 90),
(10, 3, 2023, 92),
(10, 4, 2023, 83),
(10, 5, 2023, 79),
(11, 1, 2023, 85),
(11, 2, 2023, 74),
(11, 3, 2023, 46),
(11, 4, 2023, 68),
(11, 5, 2023, 81),
-- Employee Well-being
(12, 1, 2023, 88),
(12, 2, 2023, 85),
(12, 3, 2023, 87),
(12, 4, 2023, 95),
(12, 5, 2023, 48),
(13, 1, 2023, 33),
(13, 2, 2023, 52),
(13, 3, 2023, 74),
(13, 4, 2023, 67),
(13, 5, 2023, 96),
-- Product Responsibility
(14, 1, 2023, 92),
(14, 2, 2023, 90),
(14, 3, 2023, 89),
(14, 4, 2023, 52),
(14, 5, 2023, 68),
(15, 1, 2023, 71),
(15, 2, 2023, 70),
(15, 3, 2023, 62),
(15, 4, 2023, 59),
(15, 5, 2023, 82),
(16, 1, 2023, 70),
(16, 2, 2023, 65),
(16, 3, 2023, 68),
(16, 4, 2023, 37),
(16, 5, 2023, 62),
(17, 1, 2023, 78),
(17, 2, 2023, 62),
(17, 3, 2023, 81),
(17, 4, 2023, 56),
(17, 5, 2023, 63),
-- Stakeholder Relations
(18, 1, 2023, 94),
(18, 2, 2023, 92),
(18, 3, 2023, 90),
(18, 4, 2023, 84),
(18, 5, 2023, 72),
(19, 1, 2023, 90),
(19, 2, 2023, 88),
(19, 3, 2023, 89),
(19, 4, 2023, 76),
(19, 5, 2023, 83),
(20, 1, 2023, 98),
(20, 2, 2023, 96),
(20, 3, 2023, 97),
(20, 4, 2023, 88),
(20, 5, 2023, 90),
(21, 1, 2023, 92),
(21, 2, 2023, 91),
(21, 3, 2023, 89),
(21, 4, 2023, 78),
(21, 5, 2023, 92),
-- Digital Integration
(22, 1, 2023, 90),
(22, 2, 2023, 85),
(22, 3, 2023, 80),
(22, 4, 2023, 93),
(22, 5, 2023, 86),
(23, 1, 2023, 94),
(23, 2, 2023, 73),
(23, 3, 2023, 42),
(23, 4, 2023, 92),
(23, 5, 2023, 75),
-- Diversity & Inclusion
(24, 1, 2023, 68),
(24, 2, 2023, 86),
(24, 3, 2023, 85),
(24, 4, 2023, 78),
(24, 5, 2023, 91),
(25, 1, 2023, 87),
(25, 2, 2023, 85),
(25, 3, 2023, 84),
(25, 4, 2023, 97),
(25, 5, 2023, 89),
(26, 1, 2023, 30),
(26, 2, 2023, 74),
(26, 3, 2023, 45),
(26, 4, 2023, 83),
(26, 5, 2023, 75),
-- Sustainable Operations
(27, 1, 2023, 75),
(27, 2, 2023, 74),
(27, 3, 2023, 73),
(27, 4, 2023, 59),
(27, 5, 2023, 81),
(28, 1, 2023, 92),
(28, 2, 2023, 90),
(28, 3, 2023, 89),
(28, 4, 2023, 82),
(28, 5, 2023, 87),
(29, 1, 2023, 96),
(29, 2, 2023, 95),
(29, 3, 2023, 93),
(29, 4, 2023, 76),
(29, 5, 2023, 85),
(30, 1, 2023, 88),
(30, 2, 2023, 87),
(30, 3, 2023, 85),
(30, 4, 2023, 80),
(30, 5, 2023, 84);


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
(2, 7, 0.25),
(3, 3, 0.10),
(3, 8, 0.65),
(3, 10, 0.25),
(4, 2, 0.10),
(4, 3, 0.20),
(4, 5, 0.15),
(4, 8, 0.25),
(4, 9, 0.15),
(4, 10, 0.15),
(5, 4, 0.40),
(5, 6, 0.30),
(5, 8, 0.20),
(5, 9, 0.10);


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
(7, 19, 0.35),
(7, 20, 0.15),
(7, 21, 0.15),
(8, 22, 0.50),
(8, 23, 0.50),
(9, 24, 0.30),
(9, 25, 0.30),
(9, 26, 0.40),
(10, 27, 0.35),
(10, 28, 0.25),
(10, 29, 0.25),
(10, 30, 0.15);
