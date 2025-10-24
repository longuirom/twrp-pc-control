import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./components/layouts/MainLayout";
import homePageData from "./homePageData";
import ConfirmInstall from "./pages/ConfirmInstall";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            {homePageData.map((e) => {
              return <Route path={e.path} element={e.element} key={e.path} />;
            })}
            <Route path="/confirm-install" element={<ConfirmInstall />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
