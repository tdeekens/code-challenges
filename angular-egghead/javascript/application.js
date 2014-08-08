+(function() {
   var app = angular.module("egghead", []);

   app.factory('Data', function() {
      return {
         msg: '..data from a service'
      };
   });

   app.filter('reverse', function() {
      return function(text) {
         return text.split('').reverse().join('');
      };
   });

   app.controller('FirstController', function($scope, Data) {
      $scope.data = Data;
   });

   app.controller('SecondController', function($scope, Data) {
      $scope.data = Data;

      $scope.data.reversedMsg = function(msg) {
         return msg.split('').reverse().join('');
      }
   });
})();
