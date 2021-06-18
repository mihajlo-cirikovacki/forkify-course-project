// Dobra praksa je da imamo razdvojeni view.
// Tako da kreiracemo ovde novi view samo za search deo.
// Takodje su i u user interface-u razdvojeni delovi, tako da ima smisla, da su u razlicitom view-u.

// Ova class-a nece renderovati nista, sve sto zelimo je da uzmemo upit/query.
class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    // Preko parent-a selektujemo njegov child sa querySelector-om:
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }; // Mogli smo ovo da napisemo unutar controller-a, ali ne bi imalo smisla, unutar controller-a ne idu DOM elementi...


  _clearInput() {
    this._parentEl.querySelector('.search__field').value = ''; 
  };

  addHandlerSearch(handler) { // publisher. (Po Publisher-Subscriber pattern-u)
    this._parentEl.addEventListener('submit', function(e) { // Slusamo celu formu, i submit event. Event se pali bez obzira na enter ili click button-a.
      e.preventDefault(); // Kada radimo sa formom, moramo da ugasimo defalut-no ponasanje, u suprotnom page ima da se reload-uje.
      handler(); // I tek sada zovemo handler.  
    }); 
  };
};

export default new SearchView();// Ne export-ujemo celu class-u, vec njenu instancu.




















