const pokeTypes = {
    fire: '#FDDFDF',
    grass: '#DEFDE0', 
    electric: '#FCF7DE', 
    water: '#DEF3FD', 
    ground: '#f4e7da', 
    rock: '#d5d5d4', 
    fairy: '#fceaff', 
    poison: '#98d7a5', 
    bug: '#f8d5a3', 
    dragon: '#97b3e6', 
    psychic: '#eceda1', 
    flying: '#F5F5F5', 
    fighting: '#E6E0D4', 
    normal: '#F5F5F5'
  }
  
  window.addEventListener("load", async () => {
    // when the window is loaded, show 9 random pokemons
  
    const pokemons_number = 9;
    const pokeapiUrl = "https://pokeapi.co/api/v2/pokemon/";
    const galleryWrapper = document.getElementById("gallery-wrapper");
    const pokemonList = [];
  
    const getPokemon = async (id) => {
      const url = `${pokeapiUrl}${id}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const pokemon = await res.json();
      return pokemon;
    };
  
    for (let i = 0; i < pokemons_number; i++) {
      let pokemonId = Math.floor(Math.random() * 900) + 1;
      let pokemon = await getPokemon(pokemonId);
      while (!pokemon) {
        pokemonId = Math.floor(Math.random() * 900) + 1;
        pokemon = await getPokemon(pokemonId)
      }
      pokemonList.push(pokemon);
    }
  
    pokemonList.forEach((pokemon) => {
  
      const pokemonCard = document.createElement("div");
      pokemonCard.classList.add("pokemon-card");
  
      const poke_types = pokemon.types.map((type) => type.type.name);
      const displayType = Object.keys(pokeTypes).find(type => poke_types.includes(type));
      const color = pokeTypes[displayType];
      const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  
      pokemonCard.style.backgroundColor = color;
  
      const pokemonCardContent = `
        <h4>#${pokemon.id}</h4>
        <div class="img-container"> 
          <a href="./profile/${pokemon.id}"> <img src="${pokemon.sprites.other["official-artwork"].front_default}" /> </a>
        </div>
        <h2>${name}</h2>
      `;
  
      pokemonCard.innerHTML = pokemonCardContent;
  
      galleryWrapper.appendChild(pokemonCard);
    });
  });