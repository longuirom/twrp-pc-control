function ShapeBorder({ children = <></> }) {
  return (
    <div className="twrp-button-shape-small relative h-10 w-full border-2 border-white/50">
      <span className="absolute end-0 top-0 h-8 w-[4px] translate-y-2.5 rotate-45 bg-white/50"></span>
      {children}
    </div>
  );
}
export default ShapeBorder;
