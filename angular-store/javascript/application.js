+(function() {
   var app = angular.module('store', ['store-products']);

   app.controller('StoreController', ['$http', function($http) {
      var store          = this;
          store.products = [];

      $http.get('api/products.json').success(function(products) {
         store.products = products;
      });
   }]);

   app.controller('ReviewController', function() {

   });
})();
