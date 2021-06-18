import icons from 'url:../../img/icons.svg'; 
 // Npm paket za razlomke. Sve npm pakete imamo ovde > https://www.npmjs.com/
 // Kada importujemo iz NPM-a, bilo kakve pakete ili biblioteke, ne moramo da kucamo lokaciju, samo ime. 
import {Fraction} from 'fractional';// Mozemo i ovde da radimo Destructuring.

import View from './view.js';

// RecipeView je class-a, zato sto kasnije imacemo parent class-u View,
// koja ima da sadrzi par metoda, koje svi child-i ima da naslede.
// Takodje zelimo da svaki view ima par private metoda i property-a.
// Koristeci class-e cini da lakse sve ovo implementiramo.
class RecipeView extends View {
  // Babel nema podrsku za nasledjivanje private fields izmedju class-a.
  _parentElement = document.querySelector('.recipe'); // Parent element je unikatan u svakom view-u.
  _errorMessage = 'We could not find that recipe. Please try another one!'; // Defalt error poruka.
  _successMessage = '';
  
  addHandlerUpdateServings(handler) { // Ne moramo da kreiramo servings view, jer se button-i koji nam trebaju vec nalaze ovde.
    // Event Delegation:
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--update-servings');
      if(!btn) return;
      //console.log(btn);
      const {updateTo} = btn.dataset; // data-update-to > Kada ima - konvertuje se u camelCase. 
     
      if(+updateTo > 0) handler(+updateTo); // Da ne ide u minus// Odmah smo konvertovali u broj sa +
    });
  };

  addHandlerAddBookmark(hundler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--bookmark');
      if(!btn) return;
      hundler();
    });
  };

  _generateMarkup() { // Takodje svaki view ima svoj markup.
    return ` 
      <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${ this._data.title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
      </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${ this._data.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">    
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
  };

  _generateMarkupIngredient(ing) { 
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString() : ''}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `
  };
};

// Mogli smo da export-ujemo celu class-u, ali u tom slucaju, je moguce 
// kreirati vise view instanci, sto mi ne zelimo. 
// Takodje dodalo bi, ne neophodan rad u constroller-u. A mi zelimo da bude controller sto jednostavniji.
// Umesto toga kreiramo ovde object i export-ujemo ga.
export default new RecipeView();
























