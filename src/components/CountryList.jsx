import styles from "./CountryList.module.css";
import Error from "./Error";
import Loader from "./Loader";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { isLoading, error, cities } = useCities();

  const countries = cities.reduce(
    (acc, cur) =>
      acc.concat({ id: cur.id, country: cur.country, emoji: cur.emoji }),
    []
  );

  if (isLoading) return <Loader />;

  if (error) return <Error />;

  if (!countries.length)
    return <Message message="Add you first city by click on map" />;

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
