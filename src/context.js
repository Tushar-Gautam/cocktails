import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="; //url to get cocktail by name
// console.log(url);
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("margarita");
  const [cocktails, setCocktails] = useState([]);

  const fetchDrinks = useCallback(async () => {
    setLoading(true);
    //coz everytime we type we need to load thus setLoading is true
    try {
      const response = await fetch(`${url}${searchTerm}`);
      const data = await response.json();
      // console.log(data);
      const { drinks } = data; //if no drinks of given name present then drinks will be null otherwise name present
      if (drinks) {
        //newCocktails used to extract only relevant properties from the drinks
        const newCocktails = drinks.map((item) => {
          const { idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass } =
            item;
          return {
            id: idDrink,
            name: strDrink,
            image: strDrinkThumb,
            info: strAlcoholic,
            glass: strGlass,
          };
        });
        // console.log(newCocktails);
        // console.log(drinks);
        setCocktails(newCocktails);
      } else {
        setCocktails([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);
  //every time searchTerm changes we want the function to work

  useEffect(() => {
    fetchDrinks();
  }, [searchTerm, fetchDrinks]);
  //if fetchDrinks added to dependency then infinite loop thus to avoid it useCallback is used to remove ->React Hook useEffect has a missing dependency: 'fetchDrinks'. Either include it or remove the dependency array  react-hooks/exhaustive-dep--{error}

  return (
    <AppContext.Provider value={{ loading, cocktails, setSearchTerm }}>
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
