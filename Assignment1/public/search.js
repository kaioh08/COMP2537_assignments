const pokeTypes = {
    fire: "#FDDFDF",
    grass: "#DEFDE0",
    electric: "#FCF7DE",
    water: "#DEF3FD",
    ground: "#f4e7da",
    rock: "#d5d5d4",
    fairy: "#fceaff",
    poison: "#98d7a5",
    bug: "#f8d5a3",
    dragon: "#97b3e6",
    psychic: "#eceda1",
    flying: "#F5F5F5",
    fighting: "#E6E0D4",
    normal: "#F5F5F5",
  };
  
  const regionIdMap = {
    Kanto: {
      start: 1,
      end: 151,
    },
    Johto: {
      start: 152,
      end: 251,
    },
    Hoenn: {
      start: 252,
      end: 386,
    },
    Sinnoh: {
      start: 387,
      end: 494,
    },
    Unova: {
      start: 495,
      end: 649,
    },
    Kalos: {
      start: 650,
      end: 721,
    },
    Alola: {
      start: 722,
      end: 809,
    },
    Galar: {
      start: 810,
      end: 898,
    },
  };
  
  const pokeapiUrl = "https://pokeapi.co/api/v2/";
  const galleryWrapper = document.querySelector("#gallery-wrapper");
  const searchSubmitBtn = document.querySelector("#search-form-btn");
  const regionSelector = document.querySelector("#region-selector");
  const typeSelector = document.querySelector("#type-selector");
  const nameQuery = document.querySelector("#name");
  let pokemonList = [];
  const numOfPokemonToDisplay = 9;
  let page = 1;
  
  const getPokemon = async (id) => {
    const url = `${pokeapiUrl}pokemon/${id}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const pokemon = await res.json();
    return pokemon;
  };
  
  const makePokemonCard = (pokemon) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
  
    const poke_types = pokemon.types.map((type) => type.type.name);
    const displayType = Object.keys(pokeTypes).find((type) =>
      poke_types.includes(type)
    );
    const color = pokeTypes[displayType];
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  
    pokemonCard.style.backgroundColor = color;
  
    const pokemonCardContent = `
      <h3>#${pokemon.id}</h4>
      <div class="img-container"> 
        <a href="./profile/${pokemon.id}"> <img src="${pokemon.sprites.other["official-artwork"].front_default}" /> </a>
      </div>
      <h1>${name}</h2>
    `;
  
    pokemonCard.innerHTML = pokemonCardContent;
    return pokemonCard;
  };
  
  const getIdFromUrl = (url) => Number(url.split("/")[6]);
  
  const filterByRegionAndName = (pokemon, region, queryName) => {
    const { start, end } = regionIdMap[region];
    const pokemonId = getIdFromUrl(pokemon.url);
    return (
      pokemonId >= start && pokemonId <= end && pokemon.name.includes(queryName)
    );
  };
  
  const showPokemons = () => {
    const pokemonListToShow = pokemonList.slice(
      (page - 1) * numOfPokemonToDisplay,
      page * numOfPokemonToDisplay
    );
    pokemonListToShow.forEach((pokemon) => {
      const pokemonCard = makePokemonCard(pokemon);
      galleryWrapper.appendChild(pokemonCard);
    });
  };
  
  const getPokemonOfTypeRegionName = async (type, region, name) => {
    let queryUrl;
    let data;
    if (type === "all-types") {
      queryUrl = `${pokeapiUrl}pokemon/?limit=1126`;
      const response = await fetch(queryUrl);
      const rawData = await response.json();
      data = rawData.results;
    } else {
      queryUrl = `${pokeapiUrl}type/${type}`;
      const response = await fetch(queryUrl);
      const rawData = await response.json();
      data = rawData.pokemon.map((pokemonObj) => {
        const {
          pokemon: { name, url },
        } = pokemonObj;
        return { name, url };
      });
    }
  
    const pokemonObjs = data.filter((pokemonObj) =>
      filterByRegionAndName(pokemonObj, region, name)
    );
    pokemonList = await Promise.all(
      pokemonObjs.map(async (pokemonObj) => {
        const id = getIdFromUrl(pokemonObj.url);
        const pokemon = await getPokemon(id);
        return pokemon;
      })
    );
  };
  
  async function handleSearch(e) {
    e.preventDefault();
    pokemonList = [];
    galleryWrapper.innerHTML = "";
    const region = regionSelector.value;
    const type = typeSelector.value;
    const name = nameQuery.value.toLowerCase();
    await getPokemonOfTypeRegionName(type, region, name);
    page = 1;
    const prevBtn = document.querySelector("#prev");
    prevBtn.style.display = "none";
    const nextBtn = document.querySelector("#next");
    if (page * numOfPokemonToDisplay < pokemonList.length) {
      nextBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "none";
    }
    showPokemons();
  }
  
  const handlePrev = (e) => {
    page -= 1;
    galleryWrapper.innerHTML = "";
    showPokemons();
    const nextBtn = document.querySelector("#next");
    nextBtn.style.display = "inline-block";
    if (page <= 1) {
      // hide button
      e.currentTarget.style.display = "none";
    }
  };
  
  const handleNext = (e) => {
    page += 1;
    galleryWrapper.innerHTML = "";
    showPokemons();
    const prevBtn = document.querySelector("#prev");
    prevBtn.style.display = "inline-block";
    if (page * numOfPokemonToDisplay >= pokemonList.length) {
      // hide button
      e.currentTarget.style.display = "none";
    }
  };
  const init = async () => {
    const prevBtn = document.querySelector("#prev");
    prevBtn.style.display = "none";
    prevBtn.addEventListener("click", handlePrev);
    const nextBtn = document.querySelector("#next");
    nextBtn.addEventListener("click", handleNext);
    searchSubmitBtn.addEventListener("click", handleSearch);
  
    await getPokemonOfTypeRegionName("all-types", "Kanto", "");
    showPokemons();
  };
  
  window.addEventListener("load", () => {
    // when the window is loaded, show pokemons
    init();
  });
  