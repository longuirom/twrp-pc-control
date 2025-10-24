import { useEffect, useState } from "react";
import { IoMdCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import command from "../command";
import { TopAction } from "../components/Action";
import Log from "../components/Log";
import { addLog } from "../utils";

function Mount() {
  // const [mountRw, setMountRw] = useState(false);
  const [mountedList, setMountedList] = useState([]);
  const [listPartitions, setListPartitions] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await command.getListPartition(true);
      setListPartitions(data);
    })();
    return () => {};
  }, []);

  useEffect(() => {
    listPartitions.forEach(async (item) => {
      const c = await command.checkMounted(item.mountPoint);
      // console.log({ c });

      if (c) setMountedList((prev) => [...prev, item.mountPoint]);
    });

    return () => {};
  }, [listPartitions]);

  // useEffect(() => {
  //   mountedList.forEach((item) => {
  //     uMount(item);
  //   });
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mountRw]);

  async function mount(item) {
    if (mountedList.includes(item.mountPoint)) {
      uMount(item.mountPoint);
      return;
    }

    const info = await command.mount(item.mountPoint);

    if (info.stdErr) {
      addLog(info.stdErr);
    }
    if (info.stdOut) {
      setMountedList((prev) => [...prev, item.mountPoint]);
      addLog(info.stdOut);
      // mountRw
      // const infoRw = await command.mountRw(item.mountPoint);
      // addLog(infoRw.stdOut || infoRw.stdErr);
    }
  }

  async function uMount(mountPoint) {
    const info = await command.umount(mountPoint);
    // console.log(info);

    if (info.stdErr) {
      addLog(info.stdErr);
    }
    if (info.stdOut) {
      setMountedList((prev) => prev.filter((e) => e != mountPoint));
      addLog(info.stdOut);
    }
  }

  return (
    <>
      <TopAction>
        <p className="text-primary">Select partitions to mount</p>
        {/* <div>
          <div className="flex items-center gap-3">
            {mountRw ? (
              <IoMdCheckbox
                className="text-primary/70"
                size={30}
                onClick={() => {
                  setMountRw(false);
                }}
              />
            ) : (
              <MdCheckBoxOutlineBlank
                className="text-primary/70"
                size={30}
                onClick={() => {
                  setMountRw(true);
                }}
              />
            )}
            <p>Mount RW</p>
          </div>
          <p>
            (If the partition is erofs it will not be possible to RW even if
            this option is enabled)
          </p>
        </div> */}
      </TopAction>
      <div>
        <ul className="pb-10">
          {listPartitions?.map((item) => {
            return (
              <li key={item.path}>
                <div
                  className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                  onClick={() => {
                    mount(item);
                  }}
                >
                  {mountedList.includes(item.mountPoint) ? (
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
    </>
  );
}
export default Mount;
