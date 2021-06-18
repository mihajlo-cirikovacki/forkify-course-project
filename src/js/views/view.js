import icons from 'url:../../img/icons.svg'; 

// Iz razloga sto imamo vise view-a, kreiracemo parent class-u.
// I time ostale classe ima da naslede metode koje se ponavljaju.

// Ovde exportujemo celu classu, jer sada nam ne trebaju instance ove class-e.
// Ima samo da je koristimo kao parent class-u, ostalim child view-ima.
export default class View { 
  _data;

  // =============== Primer Dokumentaije function-a:
  // Ako radimo u timu, ostali ce moci lakse da razumeju, sta tacno radi nas function.
  // Jer je ovo standard pisanja dokumentacija. 
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe) // Parametri, | znaci or/ili
   * @param {boolean} [render=true] if false, create markup string, instead of rendering to the DOM // [default-na vrednost]
   * @returns {undefined | string} A markup string is returned if render=false. // Undefined > kada ne vracamo nista.
   * @this {Object} View instance
   * @author Mihajlo 
   * @todo Finish implementation // Ovde navodimo sta jos treba da uradimo.
   */    
  // Sada kada hoverujemo iznad functiona, vidimo lep pregled inf. koje smo napisali.
  render(data, render = true) {
    // Cim stignu podaci, proveravamo da l postoje isti.
    // Mozemo ovako u jednoj liniji // Da se odmah izvrsi, i da renderuje error.
    // Posto (!data) > proverava samo ako je undefined ili null. U slucaju praznoj array, nece raditi.
    // Iz tog razloga proveravamo da l je array i da l je prazan.
    if(!data || (Array.isArray(data)) && data.length === 0) return this.renderError(); // Guard clause  

    this._data = data;
    const markup = this._generateMarkup(); // Svi childs moraju da imaju ovu metodu.

    if(!render) return markup;

    this._clear();
    // Insert Markup:
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // ============================= 296. Developing a DOM updating Algorithm
  // Sa ovim algoritmom ima da update-ujemo DOM, samo na onim mestima gde menjamo nesto.
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // Kreiracemo ceo markap, ali necemo da ga renderujemo,
    // vec ima da ga uporedimo sa novim HTML-om, i onda renderujemo tekst i atribute, koji su promenjeni u 
    // odnosu na stari markup.
    // Za sada imamo string, i bice prilicno kompleksno da uporedimo sa DOM elementima, koje trenutno imamo na page-u.
    // Kao resenje to problema, mozemo da iskoristimo jedan trik, sa kojim ima da konvertujemo markup string u DOM object,
    // i nakon toga mozemo da ga uporedimo sa trenutnim DOM koji se nalazi na page-u.

    // Na document zovemo metodu crateRenge(), vraca range object,
    // sa kojim zovemo metodu createContextualFragment, koja konvertuje string u pravi DOM node object.
    const newDOM = document.createRange().createContextualFragment(newMarkup); 

    // Onda selektujemo sve elemente u tom novom DOM node object-u.
    const newElements = Array.from( newDOM.querySelectorAll('*')); 
    // console.log(newElements); // Dobili smo NodeLlist, sa svim elementima unutar newDOM-a. 
     
    // Sada nam trebaju trenutni elementi koji se nalaze na page-u:
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // Array.from konvertujemo iterables (array like obj.) u array. 
    
    // Sada da ih uporedimo, tako sto petljamo nad oba array-a u isto vreme:
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]; // Iskoristimo index da petljamo i nad drugim array-em.
      // Uporedicemo ih sa metodom isEqualNode, koja je dostupna svim Node-ovima:
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT:
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') { // newEl, je element Node. a firstChild node je tekst.
        // console.log('💥',newEl.firstChild.nodeValue.trim()); // Samo text iz elementa.

        curEl.textContent = newEl.textContent; // Samo sa ovim ima da zamenimo ceo element, a ne samo vrednost koju zelimo da promenimo.
        // I za resenje, imamo dobar propery nodeValue koja izvlaci iz Node-a samo vrednost.
      };

      // Updates changed ATTRIBUTES:
      if(!newEl.isEqualNode(curEl)) {
      //  console.log(Array.from(newEl.attributes)); // Gde se desila promena vratio je object sa svim atributima. Konvertovali smo ga u array.
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value)); 
      }; // Zamenjujemo sve atribute iz curEl, sa atributima iz newEl.
    });

    // ======== U praksi nije dovoljno dobar ovaj algoritam, jedimo za male app. kao sto je ova. ========
    // Ovo je vise vezba za nasu logiku... React ima virtualni DOM, algoritme za uporedjivanje.
  };

  _clear() {
    this._parentElement.innerHTML = '';
  };

  // === Render Spinner:
  renderSpinner() { // Public method.
    const markup = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div> 
    `; 
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup); 
  }; 

  // ============================ 289. Lecture:
  // U praksi kada handlujemo error-e, mislimo na renderovanje error poruke na user interface-u.
  renderError(message = this._errorMessage) { // Tako da user zna sta se desava...
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  addHandlerRender(handler) { // Publesher
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  };
};


// ============================================ 304. Wrapping Up: 
// U ovoj lekcii videcemo kako pisemo nasu dokumentaciju za nas code, da bi ga kasnije lakse mi razumeli, a 
// takodje i drugi ljudi.
// Postoji standard za nacin pisanja dokumentacije za JavaScript function-e, koji se naziva JSDOcs > https://jsdoc.app/

// Ajde da vidimo jedan primer pisanja dokumentacije za function, primer sa render function-om ⏫





























