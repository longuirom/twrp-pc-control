import clsx from "clsx";

function Button({ children, onClick, large = false, className }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "twrp-button-shape flex min-h-10 flex-1 items-center justify-center bg-white/20 hover:bg-white/22",
        {
          "min-h-10": !large,
          "min-h-24": large,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
export default Button;
