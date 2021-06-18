import view from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; 
// Ostaje nam da renderujemo search rezultate, i to tako sto ima da kreiracemo novi view.

class ResultsView extends view  {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again 😉'; // Defalt error poruka.
  _successMessage = '';

  _generateMarkup() {
   // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join(); // Ima da vrati array sa velikim stringom.
  };
};

export default new ResultsView();



































