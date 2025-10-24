import { BottomAction } from "./Action";

function Log() {
  return (
    <div>
      <BottomAction>
        <div className="max-h-20 overflow-auto" id="log"></div>
      </BottomAction>
    </div>
  );
}

export default Log;
