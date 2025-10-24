import { useState } from "react";
import { IoMdCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import command from "../command";
import { BottomAction, TopAction } from "../components/Action";
import Button from "../components/Button";
import Log from "../components/Log";
import ShapeBorder from "../components/ShapeBorder";
import SideConfirm from "../components/SideConfirm";
import SideProgress from "../components/SideProgress";
import { addLog } from "../utils";

const FLASH_STATUS = { DEFAULT: 0, FLASHING: 1, FLASHED: 2, FAILED: 3 };
const listPartitions = [
  { entry: "data", path: "/cache" },
  { entry: "cache", path: "/cache" },
  { entry: "dalvik", path: "/cache" },
];

function Wipe() {
  const [selected, setSelected] = useState([]);
  const [flashStatus, setFlashStatus] = useState(FLASH_STATUS.DEFAULT);
  const [factoryResetMode, setFactoryResetMode] = useState(false);
  const [swipeEnabled, setSwipeEnabled] = useState(false);

  async function reset() {
    setFlashStatus(FLASH_STATUS.FLASHING);

    if (factoryResetMode) {
      const info = await command.factoryReset();
      addLog(info.stdOut || info.stdErr);
      if (info.stdErr) {
        setFlashStatus(FLASH_STATUS.FAILED);
      }
      if (info.stdOut) {
        setFlashStatus(FLASH_STATUS.FLASHED);
      }
      return;
    }

    setFlashStatus(FLASH_STATUS.FLASHING);
    for (const item of selected) {
      const info = await command.wipe(item);
      addLog(info.stdOut || info.stdErr);
    }
    setFlashStatus(FLASH_STATUS.FLASHED);
  }

  async function wipeCacheAndDalvik() {
    setFlashStatus(FLASH_STATUS.FLASHING);
    for (const item of ["cache", "dalvik"]) {
      const info = await command.wipe(item);
      addLog(info.stdOut || info.stdErr);
    }
    setFlashStatus(FLASH_STATUS.FLASHED);
  }

  async function rebootSystem() {
    await command.reboot("system");
  }

  function select(item) {
    if (selected.includes(item.entry)) {
      setSwipeEnabled(selected.filter((e) => e != item.entry));
      setSelected((prev) => {
        const newArr = prev.filter((e) => e != item.entry);
        setSwipeEnabled(newArr.length > 0);
        return newArr;
      });
    } else {
      setSelected((prev) => {
        const newArr = [...prev, item.entry];
        setSwipeEnabled(newArr.length > 0);
        return newArr;
      });
    }
  }

  return (
    <>
      {!factoryResetMode && (
        <>
          <TopAction>
            <p className="text-primary">Select partitions to wipe</p>
          </TopAction>
          <div>
            <ul className="pb-10">
              {listPartitions?.map((item) => {
                return (
                  <li key={item.entry}>
                    <div
                      className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                      onClick={() => {
                        select(item);
                      }}
                    >
                      {selected.includes(item.entry) ? (
                        <IoMdCheckbox className="text-primary/70" size={30} />
                      ) : (
                        <MdCheckBoxOutlineBlank
                          className="text-primary/70"
                          size={30}
                        />
                      )}

                      <p>{item.entry}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      {factoryResetMode && (
        <div>
          <div className="w-full px-20 text-center">
            <p class="text-red-500">
              Format Data will wipe all of your apps, backups, pictures, videos,
              media, and removes encryption on internal storage.
            </p>
            <br />
            <p>This cannot be undone</p>
            <br />
            <p>Enter yes to continue. Press back to cancel</p>
            <br />
          </div>
          <ShapeBorder>
            <input
              type="text"
              className="w-full bg-transparent outline-none"
              onChange={(e) => {
                setSwipeEnabled(e.target.value == "yes");
              }}
            />
          </ShapeBorder>
        </div>
      )}

      <BottomAction>
        <div className="flex gap-4 pb-4">
          {factoryResetMode ? (
            <Button
              onClick={() => {
                setFactoryResetMode(false);
                setSwipeEnabled(false);
              }}
            >
              Wipe
            </Button>
          ) : (
            <Button
              onClick={() => {
                setFactoryResetMode(true);
                setSwipeEnabled(false);
                setSelected([]);
              }}
            >
              Factory reset
            </Button>
          )}
        </div>

        {flashStatus == FLASH_STATUS.DEFAULT && (
          <SideConfirm onConfirm={reset} enabled={swipeEnabled} />
        )}
        {flashStatus == FLASH_STATUS.FLASHING && <SideProgress></SideProgress>}
        {flashStatus == FLASH_STATUS.FLASHED && (
          <div className="flex gap-3">
            <Button onClick={wipeCacheAndDalvik}>Wipe cache/dalvik</Button>
            <Button onClick={rebootSystem}>Reboot system</Button>
          </div>
        )}
      </BottomAction>
      <Log />
    </>
  );
}
export default Wipe;
