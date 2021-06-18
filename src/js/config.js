// =============================================================================================================================================
// ================================================= HELPERS AND CONFIGURATION FILES ===========================================================

// Mnogi projekti u praksi, imaju dva specijalna modula, koji su kompletno nezavisni
// od ostalog dela arhitekture.
// I ti specijalni moduli su:
// 1. Modul za project configuration.
// 2. Modul za helper function-e.

// ======================= Ovo ce biti CONFIGURATION MODUL ==========
// U ovom file-u stavljamo sve varijable, koje bi trebalo da budu konstante, i koristicemo ih sirom projekta.
// Cilj da se ovoj file ima, sa svim varijablama, jeste sto ima da nam omoguci da lakse
// konfigurisemo nas projekat, sa jednostavnim menjanjem nekih podataka iz ovog file-a.
// === Naravno necemo staviti bas sve varijable u ovaj file,
// === vec samo one koje su odgovorne za definisanje vaznih podataka, koje su vezane za samu aplikaciju.

// Primer takve varijable je API URL. URL ima da koristimo na vise mesta, za uzimanje search podataka, ili
// upload-ovanje recepta na serveru. 
// I zamislimo da se promeni URL u jednom trenutku, onda bismo morali svuda da menjamo isti.
// Umesto toga sam URL skladistimo u varijabli unutar ovog configuration file-a.
// I na taj nacin imamo na jednom mestu sve varijable koje koristimo svuda.

// U praksi u configuration file-u varijable pisemo velikim slovima.
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';

export const TIMEOUT_SEC = 10; // Za setovanje vremena u timeout funct.

export const RES_PER_PAGE = 10; // Jednog dana ako hocemo da promenimo konfiguraciju naseg page, jednostavno ovde promenimo.

export const KEY = '3c3f9670-b762-4a63-87f9-685d563b32eb';

export const MODAL_CLOSE_SEC = 2.5;












