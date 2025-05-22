"use client";
import Drawer from "rc-drawer";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";

//internal import
// import { SidebarContext } from "@/context/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawer } from "@/lib/store/slices/UIaction";

const MainDrawer = ({ children, product }) => {
  // const { toggleDrawer, isDrawerOpen, closeDrawer, windowDimension } =
  // useContext(SidebarContext);
  const { isDrawerOpen } = useSelector((state) => state.uiAction);
  const dispatch = useDispatch();
  const [isProduct, setIsProduct] = useState(false);

  // const location =

  // useEffect(() => {
  //   if (location.pathname === "/products") {
  //     setIsProduct(true);
  //   }
  // }, []);

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      parent={null}
      level={null}
      placement={"right"}
      // width={`${
      //   windowDimension <= 575 ? "100%" : product || isProduct ? "85%" : "50%"
      // }`}
    >
      <button
        // onClick={toggleDrawer}
        onClick={dispatch(toggleDrawer())}
        className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
      >
        <FiX className="mx-auto" />
      </button>

      <div className="flex flex-col w-full h-full justify-between">
        {children}
      </div>
    </Drawer>
  );
};

export default React.memo(MainDrawer);
