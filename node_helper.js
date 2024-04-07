var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-OneBusAway helper started...');
  },

  getBusesInfo: function (stopIds) {
    var self = this;
    //TODO update api key with a nonTEST one.
    for (let route of stopIds) {
      let stopId = route['stopId']
      var url = `http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/${stopId}.json?key=TEST`;
      request({ url: url, method: 'GET' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var result = JSON.parse(body);
          var arrivalsAndDepartures = result['data']['entry']['arrivalsAndDepartures']
          console.log(`Got arrivals and departures data for ${stopId}, size count:` + arrivalsAndDepartures.length);
          self.sendSocketNotification('BUSES_INFO', {stopId: stopId , data: arrivalsAndDepartures});
        } else {
          console.log(`ERROR while getting the url ${url} ` + error);
        }
      });
    }
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GET_BUSES_INFO') {
      this.getBusesInfo(payload);
    }
  }
});
