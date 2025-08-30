import "./App.css";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { Footer } from "./components/footer";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  DashboardPage,
  ContactPage,
  AboutPage,
  NotFoundPage,
} from "./pages";

function App() {
  return (
    <div className="page-wrapper">
      <Header names={"Mike Jorge"}></Header>
      {/* start page container */}
      <div className="page-container">
        <Sidebar names={"Mike Jorge"} title={"Developer"}></Sidebar>
        {/* start page content */}
        <div className="page-content-wrapper">
          <Routes>
            <Route path="/" element={<HomePage></HomePage>} />
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            />
            <Route path="/about" element={<AboutPage></AboutPage>} />
            <Route path="/contact" element={<ContactPage></ContactPage>} />
            <Route path="*" element={<NotFoundPage></NotFoundPage>} />
          </Routes>
        </div>
        {/* end page content */}
      </div>
      {/* end page container */}

      <Footer></Footer>
    </div>
  );
}

export default App;
