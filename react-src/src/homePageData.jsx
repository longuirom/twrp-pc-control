import Install from "./pages/Install";
import Mount from "./pages/Mount";
import Reboot from "./pages/Reboot";
import Restore from "./pages/Restore";
import Wipe from "./pages/Wipe";

const list = [
  {
    name: "Install/File Manager",
    path: "/install",
    enableDefault: false,
    element: <Install />,
  },
  {
    name: "Wipe",
    path: "/wipe",
    enableDefault: false,
    element: <Wipe />,
  },
  {
    name: "Backup",
    path: "/backup",
    enableDefault: false,
    element: <Restore />,
  },
  {
    name: "Restore",
    path: "/restore",
    enableDefault: false,
    element: <Restore />,
  },
  {
    name: "Mount",
    path: "/mount",
    enableDefault: false,
    element: <Mount />,
  },
  // {
  //   name: "Settings",
  //   path: "/settings",
  //   element: <Settings />,
  // },
  // {
  //   name: "Advanced",
  //   path: "/advanced",
  //   element: <Advanced />,
  // },
  {
    name: "Reboot",
    path: "/reboot",
    enableDefault: true,
    element: <Reboot />,
  },
];

export default list;
