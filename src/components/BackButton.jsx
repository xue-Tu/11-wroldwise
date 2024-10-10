import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton({ children }, x) {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(-1)} type="back">
      {children}
    </Button>
  );
}

export default BackButton;
