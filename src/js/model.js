import { async } from "regenerator-runtime";
// import * as config from "./config.js"; 
import {API_URL, RES_PER_PAGE, KEY} from "./config.js"; 
// import {getJSON, sendJSON} from './helpers.js';
import {AJAX} from './helpers.js';

export const state = {
  recipe: {},
  search: {
    // Mozda nam ne treba za sada, ali i dalje je dobra ideja, da skladistimo u state.  
    query: '',// Jer mozda jednog dana nam bude trabala, za analitiku da bi znali koji su najcesci upiti/queries.  
    results: [], 
    page: 1,
    resultsPerPage: RES_PER_PAGE, // Vazan data za nasu app. ide u state.
  },
  bookmarks: [], // Skladistili smo sve podatke u bookmarks ne samo id, da bi mogli posle, i da ih renderujemo.
};

const createRecipeObject = function(data) {
  const {recipe} = data.data; 
  return  { 
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients, 
    // Vecina recepta nema key, vec samo oni koje smo poslali API-u. Tako da ne mozemo ovo:
    // key: recipe.key, // Jer nemaju svi key...
    // Treba da postoji key samo ako ga recept ima. Mozemo to da uradimo pomocu jednog trika:
    // Znamo da end && operator radi shor-circuits, vraca samo falsy vrednosti.
    // AKo recipe.key ne postoji nista nece da se desi.
    // Ako postoji bice truty vrednost i && operator ima da je preskoci i vratice {key: recipe.key} koju posle sa ...spread raspakujemo.
    ...(recipe.key && {key: recipe.key}),
  };
};

export const loadRecipe = async function(id) {
   try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);
    
    console.log(data); 
    // const {recipe} = data.data; // Treba nam i kada saljemo podatke API, pa da se ne ponavljamo.
    // state.recipe = { 
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients, 
    // };
    console.log(state.recipe);

    // Da bi nakon ponovnog ucitavanja bookmark ostao:
    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmark = false;  
    
   } catch(err) {
    console.log(`${err} 💥💥💥💥`);
    // Moramo opet rethrow error, da bi prosledili isti controlRecipes async funct.  
    throw err; 
   };
};

// =============================== 290. Implementing Search results:
// Kada pogledamo flowchart part 1. vidimo da smo zavrsili sa implementacijom ucitavanja jednog recepta.
// Ostaje nam ucitavanja search rezultata. I opet imamo tri dela > model, view i controller koji ih povezuje sve zajedno.
// Uglavnom je najlakse da se krene sa podacima, u sustini sa model-om, sto znaci u ovom primeru krecemo sa API pozivanjima, da 
// bi ucitali search rezultate. I nakon tog dela, mozemo da ih renderujemo, i izmedju toga brinemo o event-ima.  

// Export-ovacemo ovaj funct. cotroller-u, koji ima da je zove.
// Controller ce reci ovom funct. sta treba da trazi, u sustini prosledice query/upit.

export const loadSearchResults = async function(query) {
  try {
    state.search.query = query; // Sve upite da imamo na jednom mestu.

    // Iskoristili smo recipe key, da bi prikazali ikonicu, da je to nas recept.
    // I to ce radimo tako sto prikacimo nas key svim API upitima.  
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);  // Zbog key, ima da load-uje sve recepte, ukljucujuci i one koje sadrze nas key.
    console.log(data); // Imamo array sa svim receptima.

    state.search.results = data.data.recipes.map(rec => { // Skladistimo opet u STATE, koji ima da sadrzi sve podatke, koji su nam potrebni da napravimo nasu app. 
      return {                                    
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}), // Detalji line 30.
      };
    }); // Izvukli smo sve recept obj. u jedan novi array.

    state.search.page = 1; // Da se page vrati na 1.
  } catch(err) {
    console.log(`${err} 💥💥💥💥`);
    throw err; // Opet rethrow error. Da bi eventualno mogli da iskoristimo unutar controller-a.
  };
};

