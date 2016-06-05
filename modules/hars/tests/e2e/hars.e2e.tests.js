'use strict';

describe('Hars E2E Tests:', function () {
  describe('Test Hars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hars');
      expect(element.all(by.repeater('har in hars')).count()).toEqual(0);
    });
  });
});
