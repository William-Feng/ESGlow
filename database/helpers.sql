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
