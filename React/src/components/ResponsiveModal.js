import React from "react";

/* Component-specific imports */
import useOnClickOutside from "../hooks/useOnClickOutside";
import useModal from "../hooks/useModal";
import { isMobile, isTablet } from "react-device-detect";
import Layer from "./Layer";
import { motion } from "framer-motion";

/* Component definition */
const Modal = (props) => {
  const ctx = useModal();
  const [modalRef] = useOnClickOutside(() => ctx.setModal(null));
  //   let {
  //     visible,
  //     header,
  //     footer,
  //     onClose,
  //     closeButton,
  //     children,
  //     transition,
  //   } = props;

  //   if (transition === undefined) {
  //     transition = 500;
  //   }

  const timeoutRef = React.useRef(null);
  const [containerStyleOverride, setContainerStyleOverride] = React.useState({
    transform: "translateX(100vw)",
  });

  const style = {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: "white",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    transition: `transform 500ms`,
    willChange: "transform",
    boxShadow: "-1px 0px 30px -20px rgba(0,0,0,0.5)",
  };

  const bodyStyle = {
    flexGrow: 1,
    overflowY: "scroll",
  };
  const closeBtnContainerStyle = {
    position: "fixed",
    zIndex: 999,
    top: 0,
    right: 0,
  };

  const animationProps = isMobile
    ? {
        initial: { x: "100vw" },
        animate: { x: 0 },
        exit: { x: "100vw" },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  // See: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
  const bodyPosition = React.useRef(document.body.style.position);
  const scrollY = React.useRef(document.body.style.top);
  const resetBody = React.useCallback(
    (config = { isNavigating: false }) => {
      // console.log("calling resetBody()");

      // Clear timeout
      clearTimeout(timeoutRef.current);

      // Reset body `position` and `top` properties
      document.body.style.position = bodyPosition.current;

      // const scrollY = document.body.style.top;
      document.body.style.top = ``;

      // If not navigating (i.e. just closing drawer)
      // scroll to saved scroll position
      if (!config.isNavigating) {
        window.scrollTo(0, parseInt(scrollY.current || "0"));
      }
    },
    [bodyPosition, scrollY]
  );

  React.useEffect(() => {
    return () => {
      resetBody({ isNavigating: true });
    };
  }, [resetBody]);

  React.useEffect(() => {
    // When the drawer becomes visible ...
    // Store current scrollY
    // console.log("window.scrollY", window.scrollY);
    scrollY.current = window.scrollY;
    // Set the body position to fixed to prevent scroll.
    timeoutRef.current = setTimeout(() => {
      // console.log("fixing body");
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.left = "0px";
      document.body.style.right = "0px";
      document.body.style.position = "fixed";
    }, 1000);
  }, []);

  return (
    <Layer centerContents z={1} bg="rgba(0,0,0,0.1)">
      <motion.div
        ref={modalRef}
        sx={{
          overflowY: "scroll",
          bg: "white",
          p: [3],
          top: [0, ""],
          left: [0, ""],
          bottom: [0, ""],
          right: [0, ""],
          width: ["100vw", 500],
          height: ["100vh", "auto"],
          maxHeight: [null, "80vh"],
          boxShadow: "0px 0px 30px -20px rgba(0,0,0,0.5)",
          borderRadius: 6,
        }}
        {...animationProps}
      >
        {props.children}
      </motion.div>
    </Layer>
  );

  //   return (
  //     <div style={{ ...style, ...containerStyleOverride }}>
  //       {closeButton ? (
  //         <div style={closeBtnContainerStyle}>{closeButton}</div>
  //       ) : null}
  //       {header}

  //       <div style={bodyStyle}>{children}</div>
  //       {footer}
  //     </div>
  //   );
};

export default Modal;
