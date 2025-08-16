const clickOutside = {
	mounted(el, binding) {
		el.clickOutsideEvent = function (event) {
			if (!(el === event.target || el.contains(event.target))) {
				binding.value.isShow = 0;
			}
		};
		document.addEventListener('click', el.clickOutsideEvent);
	},
	unmounted(el) {
		document.removeEventListener('click', el.clickOutsideEvent);
	}
};

export default clickOutside;
