import { useEffect, useRef } from "react";

export default function useOnClickOutside(cb) {
  const primaryRef = useRef();
  const restRef = useRef({});

  const register = (nodeId) => (node) => {
    console.log(node);
    restRef.current[nodeId] = node;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (primaryRef.current) {
        const eventIsOutsidePrimaryRef = !primaryRef.current.contains(
          event.target
        );

        const eventIsOutsideAdditionalNodes = !Object.values(
          restRef.current
        ).some((node) => node.contains(event.target));

        if (!eventIsOutsideAdditionalNodes) {
          console.log("clicked `additional node`");
        }

        if (eventIsOutsidePrimaryRef && eventIsOutsideAdditionalNodes) {
          console.log("Clicked outside");
          cb();
        }
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [primaryRef, cb]);

  return [primaryRef, register];
}