// =========================== 292. Implementing Pagination:
// Nece biti async funct. jer vec imamo podatke. 
// Sve sto treba da uradi, jeste da uzme iz state-a podatke za page, koji smo zahtevali. 
export const getSearchResultsPage = function(page = state.search.page) { // default parametar, po defaultu da krene od page 1.
  state.search.page = page; // Ako se prosledi arg. da se reassing-uje page.
  //  const start = 0;
  //  const end = 9; // Podaci se nalaze u array-u.
  // Ne zelimo da hardcode-ujemo, vec da izracunamo iste. 
  // Ovo je jedan od najlaksih nacina:
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  
  return state.search.results.slice(start, end); // Slice ima da izvuce od 0 do 10, poslednji broj ne izvlaci. 
};

// =================================== 295. Updating Recipe Servings
// Functon menja state tj. kolicinu/quantity u svakom  ingredient-u.
export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    // Da izracunamo novu kolicinu:
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    // newQt = oldOt * newServings / oldServings // 2 * 8 / 4 = 4 
  });

  state.recipe.servings = newServings; // Na kraju moramo da update-ujemo servings u state-u.
  // Da nismo uradili ovo, ako pokusamo da update-ujemo servings dva puta, 
  // onda bi i drugi put, i dalje koristili staru vrednost servings-a.  
};

// ===================================== 299. Storing Bookmarks with Local Storage:
const persistBookmarks = function() {
  // localStorage > setItem('ime item-a', Setujemo string). JSON.stringify, konverujemo JSON object u string.
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// ===================================== 297. Implementing Bookmarks:
export const addBookmark = function(recipe) {
  // Add bookmark:
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked:
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// Ovo je uobicajan patern u programiranju, da kada dodajemo nesto uzimamo sve podatke,
// a kada zelimo da obrisemo nesto, uzmemo samo ID.
export const deleteBookmark = function(id) {
  // Delete bookmarked:
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

// Mark current recipe as NOT bookmarked:
  if(id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Treba da izvadimo podatke iz localStorage-a, i renderujemo iste.
const init = function() {
  const storage = localStorage.getItem('bookmarks'); // Prvo skladistimo u slucaju da nema bookmark-a.
  if(storage) state.bookmarks = JSON.parse(storage); // JSON.parse, konvertuje JSON string u object.
}; 
init();
// console.log(state.bookmarks); // Imamo nazat podatke iz localStorage-a.

// Function for debugging:
const clearBookmarks = function() {
  localStorage.clear('bookmarks')
}
// clearBookmarks();

// =================================== 302. Uploading new recipe.
// Sada saljemo recipe podatke na API:
export const uploadRecipe = async function(newRecipe) {
  // Prvi zadatak ovog function-a je da uzme "raw/sirove" input podatke, 
  // i da ih transformise u isti format podataka koje dobijamo od API. 
  
  // console.log(Object.entries(newRecipe)); // Zelimo da izvucemo samo ingredients.
  try {
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] != '')
    .map(ing => {
      // const ingArr = ing[1].replaceAll(' ', '').split(','); 
      const ingArr = ing[1].split(',').map(el => el.trim()) // Ovako je bolje.
  
      if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');
  
      const [quantity, unit, description ] = ingArr; // array sa tri elementa > destructuring.
      return {quantity: quantity ? +quantity : null, unit, description};
    })
    console.log(ingredients); // Dobili smo samo  ingredients.
    
     // Sada radimo suprotno od onoga sto smo radili kada smo uzimali podatke od API:
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe); // I sada su podaci spremni da se posalju API-u.

    // Saljemo podatke:
    // Osim url, treba nam sada i API key. 
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); 
    // Kada saljemo podatke sa fetch API-u, takodje se vracaju isti. 
    // console.log(data); // Sa dodatim property-ima > createdAt, id, takodje i nas key. 
    // E sada da bi mogli da ih renderujemo:
    state.recipe = createRecipeObject(data); // Radimo isto sto i u loadRecipe.

    // Po flowchart-u ostaje nam samo da ubacimo recept u bookmark:
    addBookmark(state.recipe); // Bookmarked: true
  } catch(err) {
    throw err;
  };
};












