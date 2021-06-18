import View from './view';
import icons from 'url:../../img/icons.svg'; 

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHundlerPageBtn(hundler) {
    // Event delegation. Da ne bi morali da slusamo oba btn odvojeno. 
     this._parentElement.addEventListener('click', function(e) {
       // Closest selektuje parent elemente, radi supronto od querySelector-a.
       const btn = e.target.closest('.btn--inline'); // Closest jer unutar button-a imamo span, svg u slusaju da se klikne na njih.
       if(!btn) return;
       
       const goToPage = +btn.dataset.goto; // Preko dataset-a imamo pristup data atributima koje kreiramo.
       // console.log(goToPage);
      
       hundler(goToPage);
     });
  };

  _generateMarkup() { // Render metoda parent class-e je zove. Tako da svaki child view mora da je ima, ako renderuje nesto.
    // Trebaju nam svi podaci, da bi znali na kom smo page-u. I za to trebace nam ceo Search object. Te podatke mozemo da uzmemo preko render metode.

    const curPage = this._data.page; // this._data.page je trenutni page.
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); // Ukupan broj recepta / Ukupan broj recepta po page-u > 10
    // console.log(numPages); // Ukupan broj page-a.  

    // Imamo razlicite scenarija:
    // Treba i JavaScript da zna koji page treba da prikaze.
    // Tako da trebamo da uspostavimo konekciju izmedju DOM i naseg koda. I to radimo uz pomocu custom data atributa.
    // 
    const _nextBtn = `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1} Of ${numPages}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    const _prevBtn = ` 
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;

    // Page 1. and there are other pages
    if(curPage === 1 && numPages > 1) { 
      return _nextBtn;
    };

    // Last page
    if(curPage === numPages && numPages > 1) { // numPages > 1 u slucaju da ima jednu str. page.
      return _prevBtn; // Previous page, jer smo na poslednjom page-u.  
    };
    
    // Other page
    if(curPage < numPages) {
      return `${_prevBtn} ${_nextBtn}`; 
    };

    // Page 1, and there are NO other page.
    return '';
  };
};

export default new PaginationView();



















