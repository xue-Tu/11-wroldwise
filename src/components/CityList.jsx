import styles from "./CityList.module.css";
import Error from "./Error";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import { useAuth } from "../contexts/FakeAuthContext";

function CityList() {
  const { cities, isLoading, error } = useCities();
  const context = useAuth();
  console.log(context);

  if (isLoading) return <Spinner />;

  if (error) return <Error />;

  if (!cities.length)
    return <Message message="Add you first city by click on map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
