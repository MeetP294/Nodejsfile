import React from "react";
import { isMobile } from "react-device-detect";
import useOnClickOutside from "./useOnClickOutside";
import useKeyboardEvent from "./useKeyboardEvent";

// Create the Context that will be responsible for Modal stuff...
export const ModalContext = React.createContext();

export const ModalProvider = (props) => {
  const modalContentsRef = React.useRef(null);
  const modalCleanupCbRef = React.useRef(null);
  const _callbacks = React.useRef([]);

  const onModalUpdate = (cb) => _callbacks.current.push(cb);

  const setModalContents = (val, onClose) => {
    modalContentsRef.current = val;
    modalCleanupCbRef.current = onClose;
    _callbacks.current.forEach((cb) => cb());
  };

  const clear = () => {
    // console.log(typeof modalCleanupCbRef.current);

    typeof modalCleanupCbRef.current === "function" &&
      modalCleanupCbRef.current();

    setModalContents(null);
  };

  const ctx = {
    modalContentsRef,
    setModalContents,
    onModalUpdate,
    clear,
  };

  return (
    <ModalContext.Provider value={ctx}>{props.children}</ModalContext.Provider>
  );
};

let counter = 0;
export const ModalContainer = () => {
  const modalCtx = useModal();
  const visible = !!modalCtx.modalContentsRef.current;
  const timeoutRef = React.useRef();

  // Hitting the ESC key while modal is open should clear it
  useKeyboardEvent(
    "Escape",
    !!modalCtx.modalContentsRef.current,
    modalCtx.clear
  );

  // Cheating!
  const [, setState] = React.useState(counter);
  const forceRender = React.useCallback(() => setState(++counter), []);
  React.useEffect(() => {
    modalCtx.onModalUpdate(() => forceRender());
  }, [modalCtx, forceRender]);

  const [modalRef] = useOnClickOutside(modalCtx.clear);
  const modalStyle = {
    pointerEvents: "all",
    background: "white",
    maxWidth: 480,
    width: "100%",
    margin: "0px auto",
    padding: "12px 18px",
    boxShadow: "0px 0px 30px -5px rgba(0,0,0,0.5)",
  };

  // See: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
  const bodyPosition = React.useRef(document.body.style.position);
  const scrollY = React.useRef(document.body.style.top);
  const resetBody = React.useCallback(
    (config = { isNavigating: false }) => {
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
    if (visible) {
      // Store current scrollY
      scrollY.current = window.scrollY;
      // Set the body position to fixed to prevent scroll.
      timeoutRef.current = setTimeout(() => {
        document.body.style.top = `-${window.scrollY}px`;

        document.body.style.position = "fixed";
      }, 10);
    } else {
      // When NOT visible, make sure body posiiton has its
      // original value.
      resetBody();
    }
  }, [visible, resetBody]);

  let modal = null;
  let contents = modalCtx.modalContentsRef.current;
  if (!!contents) {
    if (isMobile) {
      modal = (
        <FullScreenDrawer
          zIndex="999"
          placement="right"
          closable={true}
          onClose={modalCtx.clear}
          visible={true}
          unmountChildOnClose={true}
        >
          {contents}
        </FullScreenDrawer>
      );
    } else {
      modal = (
        <div style={modalStyle} ref={modalRef}>
          {contents}
        </div>
      );
    }
  }

  // console.log(modalCtx);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        pointerEvents: modal ? "all" : "none",
        transition: "200ms all",
        background: modal ? "rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      {modal}
    </div>
  );
};

// Consumers of this hook are provided with current state of the modal
// And a function that allows them to set the current modal.
export default function useModal() {
  const modalContext = React.useContext(ModalContext);

  return modalContext;
}

export const Example = () => {
  const modalCtx = useModal();
  const dummy = <div>abcd</div>;
  return <button onClick={() => modalCtx.setModal(dummy)}>Set Modal </button>;
};

export const withModal = (Component) => (props) => {
  const modalCtx = useModal();

  return <Component {...props} modalCtx={modalCtx} />;
};
