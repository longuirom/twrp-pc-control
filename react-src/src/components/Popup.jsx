import { createPortal } from "react-dom";

function Popup({ children }) {
  return (
    <>
      {createPortal(
        <div className="fixed flex h-screen w-screen items-center justify-center bg-white/20 p-4">
          <div className="twrp-bg w-full p-4">{children}</div>
        </div>,
        document.body,
      )}
    </>
  );
}
export default Popup;
