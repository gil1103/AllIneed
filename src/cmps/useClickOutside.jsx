import {useEffect, useRef} from 'react'

export const useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let mousedownHandler = (event) => {
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", mousedownHandler);

    return () => {
      document.removeEventListener("mousedown", mousedownHandler);
    };
  });
  return domNode;
};