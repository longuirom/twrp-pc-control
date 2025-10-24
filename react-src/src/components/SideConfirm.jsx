import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { IoCaretBackOutline } from "react-icons/io5";
import ShapeBorder from "./ShapeBorder";

function SideConfirm({
  label = "Swipe to confirm flash",
  onConfirm,
  enabled = true,
}) {
  const parentRef = useRef();
  const [moveX, setMoveX] = useState(0);
  const [initX, setInitX] = useState(0);
  const [finalX, setFinalX] = useState(0);
  const [startedFlash, setStartedFlash] = useState(false);

  useEffect(() => {
    let cal = moveX - initX;
    if (cal < 0) cal = 0;

    setFinalX(cal);
    return () => {};
  }, [moveX, initX]);

  useEffect(() => {
    const calFinalX = finalX + initX + 10;
    const parentWith = parentRef.current.clientWidth;

    if (calFinalX >= parentWith) {
      if (!startedFlash) {
        setStartedFlash(true);
        onConfirm();
      }
    }
  }, [finalX, initX, startedFlash, onConfirm]);

  return (
    <ShapeBorder ref={parentRef}>
      <div ref={parentRef}>
        <p className="absolute end-10 top-2">{label}</p>
        <div
          className={clsx(
            "twrp-button-shape bg-primary relative inline-flex min-h-10 w-20 flex-1 items-center justify-center",
            {
              "opacity-50": !enabled,
            },
          )}
          style={{
            transform: `translateX(${finalX}px)`,
          }}
          onMouseDown={(event) => {
            if (enabled) {
              setInitX(event.clientX);
              setMoveX(event.clientX);
            }
          }}
          onMouseUp={() => {
            setMoveX(0);
            setInitX(0);
          }}
          onMouseMove={(event) => {
            if (initX != 0) {
              setMoveX(event.clientX);
            }
          }}
        >
          {[0, 1, 2].map((index) => {
            let translateX = 0;
            if (index == 0) {
              translateX = -20;
            } else if (index == 2) {
              translateX = 20;
            }

            return (
              <IoCaretBackOutline
                key={index}
                className="absolute rotate-180"
                size={30}
                style={{
                  transform: `translateX(${translateX}px)`,
                }}
              />
            );
          })}
        </div>{" "}
      </div>
    </ShapeBorder>
  );
}
export default SideConfirm;
