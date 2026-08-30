import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;