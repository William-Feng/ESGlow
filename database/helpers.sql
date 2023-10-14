-- Note that this SQL file is NOT loaded into the database.
-- This simply provides helper queries to help with analysing the database for development purposes.


-- Display all the companies in alphabetical order
select  distinct(c.name) as company_name
from    companies c
order   by c.name;


-- Display all the frameworks in alphabetical order
select  distinct(f.name) as framework_name
from    frameworks f
order   by f.name;


-- Linking the company with the frameworks
select  c.company_id, c.name, f.framework_id, f.name
from    companies c
        join company_frameworks cf on c.company_id = cf.company_id
        join frameworks f on cf.framework_id = f.framework_id;


-- Linking the framework with the metrics
select  f.framework_id, f.name as framework_name, m.metric_id, m.name as metric_name, fm.predefined_weight
from    frameworks f
        join framework_metrics fm on f.framework_id = fm.framework_id
        join metrics m on fm.metric_id = m.metric_id;


-- Linking the metrics with the indicators
select  m.metric_id, m.name as metric_name, i.indicator_id, i.name as indicator_name, mi.predefined_weight
from    metrics m
        join metric_indicators mi on m.metric_id = mi.metric_id
        join indicators i on mi.indicator_id = i.indicator_id;


-- Linking the framework, metrics and indicators together
select  f.framework_id, f.name as framework_name, m.metric_id, m.name as metric_name, fm.predefined_weight as metric_weight,
        i.indicator_id, i.name as indicator_name, mi.predefined_weight as indicator_weight
from    frameworks f
        join framework_metrics fm on f.framework_id = fm.framework_id
        join metrics m on fm.metric_id = m.metric_id
        join metric_indicators mi on m.metric_id = mi.metric_id
        join indicators i on mi.indicator_id = i.indicator_id;


-- Displaying each company's indicator rating
select  c.company_id, c.name as company_name, d.year, i.indicator_id, i.name as indicator_name, d.rating
from    companies c
        join data_values d on c.company_id = d.company_id
        join indicators i on d.indicator_id = i.indicator_id
order   by c.company_id;


-- Displaying literally everything in the one table (links all the tables together)
select  f.framework_id, f.name as framework_name, m.metric_id, m.name as metric_name, fm.predefined_weight as metric_weight,
        i.indicator_id, i.name as indicator_name, mi.predefined_weight as indicator_weight, c.company_id, c.name as company_name, d.year, d.rating
from    frameworks f
        join framework_metrics fm on f.framework_id = fm.framework_id
        join metrics m on fm.metric_id = m.metric_id
        join metric_indicators mi on m.metric_id = mi.metric_id
        join indicators i on mi.indicator_id = i.indicator_id
        join data_values d on i.indicator_id = d.indicator_id
        join companies c on d.company_id = c.company_id;
