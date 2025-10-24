import { useEffect, useState } from "react";
import command from "../command";
import Button from "../components/Button";
import Log from "../components/Log";
import MenuButton from "../components/MenuButton";
import homePageData from "../homePageData";
import { addLog } from "../utils";

function Home() {
  const [isRecovery, setIsRecovery] = useState(true);

  useEffect(() => {
    refreshCheckIsRecovery();
    return () => {};
  }, []);

  function refreshCheckIsRecovery() {
    command
      .checkIsRecovery()
      .then((result) => {
        if (!result) addLog("No recovery detected");
        setIsRecovery(result);
      })
      .catch(() => {});
  }

  return (
    <div className="py-5">
      <div className="grid grid-cols-2 gap-5">
        {homePageData.map((item) => {
          return (
            <MenuButton
              key={item.path}
              path={item.path}
              enabled={isRecovery || item.enableDefault}
            >
              {item.name}
            </MenuButton>
          );
        })}
      </div>
      {!isRecovery && (
        <>
          <div className="px-10 pt-30 text-center">
            <p>Need to boot into TWRP/OFOX,... to use TWRP PC Control</p>
            <br />
            <Button onClick={refreshCheckIsRecovery}>Refresh</Button>
          </div>
          <Log />
        </>
      )}
    </div>
  );
}
export default Home;
