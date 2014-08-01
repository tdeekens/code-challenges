+(function() {
   var app = angular.module('store-products', []);

   app.directive('productTitle', function() {
      return {
         restrict: 'E',
         templateUrl: 'javascript/ng-directives/product-title.html'
      };
   });

   app.directive('productImage', function() {
      return {
         restrict: 'E',
         templateUrl: 'javascript/ng-directives/product-image.html'
      };
   });

   app.directive('productPanels', function() {
      return {
         restrict: 'E',
         templateUrl: 'javascript/ng-directives/product-panels.html',
         controller: function() {
            this.tab = 1;

            this.selectTab = function(setTab) {
               this.tab = setTab;
            };

            this.isSelected = function(forTab) {
               return this.tab === forTab;
            }
         },
         controllerAs: 'panel'
      };
   });
})();
