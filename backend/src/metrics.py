from .database import db, DataValue

def get_indicator_values(company_id, selected_years, selected_indicators):
    indicator_values = db.session.query(DataValue).filter(
        DataValue.company_id == company_id,
        DataValue.year.in_(selected_years),
        DataValue.indicator_id.in_(selected_indicators)
    ).all()

    # Format for response
    response = []
    for val in indicator_values:
        response_item = {
            'indicator_id': val.indicator_id,
            'year': val.year,
            'value': val.rating
        }
        response.append(response_item)

    return response, 200

