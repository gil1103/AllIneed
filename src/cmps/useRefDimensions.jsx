import React from 'react'

export const useRefDimensions = (ref) => {
  const [dimensions, setDimensions] = React.useState({width: '', height: ''});
  React.useEffect(() => {
    if (ref.current) {
      const {current} = ref;
      const boundingRect = current.getBoundingClientRect();
      const {width, height} = boundingRect;
      setDimensions({width: Math.round(width), height: Math.round(height)});
    }
  }, [ref]);
  return dimensions;
}