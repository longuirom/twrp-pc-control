import { useEffect, useRef, useState } from "react";
import { IoMdCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { useLocation } from "react-router";
import command from "../command";
import { BottomAction, TopAction } from "../components/Action";
import Button from "../components/Button";
import SideConfirm from "../components/SideConfirm";
import SideProgress from "../components/SideProgress";

const FLASH_STATUS = { DEFAULT: 0, FLASHING: 1, FLASHED: 2, FAILED: 3 };

function ConfirmInstall() {
  const location = useLocation();
  const ref = useRef();
  const { state } = location;
  const [flashStatus, setFlashStatus] = useState(FLASH_STATUS.DEFAULT);
  const [selectedPartition, setSelectedPartition] = useState("");
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  const [listPartitions, setListPartitions] = useState([]);

  useEffect(() => {
    if (state?.extension == "img") {
      (async () => {
        const data = await command.getListPartition();
        setListPartitions(data);
      })();
    }
    return () => {};
  }, [state?.extension]);

  useEffect(() => {
    if (state?.extension == "zip") {
      setSwipeEnabled(true);
    }
    return () => {};
  }, [state]);

  function addLog(log) {
    const p = document.createElement("p");
    p.textContent = log;
    ref.current?.append(p);
  }

  async function flash() {
    if (state?.fullPath) {
      // console.log(state.fullPath);
      // console.log(state);

      // return;
      setFlashStatus(FLASH_STATUS.FLASHING);
      addLog("Flashing " + state?.fullPath);

      if (state?.extension == "img") {
        flashImg();
        return;
      }

      const result = await command.flashZipFile(state?.fullPath);
      if (result.stdErr) {
        setFlashStatus(FLASH_STATUS.FAILED);
        addLog("Flash failed");
        addLog(result.stdErr);
      }
      if (result.stdOut) {
        setFlashStatus(FLASH_STATUS.FLASHED);
        addLog("Flash successfully");
        addLog(result.stdOut);
      }
    }
  }

  async function flashImg() {
    const result = await command.flashImgFile(
      state?.fullPath,
      selectedPartition,
    );

    // console.log(result);

    if (result.stdErr) {
      if (result.stdErr.includes("copied")) {
        setFlashStatus(FLASH_STATUS.FLASHED);
        addLog("Flash successfully");
        addLog(result.stdErr);
      } else {
        setFlashStatus(FLASH_STATUS.FAILED);
        addLog("Flash failed");
        addLog(result.stdErr);
      }
    }
    if (result.stdOut) {
      setFlashStatus(FLASH_STATUS.FLASHED);
      addLog("Flash successfully");
      addLog(result.stdOut);
    }
  }

  async function wipeCacheAndDalvik() {
    setFlashStatus(FLASH_STATUS.FLASHING);
    addLog("Wiping cache...");
    await command.wipe("cache");
    addLog("Wiping cache done");
    addLog("Wiping dalvik...");
    await command.wipe("dalvik");
    addLog("Wiping dalvik done");
    setFlashStatus(FLASH_STATUS.FLASHED);
  }

  async function rebootSystem() {
    await command.reboot("system");
  }

  return (
    <div>
      <TopAction>
        <p className="text-primary">Log</p>
      </TopAction>
      <div ref={ref}></div>

      {state?.extension == "img" && flashStatus == FLASH_STATUS.DEFAULT && (
        <ul className="pb-10">
          {listPartitions.map((item) => {
            return (
              <li key={item.path}>
                <div
                  className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                  onClick={() => {
                    setSelectedPartition(item.path);
                    setSwipeEnabled(true);
                  }}
                >
                  {selectedPartition == item.path ? (
                    <IoMdCheckbox className="text-primary/70" size={30} />
                  ) : (
                    <MdCheckBoxOutlineBlank
                      className="text-primary/70"
                      size={30}
                    />
                  )}

                  <p className="">{item.entry}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <BottomAction>
        {flashStatus == FLASH_STATUS.DEFAULT && (
          <SideConfirm onConfirm={flash} enabled={swipeEnabled} />
        )}
        {flashStatus == FLASH_STATUS.FLASHING && <SideProgress></SideProgress>}
        {flashStatus == FLASH_STATUS.FLASHED && (
          <div className="flex gap-3">
            <Button onClick={wipeCacheAndDalvik}>Wipe cache/dalvik</Button>
            <Button onClick={rebootSystem}>Reboot system</Button>
          </div>
        )}
      </BottomAction>
    </div>
  );
}
export default ConfirmInstall;
