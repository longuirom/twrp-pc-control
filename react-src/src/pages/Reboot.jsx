import command from "../command";
import Button from "../components/Button";
import Log from "../components/Log";
import { addLog } from "../utils";

const list = [
  { entry: "Power off", action: "-p" },
  { entry: "System", action: "system" },
  { entry: "Recovery", action: "recovery" },
  { entry: "Download mode", action: "download" },
  { entry: "Bootloader", action: "bootloader" },
  { entry: "EDL", action: "edl" },
  { entry: "Fastboot", action: "fastboot" },
];

function Reboot() {
  return (
    <div>
      <div className="py-5">
        <div className="grid grid-cols-2 gap-5">
          {list.map((item) => {
            return (
              <Button
                key={item.entry}
                large
                onClick={() => {
                  command.reboot(item.action);
                  addLog("Reboot " + item.entry);
                }}
              >
                {item.entry}
              </Button>
            );
          })}
        </div>
      </div>
      <Log />
    </div>
  );
}
export default Reboot;
