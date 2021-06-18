import * as model from './model.js'; // Importujemo sve odjednom, iz model modula.
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'; 

const { recip } = require("prelude-ls");
const { async } = require("q");

if(module.hot) { // Parcel
  module.hot.accept();
};

// https://forkify-api.herokuapp.com/v2 API
///////////////////////////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1); 
   // console.log(id);
   
    if(!id) return; // Guard Clauses         
    recipeView.renderSpinner(); // Render spinner.
    
    // === 0. Update results view, to mark selected search result:
    resultsView.update(model.getSearchResultsPage()); 

    // === 1. Updating bookmarks view:
    bookmarksView.update(model.state.bookmarks); 
    
    // === 2. Loading Recipe:
    // U Controller-u zovemo functione:
    await model.loadRecipe(id); // Async function, moramo await. // Vidimo primer gde, jedan async funct. zove drugi async funct. 
    
    // === 3. Rendering Recipe:
    // const recipeView = new recipeView(model.state.recipe); // Mogli smo i ovako, da smo export-ovali celu class-u.
    recipeView.render(model.state.recipe); // Ovako je cistije // Uobicajno ime metode, koja renderuje...
    
  } catch(err) {
    recipeView.renderError();// Ne prosledjuemo ovde error poruku, vec u view.
    // Na ovaj nacin necemo imati code, koji se odnosi na view.
  };
};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1. Get Search Query:
    const query = searchView.getQuery();
    if(!query) return; // Guard Clause, U slucaju da nema upita.

    // 2. Load search results:
    await model.loadSearchResults(query); // Takodje ne vraca nista. Sve sto radi jeste manipulise state-om.
    
    // 3. Render results:
    // console.log(model.state.search.results); 
    // resultsView.render(model.state.search.results); // Ovde smo renderovali sve rezultate.
    resultsView.render(model.getSearchResultsPage()); // Ovde smo sa model.getSearchResultsPage() uradili pagination.
    
    // 4. Render pocetne render button-e:
    paginationView.render(model.state.search); // I sada imamo dostupne sve search podatke. Render metoda > _data.

  } catch(err) {
    console.log(err);
  };
};


// ============================================== 288. Event Handlers in MVC: PUBLISHER-SUBSCRIBER PATTERN

// U ovoj lekciji videcemo kako handlujemo evente u MVC arhikt. koristeci Publisher-Subscriber pattern.
 
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));

// Za sada slusamo ova dva event-a, unutar controller-a. Medjutim to nema mnogo smisla.
// Zato sto, sve sto je povezano sa DOM, trebalo bi da bude unutar view-a.
// Ova dva eventa nemaju veze sa DOM, ali zamislimo da imamo click event, na neki DOM element, onda bi sigurno trebao da bude unutar view-a.
// Tako da nam treba nacin da ubacimo ovu logiku ovde unutar view. 
// Medjutim handler function koji koristimo da handluje ove event-e, se nalazi ovde u controller-u.
// Tako da imamo problem ovde. Ne zelimo ovaj code ovde vec u view, ali unutar ovog event-a nam treba ovaj controller function.
// E sada kako cemo resiti ovaj problem? (PDF)
// 1. Event-e bi trebalo da handlujemo u controller-u. Jer u suprotnom imali bi app. logiku unutar view-a.
// 2. Event-e bi trebalo da slusamo unutar view-a. Jer u suprotnom imali bi DOM elemente, tj presentation logiku unutar controller-a.
// Ako pogledamo dijagram koji je deo dijagrama arhitect. imamo controlRecipe function unutar controller-a, 
// i imamo specijalnu metodu unutar view-a, koja se naziva addHandlerRender.
// Mozda mislimo da je veoma lako da povezemo ove dva function-a.
// Jer zasto jednostavno ne pozovemo controlRecipe function, upravo iz view-a kad god se javi event.
// Jednostavno to nije moguce zbog nacina na koji smo setovali nasu arhitekturu.
// View nista nezna o controller-u. Nismo importovali controller unutar view-a.
// Tako da ne mozemo da zovemo bilo koji function iz controller-a, unutar view-a.
// Ali postoji dobro resenje ovog problema, koje se naziva Publisher-Subcriber pattern.
// Inace design pattern-i u programiranju, su standardna resenja za odredjene vrste problema. 
// == Kod Publisher-Subscriber pattern-a imamo PUBLISHER-a, koji predstavlja code koji zna kada da reaguje.
// == I u ovom slucaju to ce biti addHanlderRender function, jer sadrzi addEventListener metodu,
// == i zbog toga ce znati kada da raguje na event.
// == S druge strane imamo SUBSCRIBER-a, koji predstavlja code koji hoce da reaguje.
// == To je code koji bi trebao da se izvrsi kada se event desi.
// == I u ovom slucaju to je controlRecipes function, kog vec imamo unutar controller-a.
// ============= I sada napokon dolazimo do resenja.
// === Unutar controller-a kreiramo init function, koji ima da zove addHandlerRender metodu.
// === I to je moguce jer unutar controller-a, importujemo view. 
// === I onda prosledjujemo controlRecipes function kao argument, addHandlerRender metodi.
// === I na ovaj nacin su povezani.
// ==== Na ovaj nacin implemetniramo event-e i event handlere u MVC arhitekturi.
// ==== I na ovaj nacin cemo moci da zadrzimo event handlere u controller-u, a event listener-e unutar view-a.

// Ovaj functon kontrolise PAGINATION.
const controlPagination = function(goToPage) {
  // 1. Render NEW results:
  resultsView.render(model.getSearchResultsPage(goToPage)); 
  
  // 2. Render NEW pagination buttons:
  paginationView.render(model.state.search);
};

// =================================== 295. Updating Recipe Servings
const controlServings = function(newServings) {
  // Update the recipe servings (in state):
  model.updateServings(newServings);

  // Update the recipe view:
  // recipeView.render(model.state.recipe); 
  recipeView.update(model.state.recipe); // Ne renderuje ponovo ceo view, vec samo text i atribute unutar DOM.
};

// =================================== 297. Implementing Bookmarks:
const controlAddBookmark = function() {
  // 1. Add/Remove bookmark:
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view:
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks:
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    // Show loading spinner:
    addRecipeView.renderSpinner();

    // Upload new recipe data:
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe:
    recipeView.render(model.state.recipe);

    // Success message:
    addRecipeView.renderMessage();

    // Render bookmark view:
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL:
    // Za promenu ID u URL-u, koristicemo browser HISTORY API.
    // U sustini ovo nam omogucuje da menjamo url, a da ne moramo da reload-ujemo page.
    // Na history object, zovemo pushState metodu koja prima tri argumenta 
    // 1.state 2. title, (prva dva nam nisu bitni) i 3 url, koji nam treba: 
    window.history.pushState(null, '', `#${model.state.recipe.id}`); 
    // MOzemo sa history API da idemo napred-nazat npr:
    // window.history.back()

    // Close form window:
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch(err) {
    console.error('💥 💥',err);
    addRecipeView.renderError(err.message);
  };  
};

// PUBLISHER-SUBSCRIBER PATTERN:
const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); // controlRecipes > subscriber.
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHundlerPageBtn(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init(); // I sa ovim smo implementirali publesher-subscriber pattern.





















