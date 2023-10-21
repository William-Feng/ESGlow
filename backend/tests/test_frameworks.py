from src.frameworks import all_companies, all_frameworks, get_framework_info_from_company, get_indicator_values, get_company_description


def test_all_companies(client_with_frameworks):
    result = all_companies()[0]

    assert result["message"] == 'All companies retrieved!'
    returned_companies = result["companies"]
    assert len(returned_companies) == 3
    company_a = {
        'company_id': 1,
        'name': 'CompanyA'
    }
    company_b = {
        'company_id': 2,
        'name': 'CompanyB'
    }
    company_c = {
        'company_id': 3,
        'name': 'CompanyC'
    }
    assert company_a in returned_companies
    assert company_b in returned_companies
    assert company_c in returned_companies


def test_all_frameworks(client_with_frameworks):
    result = all_frameworks()[0]

    assert result["message"] == 'All frameworks retrieved!'
    returned_frameworks = result["frameworks"]
    assert len(returned_frameworks) == 3
    assert 'Framework1' in returned_frameworks
    assert 'Framework2' in returned_frameworks
    assert 'Framework3' in returned_frameworks


def test_frameworks_by_company(client_with_frameworks):
    # Company 1
    result = get_framework_info_from_company(1)[0]

    assert result["message"] == "Framework, metric & indicator information for company retrieved!"
    returned_frameworks = result["frameworks"]

    indicator_1_metric_1_data = {
        'indicator_id': 1,
        'indicator_name': 'Indicator1',
        'description': 'Description for Indicator1',
        'predefined_weight': 0.4
    }
    indicator_2_metric_1_data = {
        'indicator_id': 2,
        'indicator_name': 'Indicator2',
        'description': 'Description for Indicator2',
        'predefined_weight': 0.3
    }
    indicator_3_metric_1_data = {
        'indicator_id': 3,
        'indicator_name': 'Indicator3',
        'description': 'Description for Indicator3',
        'predefined_weight': 0.3
    }

    metric_1_framework_1_data = {
        'metric_id': 1,
        'metric_name': 'Metric1',
        'description': 'Description for Metric1',
        'predefined_weight': 0.3,
        'indicators': [
            indicator_1_metric_1_data,
            indicator_2_metric_1_data,
            indicator_3_metric_1_data
        ]
    }

    indicator_5_metric_3_data = {
        'indicator_id': 5,
        'indicator_name': 'Indicator5',
        'description': 'Description for Indicator5',
        'predefined_weight': 0.4
    }
    
    indicator_6_metric_3_data = {
        'indicator_id': 6,
        'indicator_name': 'Indicator6',
        'description': 'Description for Indicator6',
        'predefined_weight': 0.2
    }

    indicator_7_metric_3_data = {
        'indicator_id': 7,
        'indicator_name': 'Indicator7',
        'description': 'Description for Indicator7',
        'predefined_weight': 0.4
    }

    metric_3_framework_1_data = {
        'metric_id': 3,
        'metric_name': 'Metric3',
        'description': 'Description for Metric3',
        'predefined_weight': 0.2,
        'indicators': [
            indicator_5_metric_3_data,
            indicator_6_metric_3_data,
            indicator_7_metric_3_data,
        ]
    }

    indicator_7_metric_4_data = {
        'indicator_id': 7,
        'indicator_name': 'Indicator7',
        'description': 'Description for Indicator7',
        'predefined_weight': 0.55
    }

    indicator_8_metric_4_data = {
        'indicator_id': 8,
        'indicator_name': 'Indicator8',
        'description': 'Description for Indicator8',
        'predefined_weight': 0.45
    }

    metric_4_framework_1_data = {
        'metric_id': 4,
        'metric_name': 'Metric4',
        'description': 'Description for Metric4',
        'predefined_weight': 0.5,
        'indicators': [
            indicator_7_metric_4_data,
            indicator_8_metric_4_data
        ]
    }

    framework_1_data = {
        'framework_id': 1,
        'framework_name': 'Framework1',
        'description': 'Description for Framework1',
        'metrics': [
            metric_1_framework_1_data,
            metric_3_framework_1_data,
            metric_4_framework_1_data
        ],
    }

    assert len(returned_frameworks) == 2
    assert framework_1_data in returned_frameworks

    # Invalid company
    result = get_framework_info_from_company(5)[0]
    assert result["message"] == "Company with ID 5 not found."


def test_indicator_values(client_with_frameworks):
    result = get_indicator_values(1, [1, 2], [2022, 2023])[0]
    assert result["message"] == "Values successfully retrieved!"
    returned_values = result["values"]

    expected_values = [
        {
            'indicator_id': 1,
            'indicator_name': 'Indicator1',
            'year': 2022,
            'value': 87
        },
        {
            'indicator_id': 2,
            'indicator_name': 'Indicator2',
            'year': 2022,
            'value': 85
        },
        {
            'indicator_id': 1,
            'indicator_name': 'Indicator1',
            'year': 2023,
            'value': 92
        },
        {
            'indicator_id': 2,
            'indicator_name': 'Indicator2',
            'year': 2023,
            'value': 76
        }
    ]

    assert len(expected_values) == len(returned_values)
    for expected in expected_values:
        assert expected in returned_values


def test_company_description(client_with_frameworks):
    result = get_company_description(1)[0]

    assert result["message"] == "Description successfully retrieved!" 
    assert result["description"] == "Description for CompanyA" 

