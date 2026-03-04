import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../src/components/MainLayout";
import Login from "../src/components/Login";
import Signup from "../src/components/Signup";
import Landingpage from "../src/components/Landingpage";
import CustomerComplaint from "./components/CustomerComplaint";
import Logout from "./components/logout";
import CasePage from "./components/CasePage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/landing" element={<Landingpage />} />
          <Route path="/complaints" element={<CustomerComplaint />} />
          <Route path="/casepage" element={<CasePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;