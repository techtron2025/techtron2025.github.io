const focus = {
	async mounted(el, binding) {
            // el-input  textarea
		if (el.firstElementChild) {
			el.firstElementChild.focus();
		} else {
			el.focus();
		}
	}
};

export default focus;
