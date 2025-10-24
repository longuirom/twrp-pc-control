import clsx from "clsx";
import { useNavigate } from "react-router";
import Button from "./Button";

function MenuButton({ children, path, enabled = true }) {
  const navigate = useNavigate();

  return (
    <Button
      className={clsx({
        "opacity-40": !enabled,
      })}
      large
      onClick={() => {
        if (enabled) navigate(path);
      }}
    >
      {children}
    </Button>
  );
}
export default MenuButton;
