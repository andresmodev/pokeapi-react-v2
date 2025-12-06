import { LIMIT } from "../utils/constants";

export async function fetchPokemonList(limit = LIMIT, offset = 0) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`List fetch failed: ${response.status} - ${response.statusText}`);

  return response.json();
}

export async function fetchPokemonDetails(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) throw new Error(`Details fetch failed: ${response.status}`);

  return response.json();
}

export async function fetchPokemonSpecies(id, signal) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`, { signal });

  if (!response.ok) throw new Error(`Species fetch failed: ${response.status}`);

  return response.json();
}

export async function fetchPokemonByName(name, signal) {
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}/`;
  const response = await fetch(url, { signal });

  if (!response.ok) throw new Error(`Fetch by name failed: ${response.status}`);
  return response.json();
}
