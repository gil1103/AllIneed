function on(eventName, listener) {
	const callListener = ({ detail }) => {
		listener(detail);
	};
	window.addEventListener(eventName, callListener);

	return () => {
		window.removeEventListener(eventName, callListener);
	};
}

function emit(eventName, data) {
	const event = new CustomEvent(eventName, { detail: data });
	window.dispatchEvent(event);
}

export const eventBusService = { on, emit };


// function on(eventName, callback) {
// 	window.addEventListener(eventName, (e) => callback(e.detail));
// }

// function off(eventName, listener) {
// 	window.removeEventListener(eventName, listener);
// }

// function once(eventName, listener) {
// 	on(eventName, handleEventOnce);

// 	const handleEventOnce = (event) => {
// 		listener(event);
// 		off(eventName, handleEventOnce);
// 	};
// }

// function dispatch(eventName, data) {
// 	const event = new CustomEvent(eventName, { detail: data });
// 	window.dispatchEvent(event);
// }

// export const eventBusService = { on, off, once, emit };
