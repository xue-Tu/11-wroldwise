import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

// 1). Create Context Value
const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000/cities";

const initialState = {
  cities: [],
  isLoading: true,
  error: null,
  currentCity: {},
};

function reduce(state, action) {
  switch (action.type) {
    case "loaded":
      return { ...state, isLoading: true, error: null };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("error with reduce");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reduce, initialState);

  const { cities, isLoading, error, currentCity } = state;

  useEffect(function () {
    async function fetchData() {
      dispatch({ type: "loaded" });

      try {
        const res = await fetch(`${BASE_URL}`);

        if (!res.ok) throw new Error("获取数据失败");
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "rejected", payload: e.message });
      }
    }

    fetchData();
  }, []);

  const getCity = useCallback(
    async function (id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loaded" });

      try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error("获取数据失败");

        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "rejected", payload: e.message });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loaded" });

    try {
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("获取数据失败");
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loaded" });

    try {
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities was used outside of the CitiesProvider");

  return context;
}

export { useCities, CitiesProvider };
