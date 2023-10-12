-- Note that this SQL file is NOT loaded into the database.
-- This simply provides helper queries to help with analysing the database for development purposes.


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


-- Displaying each company's indicator values
select  c.company_id, c.name as company_name, d.year, i.indicator_id, i.name as indicator_name, d.value
from    companies c
        join data_values d on c.company_id = d.company_id
        join indicators i on d.indicator_id = i.indicator_id
order   by c.company_id;


-- Display each company's frameworks
select  f.framework_id, f.name as framework_name, c.company_id, c.name as company_name
from    frameworks f
        join framework_metrics fm on f.framework_id = fm.framework_id
        join metrics m on fm.metric_id = m.metric_id
        join metric_indicators mi on m.metric_id = mi.metric_id
        join indicators i on mi.indicator_id = i.indicator_id
        join data_values d on i.indicator_id = d.indicator_id
        join companies c on d.company_id = c.company_id
group   by (f.framework_id, f.name, c.company_id, c.name)
order   by c.company_id;


-- Displaying literally everything in the one table (links all the tables together)
select  f.framework_id, f.name as framework_name, m.metric_id, m.name as metric_name, fm.predefined_weight as metric_weight,
        i.indicator_id, i.name as indicator_name, mi.predefined_weight as indicator_weight, c.company_id, c.name as company_name, d.year, d.value
from    frameworks f
        join framework_metrics fm on f.framework_id = fm.framework_id
        join metrics m on fm.metric_id = m.metric_id
        join metric_indicators mi on m.metric_id = mi.metric_id
        join indicators i on mi.indicator_id = i.indicator_id
        join data_values d on i.indicator_id = d.indicator_id
        join companies c on d.company_id = c.company_id;
