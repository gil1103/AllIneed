import React, { useEffect, forwardRef } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
			if (ref?.current && !ref?.current.contains(event.target)) {
				alert('You clicked outside of me!');
			}
		}
		// Bind the event listener
		document.addEventListener('click', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('click', handleClickOutside);
		};
	}, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props,ref) {
	useOutsideAlerter(ref);

	return <div ref={ref}>{props.children}</div>;
}

export default forwardRef(OutsideAlerter);
