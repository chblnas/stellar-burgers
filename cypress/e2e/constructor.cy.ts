import { selectors } from 'cypress/support/selectors';

describe('burgerConstructor', () => {
  let buns: any;
  let mains: any;
  let sauces: any;

  beforeEach(() => {
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    localStorage.setItem('refreshToken', 'fakeRefresh');
    cy.setCookie('accessToken', 'Bearer fakeAccess');

    cy.visit('/');

    cy.wait(['@getUser', '@getIngredients']);
    cy.fixture('ingredients.json').then((fx) => {
      buns = fx.data.filter((i: any) => i.type === 'bun');
      mains = fx.data.filter((i: any) => i.type === 'main');
      sauces = fx.data.filter((i: any) => i.type === 'sauce');
    });
  });

  afterEach(() => {
    localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('добавление разных ингредиентов в конструктор', () => {
    cy.contains(buns[0].name)
      .parents(selectors.ingredient)
      .find('button')
      .click();
    cy.contains(mains[0].name)
      .parents(selectors.ingredient)
      .find('button')
      .click();
    cy.contains(sauces[0].name)
      .parents(selectors.ingredient)
      .find('button')
      .click();

    cy.get(selectors.constructorElement)
      .should('contain.text', buns[0].name)
      .and('contain.text', mains[0].name)
      .and('contain.text', sauces[0].name);
  });

  describe('проверка работы модальных окон', () => {
    it('открытие модального окна с карточкой ингредиента', function () {
      const ingredient = mains[0];

      cy.contains(ingredient.name).parents(selectors.ingredient).click();
      cy.get(selectors.modal).should('exist').and('be.visible');

      cy.get(selectors.modal)
        .find(selectors.ingredientName)
        .should('have.text', ingredient.name);

      cy.get(selectors.modal)
        .contains('Калории')
        .next()
        .should('have.text', ingredient.calories.toString());
      cy.get(selectors.modal)
        .contains('Белки')
        .next()
        .should('have.text', ingredient.proteins.toString());
      cy.get(selectors.modal)
        .contains('Жиры')
        .next()
        .should('have.text', ingredient.fat.toString());
      cy.get(selectors.modal)
        .contains('Углеводы')
        .next()
        .should('have.text', ingredient.carbohydrates.toString());
    });

    it('закрытие по кнопке', () => {
      cy.get(selectors.ingredient).first().click();
      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.modalClose).click();
      cy.get(selectors.modal).should('not.exist');
    });

    it('закрытие по клику на оверлей', () => {
      cy.get(selectors.ingredient).first().click();
      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.modalOverlay).click({ force: true });
      cy.get(selectors.modal).should('not.exist');
    });
  });

  it('оформление заказа', () => {
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.contains(buns[0].name)
      .parents(selectors.ingredient)
      .find('button')
      .click();
    cy.contains(mains[0].name)
      .parents(selectors.ingredient)
      .find('button')
      .click();
    cy.contains(sauces[0].name)
      .parents(selectors.ingredient)
      .find('button')
      .click();

    cy.contains('Оформить заказ').click({ force: true });

    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    cy.fixture('order.json').then((fx) => {
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.orderNumber).should(
        'have.text',
        fx.order.number.toString()
      );
    });

    cy.get(selectors.modalClose).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });
});
