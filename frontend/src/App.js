import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../src/components/MainLayout";
import Login from "../src/components/Login";
import Signup from "../src/components/Signup";
import Landingpage from "../src/components/Landingpage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/landing" element={<Landingpage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
