'use strict';

describe('Specs E2E Tests:', function () {
  describe('Test Specs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/specs');
      expect(element.all(by.repeater('spec in specs')).count()).toEqual(0);
    });
  });
});
