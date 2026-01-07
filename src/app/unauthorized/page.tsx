"use client";
import React, { useEffect } from "react";

function UnAuthpage() {
  useEffect(() => {
    localStorage.removeItem("persist:root");
  }, []);
  return <div>Un - Authorized</div>;
}

export default UnAuthpage;
