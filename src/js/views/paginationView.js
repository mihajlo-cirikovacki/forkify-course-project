import View from './view';
import icons from 'url:../../img/icons.svg'; 

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHundlerPageBtn(hundler) {
    // Event delegation. 
     this._parentElement.addEventListener('click', function(e) {
       const btn = e.target.closest('.btn--inline'); 
       if(!btn) return;
       
       const goToPage = +btn.dataset.goto; 
      
       hundler(goToPage);
     });
  };

  _generateMarkup() { 
    const curPage = this._data.page; 
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); 
    
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
    if(curPage === numPages && numPages > 1) { 
      return _prevBtn; // Previous page
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



















