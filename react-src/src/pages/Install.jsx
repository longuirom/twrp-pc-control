import { useEffect, useState } from "react";
import { BsFileEarmarkZipFill } from "react-icons/bs";
import { FaDotCircle, FaFile, FaFolder } from "react-icons/fa";
import { IoMdCheckbox } from "react-icons/io";
import { IoArrowBack, IoArrowUndoSharp } from "react-icons/io5";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { useNavigate } from "react-router";
import command from "../command";
import { BottomAction, TopAction } from "../components/Action";
import Button from "../components/Button";
import PathBar from "../components/PathBar";
import Popup from "../components/Popup";

const listStorage = [
  { entry: "Storage", path: "/sdcard/" },
  { entry: "OTG", path: "/usb-otg/" },
  { entry: "SD", path: "/external_sd/" },
];

function Install() {
  const navigate = useNavigate();
  const [showPopSelectStorage, setShowPopSelectStorage] = useState(false);
  const [data, setData] = useState([]);
  const [dirs, setDirs] = useState([listStorage[0].path]);

  useEffect(() => {
    (async () => {
      const d = await command.getList(dirs[dirs.length - 1]);
      setData(d);
      // console.log(d);
    })();
  }, [dirs]);

  function onClick(item) {
    switch (item.type) {
      case "DIRECTORY":
        setDirs([...dirs, item.path]);
        break;
      case "FILE": {
        switch (item.extension) {
          case "img":
            navigate("/confirm-install", {
              state: item,
            });
            break;
          case "zip":
            navigate("/confirm-install", {
              state: item,
            });
            break;

          default:
            break;
        }
        break;
      }

      default:
        break;
    }
  }

  function back() {
    setDirs((prev) => prev.slice(0, -1));
  }

  function setNewDir(path) {
    setDirs((prev) => [...prev, path]);
  }

  return (
    <>
      <TopAction>
        <div className="flex items-center gap-2">
          {dirs.length > 1 && (
            <div
              className="rounded-full bg-white/20 p-2 hover:bg-white/30"
              onClick={back}
            >
              <IoArrowBack />
            </div>
          )}
          <PathBar currentPath={dirs[dirs.length - 1]} onChange={setNewDir} />
        </div>
      </TopAction>
      <div>
        <ul>
          {dirs[dirs.length - 1] != "/" && (
            <li>
              <div
                className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                onClick={() => {
                  if (dirs[dirs.length - 1] != "/") {
                    const newPath = dirs[dirs.length - 1]
                      .split("/")
                      .slice(1, -2)
                      .join("/");
                    setNewDir("/" + newPath + "/");
                  }
                }}
              >
                <IoArrowUndoSharp className="text-orange-400" />
                <p className="">...</p>
              </div>
            </li>
          )}

          {data.map((item) => {
            let icon = <></>;

            if (item.type == "FILE") {
              icon = <FaFile className="text-primary/70" />;

              if (item.extension == "zip") {
                icon = <BsFileEarmarkZipFill className="text-green-600" />;
              } else if (item.extension == "img") {
                icon = <FaDotCircle className="text-yellow-600" />;
              }
            } else {
              icon = <FaFolder className="text-white/60" />;
            }

            return (
              <li key={item.entry}>
                <div
                  className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                  onClick={() => onClick(item)}
                >
                  {icon}
                  <p className="overflow-hidden break-words">{item.entry}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <BottomAction>
        <div className="bottom-0 flex w-full gap-2">
          <Button
            onClick={() => {
              setShowPopSelectStorage(true);
            }}
          >
            Select storage
          </Button>
        </div>
      </BottomAction>
      {showPopSelectStorage && (
        <Popup>
          <ul className="pb-10">
            {listStorage.map((item) => {
              return (
                <li key={item.path}>
                  <div
                    className="flex w-full items-center gap-3 border-b border-white/20 py-2 hover:bg-white/10"
                    onClick={() => {
                      setDirs([item.path]);
                    }}
                  >
                    {dirs[dirs.length - 1].startsWith(item.path) ? (
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

          <Button
            onClick={() => {
              setShowPopSelectStorage(false);
            }}
          >
            Done
          </Button>
        </Popup>
      )}
    </>
  );
}
export default Install;
