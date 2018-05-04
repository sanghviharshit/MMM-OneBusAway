var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-OneBusAway helper started...');
  },

  getBusesInfo: function (stopId) {
    var self = this;
    var url = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/" + stopId + ".json?key=TEST";
    //self.sendSocketNotification('BUSES_INFO', "something");  
    request({ url: url, method: 'GET' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            var arrivalsAndDepartures = result['data']['entry']['arrivalsAndDepartures']
            console.log ("Got data for stop: " + result['data']['entry']['stopId'] )
            console.log ("Got arrivals and departures data, size count:" + arrivalsAndDepartures.length);
            self.sendSocketNotification('BUSES_INFO', arrivalsAndDepartures); 
        }
        else {
            console.log("ERROR while getting the url" + error);
        }
    });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    console.log ("Received notification with stopId:" + payload);
    if (notification === 'GET_BUSES_INFO') {
    this.getBusesInfo(payload);
    }
  }

});