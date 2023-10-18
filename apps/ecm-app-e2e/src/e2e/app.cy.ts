import { getPlatformTitle } from '../support/app.po';

describe('helloworld', () => {
  beforeEach(() => cy.visit('/'));

  it('should display app title', () => {
    // Function helper example, see `../support/app.po.ts` file
    getPlatformTitle().contains('Hello World');
  });
});
