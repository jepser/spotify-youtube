const tracking = {
  event: (eventObj) => {
    const event = Object.assign({}, {
      eventCategory: 'spotify-youtube',
      eventAction: undefined,
      eventLabel: undefined,
      eventValue: undefined
    }, eventObj)
    const {
      eventCategory,
      eventAction,
      eventLabel,
      eventValue
    } = event

    ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue)
  }
}

export default tracking
