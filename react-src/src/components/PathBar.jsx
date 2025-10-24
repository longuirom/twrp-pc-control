import { useEffect, useState } from "react";

function PathBar({ currentPath, onChange }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    let tmp = "/";
    const result = currentPath
      .split("/")
      .map((item) => {
        if (item) tmp += item + "/";

        return { name: item, path: tmp };
      })
      .filter((item) => item.name);

    setList(result);

    return () => {};
  }, [currentPath]);

  return (
    <>
      <div className="text-primary border-b border-white/20 py-2">
        {list?.map((item) => {
          return (
            <span key={item.path}>
              /
              <span
                className="hover:underline"
                onClick={() => onChange(item.path)}
              >
                {item.name}
              </span>
            </span>
          );
        })}
      </div>
    </>
  );
}
export default PathBar;
