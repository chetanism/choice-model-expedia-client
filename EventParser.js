const BaseEventParser = require('choice-model-client-utils/EventParser');

class EventParser extends BaseEventParser {
  parseEvent(eventData) {
    const ctx_destination = `d_${eventData.srch_destination_id}`;
    const ctx_destination_type = `d_t_${eventData.srch_destination_type_id}`;
    const ctx_package = `p_${eventData.is_package}`;
    const ctx_hotel_country = `h_cy_${eventData.hotel_country}`;
    const ctx_channel = `ch_${eventData.channel}`;
    const ctx_children = `chi_${eventData.srch_children_cnt}`;

    let ctx_month = 'month';

    if (eventData.srch_ci !== '') {
      const checkin_date = new Date(eventData.srch_ci);
      ctx_month = `m_${checkin_date.getMonth()}`;
    }

    const weight = eventData.cnt * (eventData.is_booking + 1) / 2;

    return {
      user_id: eventData.user_id,
      context_ids: [
        ctx_destination,
        ctx_destination_type,
        ctx_package,
        ctx_hotel_country,
        ctx_channel,
        ctx_children,
        ctx_month
      ],
      choice_ids: [Number(eventData.hotel_cluster).toString()],
      weight: weight
    };
  }
}

module.exports = EventParser;