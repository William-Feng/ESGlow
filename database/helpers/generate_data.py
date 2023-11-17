# Note that this Python file is NOT used.
# This simply generates random data that is inserted within the database.

import random

COMPANIES = 10
FRAMEWORKS = 10
METRICS = 10
INDICATORS = 30


def framework_metrics():
    # framework_metrics (framework_id, metric_id, predefined_weight)
    filename = "framework_metrics"
    with open(filename, 'w') as file:
        for framework in range(1, FRAMEWORKS + 1):
            weight = 1
            divisions = []
            while weight > 0:
                val = random.randint(1, 10) * 0.05
                if weight - val >= 0:
                    weight -= val
                    divisions.append(val)
                else:
                    divisions.append(weight)
                    weight = 0

            used = set()
            for val in divisions:
                metric = random.randint(1, METRICS)
                while metric == framework or metric in used:
                    metric = random.randint(1, METRICS)
                used.add(metric)
                file.write(f"({framework}, {metric}, {round(val, 3)}),\n")


def metric_indicators():
    # metric_indicators (metric_id, indicator_id, predefined_weight) VALUES
    filename = "metric_indicators"
    with open(filename, 'w') as file:
        for metric in range(1, METRICS + 1):
            weight = 1
            divisions = []
            while weight > 0:
                val = random.randint(1, 7) * 0.1
                if weight - val >= 0:
                    weight -= val
                    divisions.append(val)
                elif weight - val == 0:
                    weight = 0
                    divisions.append(val)
                else:
                    divisions.append(weight)
                    weight = 0

            used = set()
            for val in divisions:
                indicator = random.randint(1, INDICATORS)
                while indicator in used:
                    indicator = random.randint(1, INDICATORS)
                used.add(indicator)

                file.write(f"({metric}, {indicator}, {round(val, 3)}),\n")


def generate_data_values():
    # data_values (indicator_id, company_id, year, rating)
    big = f"data_values_big"
    with open(big, 'a') as f:
        for year in range(2018, 2024):
            filename = f"data_values_{year}"
            with open(filename, 'w') as FILE:
                for indicator in range(1, INDICATORS + 1):
                    # Ensure indicator is linked to every company
                    for company in range(1, COMPANIES + 1):
                        rating = random.randint(50, 100)
                        FILE.write(
                            f"({indicator}, {company}, {year}, {rating}),\n")
                        f.write(
                            f"({indicator}, {company}, {year}, {rating}),\n")


def companies_frameworks():
    # company_frameworks (company_id, framework_id)
    filename = "companies_frameworks"
    with open(filename, 'w') as FILE:
        for company in range(1, COMPANIES + 1):
            used = set()
            for i in range(random.randint(1, 5)):
                framework = random.randint(1, FRAMEWORKS)
                while framework in used:
                    framework = random.randint(1, FRAMEWORKS)
                used.add(framework)
                FILE.write(f"({company}, {framework}),\n")


# framework_metrics()
# metric_indicators()
# generate_data_values()
# companies_frameworks()
