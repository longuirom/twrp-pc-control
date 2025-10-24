import ShapeBorder from "./ShapeBorder";

function SideProgress() {
  return (
    <div className="relative">
      <ShapeBorder />
      <span className="bg-primary side-progress-transition absolute top-0 h-1 w-14"></span>
      <span className="bg-primary side-progress-transition absolute bottom-0 h-1 w-14"></span>
    </div>
  );
}
export default SideProgress;
