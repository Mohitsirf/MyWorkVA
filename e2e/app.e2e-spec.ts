import { Studio.Vaetas.ComPage } from './app.po';

describe('studio.vaetas.com App', () => {
  let page: Studio.Vaetas.ComPage;

  beforeEach(() => {
    page = new Studio.Vaetas.ComPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
