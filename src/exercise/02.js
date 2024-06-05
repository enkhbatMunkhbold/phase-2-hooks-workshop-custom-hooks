import styled from "styled-components";
import React, { useEffect, useState } from "react";

// function reducer(state, action) {
//   if (action.type === "startFetch") {
//     return {data: null, status: "pending", errors: null}
//   } else if (action.type === "resolvedFetch") {
//     return {data: action.payload, status: "fulfilled", errors: null}
//   } else if (action.type === "errorFetch") {
//     return {data: null, status: "rejected", errors: action.payload}
//   }
//   return state;
// }

/* ✅ modify this usePokemon custom hook to take in a query as an argument */
export function usePokemon(query) {
  /* ✅ this hook should only return one thing: an object with the pokemon data */
  const [{data, status, errors}, setState] = useState({
    data: null,
    status: "idle",
    errors: null
  });

  // const [state, dispatch] = useReducer(reducer, {
  //   data: null,
  //   status: "idle",
  //   errors: null
  // })

  useEffect(() => {
    setState(state => ({...state, status: "pending", errors: null}))
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then(r => {
        if(r.ok) { return r.json()}
        else return r.text().then(err => { throw err})
      })
      .then(data => setState({data, status: "fulfilled", errors: null}))
      .catch(error => setState({data: null, status: "rejected", errors: [error]}))
  }, [query]);
  return { data, status, errors };
}

function Pokemon({ query }) {
  /* 
   ✅ move the code from the useState and useEffect hooks into the usePokemon hook
   then, call the usePokemon hook to access the pokemon data in this component
  */
  const { data: pokemon} = usePokemon(query)
  // 🚫 don't worry about the code below here, you shouldn't have to touch it
  if (!pokemon) return <h3>Loading...</h3>;

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name + " front sprite"}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("charmander");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(e.target.search.value);
  }

  return (
    <Wrapper>
      <h1>PokéSearcher</h1>
      <Pokemon query={query} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: papayawhip;
  text-align: center;

  h1 {
    background: #ef5350;
    color: white;
    display: block;
    margin: 0;
    padding: 1rem;
    color: white;
    font-size: 2rem;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }
`;