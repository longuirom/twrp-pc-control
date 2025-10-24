import { app } from "@neutralinojs/lib";
import { useEffect, useState } from "react";
import { FiTriangle } from "react-icons/fi";
import { RiHomeLine } from "react-icons/ri";
import { Outlet, useNavigate } from "react-router";
import downloadImage from "../../assets/twrplogo-256x256.png";
import CheckConnect from "../CheckConnect";

function MainLayout() {
  let navigate = useNavigate();
  const [config, setConfig] = useState({});

  useEffect(() => {
    app
      .getConfig()
      .then((config) => setConfig(config))
      .catch(() => {});

    return () => {};
  }, []);

  return (
    <div className="fixed flex h-screen w-screen flex-col justify-between text-white">
      <div>
        <div className="bg-primary p-3">
          <div className="flex items-center gap-2">
            <img src={downloadImage} alt="" className="w-10" />
            <div>
              <p className="text-2xl">TWRP PC Control ({config?.version})</p>
              <p>Developer: Long (FamiAmi)</p>
            </div>
          </div>
        </div>
        <div className="top-action"></div>
      </div>

      <div className="relative mx-4 flex-1 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>

      <div>
        <div className="bottom-action"></div>
        <div className="flex justify-evenly bg-black px-8">
          <div
            className="flex flex-1 justify-center py-3 hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <FiTriangle className="rotate-150" />
          </div>
          <div
            className="flex flex-1 justify-center py-3 hover:bg-white/10"
            onClick={() => navigate("")}
          >
            <RiHomeLine />
          </div>
          {/* <div className="flex flex-1 justify-center py-3 hover:bg-white/10">
            <RiMenu2Line />
          </div> */}
        </div>
      </div>
      <CheckConnect />
    </div>
  );
}
export default MainLayout;
