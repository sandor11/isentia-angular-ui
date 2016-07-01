describe('App Controller', function() {
  beforeEach(module('webApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.test', function() {
    it('contains the name of the web application', function() {
      var $scope = {};
      var controller = $controller('appController', { $scope: $scope });
      expect($scope.test).toEqual('hello');
    });
  });
});