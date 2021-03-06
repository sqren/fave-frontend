/* global google */

app.directive('googleMapsDirections', ['helpers', function (helpers) {
  'use strict';

  return {
    restrict: 'C',
    scope: {
      from: '=',
      to: '=',
      distance: '='
    },
    link: function ($scope, $element, $attrs) {

      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();
      var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        draggable: false,
        disableDefaultUI: true,
        streetViewControl: false,
        keyboardShortcuts: false,
        disableDoubleClickZoom: false,
        styles: [{
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        }]
      };
      var map = new google.maps.Map($element[0], options);
      directionsDisplay.setMap(map);

      $scope.$watch('to', function(value, oldValue){
        if(value === undefined) return;

        var from = new google.maps.LatLng($scope.from.latitude, $scope.from.longitude);
        var to = new google.maps.LatLng($scope.to.latitude, $scope.to.longitude);
        calcRoute(from, to);
      });

      function calcRoute(start, end) {
        var request = {
            origin: start,
            destination:end,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.METRIC // meters
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

            $scope.$apply(function(){
              $scope.distance = response.routes[0].legs[0].distance.text;
            });
          }
        });
      }

    }
  };
}]);
