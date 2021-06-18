// =============================================================================================================================================
// ================================================= HELPERS FILES =============================================================================
import { async } from "regenerator-runtime";
import {TIMEOUT_SEC} from './config.js';

// Cilj ovog file-a/modula jeste da sadrzi par function-a, koje koristimo stalno kroz nas projekat.
// I sa ovim modulom imamo centralno mesto za sve njih.

// Dobar kandidat za ovaj module jeste slanje request-a API-u.

const timeout = function (s) { // Vraca odbijeni promise, 
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Refactoring getJSON i sendJSON function-a:
// Kada primi samo url saljemo request, a kada prosledimo i drugom arg. podatke, onda saljemo iste na API.
export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData), 
    })  : fetch(url);

      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); 
      const data = await res.json();
    
      // Handling fetch errors:  
      if(!res.ok) throw new Error(`${data.message} (${res.status})`);

      return data;

  } catch(err) {
      throw err; 
  };
};


// =======================================
export const getJSON = async function(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); 
    const data = await res.json();
    
    // Handling fetch errors:  
    if(!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;

  } catch(err) {
    throw err; // rethrow error. Da bi se handlovo isti u model.js.
  };
};

// ================ Sada da vidimo kako mozemo da posaljemo podatke API, koristeci fetch function: 
export const sendJSON = async function(url, uploadData) {
  try { // Kada saljemo podatke sa fetch funct. pored url, moramo da posaljemo object sa opcijama.
    const fetchPro = fetch(url, {
      method: 'POST', // Prva opcija method, koja ce biti POST. 
      headers: { // Inf. o samom request-u.
        // Moramo da definisemo Content Type:
        'Content-Type': 'application/json', // 'application/json' > Sa ovim smo rekli API-ju da podatke koje saljemo su u JSON formatu.
      },
      body: JSON.stringify(uploadData), // I na kraju u podatke koje saljemo, moraju da budu u JSON string formatu.  
    }); 

    // Sve ostalo je isto.
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); 
    const data = await res.json();
    
    // Handling fetch errors:  
    if(!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;

  } catch(err) {
    throw err; // rethrow error. Da bi se handlovo isti u model.js.
  };
};
































