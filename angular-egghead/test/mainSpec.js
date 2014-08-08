'use strict';

describe('Testing the First- and SecondController', function() {
   beforeEach(
      module('egghead')
   );

   describe('Reversing ', function() {
      it('should reverse a string', inject(function(reverseFilter) {
         expect(reverseFilter('ABCD')).toEqual('DCBA');
      }));
   });
});
