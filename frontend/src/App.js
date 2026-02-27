import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerComplaint from "./components/CustomerComplaint";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES (NO NAVBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES (WITH NAVBAR) */}
        <Route
          path="/landing"
          element={
            <>
              <Navbar />
              <CustomerComplaint />
            </>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;