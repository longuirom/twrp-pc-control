import { useEffect, useState } from "react";
import { IoMdCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import command from "../command";
import { BottomAction, TopAction } from "../components/Action";
import Log from "../components/Log";
import SideConfirm from "../components/SideConfirm";

const FLASH_STATUS = { DEFAULT: 0, FLASHING: 1, FLASHED: 2, FAILED: 3 };

function Backup() {
  const [selected, setSelected] = useState([]);
  const [flashStatus, setFlashStatus] = useState(FLASH_STATUS.DEFAULT);
  const [listPartitions, setListPartitions] = useState([]);
  const [swipeEnabled, setSwipeEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await command.getListPartition(true);
      setListPartitions(data);
    })();
    return () => {};
  }, []);

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

  function backup() {}

  return (
    <>
      <TopAction>
        <p className="text-primary">Select partitions to backup</p>
      </TopAction>
      <div>
        <ul className="pb-10">
          {listPartitions?.map((item) => {
            return (
              <li key={item.path}>
                <div
                  className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                  onClick={() => {
                    select(item);
                  }}
                >
                  {selected.includes(item.mountPoint) ? (
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
      </div>
      <Log />
      <BottomAction>
        {flashStatus == FLASH_STATUS.DEFAULT && (
          <SideConfirm onConfirm={backup} enabled={swipeEnabled} />
        )}
        {flashStatus == FLASH_STATUS.FLASHING && <SideProgress></SideProgress>}
      </BottomAction>
    </>
  );
}
export default Backup;
