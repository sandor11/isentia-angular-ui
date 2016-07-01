describe('app: config', function() {
  beforeEach(module('webApp'));

  describe('factory: config', function() {
    var config = null;
    beforeEach(inject(function(appConfig) {
      config = appConfig;
    }));

    it('needs to have a name', function() {
      expect(config.name).toEqual(jasmine.any(String));
      expect(config.author).toEqual('Sandor Agafonoff');
    });
  });
});