import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function TopAction({ children }) {
  return (
    <>
      {createPortal(
        <div className="px-3">
          <div className="border-primary border-b pb-2"> {children}</div>
        </div>,
        document.querySelector(".top-action"),
      )}
    </>
  );
}

function BottomAction({ children }) {
  const [isMount, setIsMount] = useState();
  useEffect(() => {
    setIsMount(true);
    return () => {};
  }, []);

  return (
    <>
      {isMount &&
        createPortal(
          <div className="px-3 pb-2">{children}</div>,
          document.querySelector(".bottom-action"),
        )}
    </>
  );
}

export { BottomAction, TopAction };
