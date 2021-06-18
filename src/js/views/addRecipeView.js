import View from './view';
import icons from 'url:../../img/icons.svg'; 

// Ovaj view je drugaciji od ostalih view-a, zato sto vec imamo view u HTML-u.
class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded 😉';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); // Posto je child class-a, krecemo sa super(), posle toga mozemo da koristimo this keyword.
    this._addHandlerShowWindow(); // Odmah zovemo metodu, cim se kreira instanca.
    this._addHandlerHideWindow();
  };

  toggleWindow() {
    this._overlay.classList.toggle('hidden'); // Umesto remove(), bolji je toggle > dodace class-u ako je nema, i izbrisace istu ako je ima. 
    this._window.classList.toggle('hidden');
  };

  // Ovaj handler samo dodaje i uklanja class-u, tako da controller ne posreduje nicemu ovde.
  // Zovemo ovu metodu cim se object kreira.
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  };
  
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }; // Vidimo da je toggle metodu jako korisna ovde.

  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function(e) {
      e.preventDefault();
      // Treba nam pristup svim vrednostima iz forme class-e upload.
      // Mozemo da selektujemo sve elemente forme jedan po jedan, i onda procitamo value property sa svih njih.
      // === Medjutim postoji laksi nacin, koristeci FormData constructor, koji je moderan browser API:
      // Prosledjujemo mu element, koja je forma.
      // FormData vraca cudan object, koji ne mozemo bas da iskoristimo.
      // Ali mozemo da ga raspakujemo sa ...spread unutar array-a.
      const dataArr = [...new FormData(this)]; // Dobili smo array sa svim poljima i njihovim vrednostima iz forme.
      // console.log(dataArr); // Dobili smo array koji sadrzi vise array-a, u sutini dobili smo entries forme, gde je prva vrednost key, a druga vrednosti.
      // Recipe podaci su uvek object, a ne array sa entries. 
      // === Od ES 2019. imamo jako dobru metodu, koja konvertuje entries u object:  
      const data = Object.fromEntries(dataArr); // Radi Suprotno od Object.entries, koji konvertuje object u array.
      handler(data); // Prosledilii smo mu podatke.
    });
  };
  
  _generateMarkup() {};
};

// Moramo da importujemo object u controller-u, jer u suprotnom, controller nece izvrsiti ovaj file.
export default new addRecipeView(); // I sam object nece biti kreiran.




















