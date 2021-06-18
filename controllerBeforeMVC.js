// HTML koji se prikazuje u browser-u, je HTML file iz dist folder-a. Svi asset-i dolaze odatle... 
// Tako da bi prikazali icons na page-u, ne mozemo ovako > src/img/icons.svg#icon-clock.
// Vec moramo da ih importujemo uz pomoc Parcel-a. Sa Parcel-om mozemo da importujemo razlicite asset-e, pa tako i slike.
// import icons from '../img/icons.svg'; // Parcel 1. stari nacin
// Kod Parcel 2. za sve staticke asset-e (imgs, videos, sounds..), koji nisu programski file-ovi, moramo da napisemo > url:  
import icons from 'url:../img/icons.svg'; // ../ > Ka parent folderu, da izadjemo iz js foldera.
import 'core-js/stable'; // Za polyfilling
import 'regenerator-runtime/runtime'; // Za polyfilling > async/await.

console.log(icons); // Vidimo da je putanja ka novom icons file-u. // I sad samo zamenimo lokaciju u template string-u.

const { recip } = require("prelude-ls");
const { async } = require("q");

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2 API

///////////////////////////////////////
// === Render Spinner:
const renderSpinner = function(parentEl) {
  // Animacija rotacije spinner-a > sass file.
  const markup = `
  <div class="spinner">
  <svg>
    <use href="${icons}#icon-loader"></use>
  </svg>
  </div> 
   `; 
  parentEl.innerHTML = ''; // Prvo da ocistimo parent element, pre ubacivanja markup-a.
  parentEl.insertAdjacentHTML('afterbegin', markup); 
}; 


const showRecipe = async function() {
  try {
    // Preko window.location-a mozemo da uzmemo hash id.
    const id = window.location.hash.slice(1); // slice da bi sklonili hash #
    console.log(id);

    // Moramo da testiramo da ako id ne postoji, da function ne nastavlja sa izvrsavanjem.
    if(!id) return; // Guard Clauses > Moderan nacin. Pre smo radili if(id) pa {} block code-a, sto bi stvaralo nepotreban nesting.    

    // === 1. Loading Recipe:
    renderSpinner(recipeContainer); // Render spinner.

    // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcd09');
    // I sada umesto hard code-ovanog id-ja, dinamicno smo dobili isti: 
    const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
    const data = await res.json();

    // Handling fetch errors:  
    if(!res.ok) throw new Error(`${data.message} (${res.status})`); //Posto data koja dolaze sa servera, ima error message property, mozemo to da iskoristimo.
    
    // Vidimo kod data, da imamo property-e sa _ > (cooking_time: 45) Sto je neobicajno u JavaScrip-tu.
    console.log(res, data); 
    // Kada naidjemo na tako nesto, uglavnom ono sto radimo jeste rekreiramo taj object:
    let {recipe} = data.data; // Izvukli smo recipe > destructuring
    recipe = { // Rekreiramo obj. sa boljim property imenima.
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients, 
    };
    console.log(recipe);

    // === 2. Rendering Recipe:
    const markup = ` 
      <figure class="recipe__fig">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
      </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">    
          ${recipe.ingredients.map(ing => { // Loop-ujemo preko ingredients array-a. I sve ingredient-e spojimo u jedan array sa join() array metodom.
            return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="${ing.unit}">g</span>
                ${ing.description}
              </div>
            </li>
            `
          })
          .join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${recipe.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
    recipeContainer.innerHTML = '';
    // Insert Markup:
    recipeContainer.insertAdjacentHTML('afterbegin', markup);

  } catch(err) {
    alert(err);
  };
};
// showRecipe();
// Slusamo promenu hash-a, sa hashchange event-om:
// window.addEventListener('hashchange', showRecipe); 
// Slusamo i load event iz razloga sto se ne pali hashchange event, kada copy-past url u drugi prozor, 
// i tada ne dobijamo recipe, jer se u ovom slucaju nije se promenio hash:
// window.addEventListener('load', showRecipe);
// === Ovde se vec ponavljamo, zamislimo da imamo 10 event-a, i da svaki izvrsava isti event handler function. === 
// === To bi stvaralo nered, i umesto toga mozemo da imamo array koji sadrzi sve te evente: ===
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));





























