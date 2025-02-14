import App from "./App/App.js";
import PokeApi from "./App/PokeApi.js";
import Cache from "./App/Cache.js";
import Pokemon from "./App/Pokemon.js";

let pokemon_id_el = document.querySelector('div.pokemon-id');
let pokemon_types_el = document.querySelector('div.pokemon-types');
let pokemon_name_el = document.querySelector('div.pokemon-name');
let pokemon_moves_el = document.querySelectorAll('div.pokemon-moves > div > img');
let pokemon_info_el = document.querySelector('div.pokemon-info');

// Event listener for "PokemonUpdated".
// This listener has to be registered early because we load first pokémon on page load.
document.body.addEventListener('PokemonUpdated', (event) => {
  let pokemon = Pokemon.createFromCache(event.detail.pokemon);
  let index = pokemon.getId() - 1;

  // Update Flickity content.
  app.flickity.cells[index].element.style.backgroundImage = 'url(' + pokemon.getSprite() + ')';
  app.flickity.cells[index].element.style.backgroundColor = app.getPokedexHexColor(pokemon.getColor());

  // Update metadata.
  pokemon_name_el.innerHTML = pokemon.getName();
  pokemon_info_el.innerHTML = [
    pokemon.getInfoBox()
  ].join('<br />');
  pokemon_id_el.innerHTML = '#' + pokemon.getId();
  pokemon_types_el.innerHTML = pokemon.getTypes().join(', ');
  pokemon_moves_el.forEach((el, index) => {
    let images = pokemon.getImages();

    el.src = '';
    if (images.length > index) {
      el.src = images[index];
    }
  });
}, false);

let slide_up_down_el = document.querySelector('.slide-up-down');

// Init app.
let app = new App(
  898,
  new PokeApi(),
  new Cache(),
  new Audio("assets/audio/theme.mp3"),
  document.querySelector('div.js-flickity')
);
app.init();
app.lazyLoadBackground();
app.populatePokeList(slide_up_down_el);

// Event listeners for Flickity.
await app.updatePokeInfo(1);
app.flickity.on('change', async (index) => {
  await app.updatePokeInfo(index + 1);
});

// Event listeners for d-pad buttons.
document.querySelector('.d-pad a.right').addEventListener('click', () => {
  app.flickity.next();
});
document.querySelector('.d-pad a.left').addEventListener('click', () => {
  app.flickity.previous();
});
document.querySelector('.d-pad a.up').addEventListener('click', () => {
  slide_up_down_el.classList.add('up');
});
document.querySelector('.d-pad a.down').addEventListener('click', () => {
  slide_up_down_el.classList.remove('up');
});
// Event listener for pokelist.
document.querySelector('div.hamburger-menu').addEventListener('click', ()=>{
  slide_up_down_el.classList.toggle('up');
});
slide_up_down_el.addEventListener('click', async (event) => {
  if (event.target.dataset.pokeIndex) {
    let index = event.target.dataset.pokeIndex;

    slide_up_down_el.classList.remove('up');
    app.flickity.select(index - 1);
    await app.updatePokeInfo(index);
  }
});

// Event listener for arrow keys.
document.body.onkeyup = (e) => {
  switch (e.which) {
    case 37:
      app.flickity.previous();
      break;
    case 39:
      app.flickity.next();
      break;
    case 38:
      slide_up_down_el.classList.add('up');
      break;
    case 40:
      slide_up_down_el.classList.remove('up');
      break;
  }
};
// Event listeners for audio buttons.
let play_button_el = document.querySelector('.play-button');
play_button_el.addEventListener('click', () => {
  app.toggleAudio();
  play_button_el.classList.toggle('paused');
});