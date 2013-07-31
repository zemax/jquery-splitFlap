;function delegate (method, instance) {	return function() {	return method.apply(instance, arguments); } }
