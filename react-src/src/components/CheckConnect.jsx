import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import command from "../command";
import Button from "./Button";

function CheckConnect() {
  const ref = useRef();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkAdbDevice();
    const intervalId = setInterval(checkAdbDevice, 30000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAdbDevice() {
    const info = await command.checkAdbShell();
    if (info.stdErr) {
      setConnected(false);
      addLog(info.stdErr);
    } else {
      addLog(info.stdOut);
      setConnected(true);
    }
  }

  function addLog(log) {
    const p = document.createElement("p");
    p.textContent = log;
    ref.current?.prepend(p);
    // p.remove();
  }

  return (
    <>
      {!connected &&
        createPortal(
          <div className="twrp-bg fixed flex h-screen w-screen flex-col items-center justify-evenly p-5">
            <div className="w-full">
              <Button onClick={checkAdbDevice}>Try reconnect</Button>
            </div>
            {/* <Log /> */}

            <div ref={ref} className="h-40 w-full overflow-auto"></div>
          </div>,
          document.body,
        )}
    </>
  );
}
export default CheckConnect;
