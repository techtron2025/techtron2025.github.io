// data-url 这个自定义属性，在盒子上必须设置

let type = 'img';

const lazy = {
	mounted(el, binding) {
		type = binding.value;
		if (type == 'img') {
			let imgs = el.getElementsByTagName('img');
			for (let i = 0; i < imgs.length; i++) {
				observerImg.observe(imgs[i]);
			}
		} else if (type == 'bg') {
			observerBg.observe(el);
		}
	}
};
// 交叉观察器 img
const observerImg = new IntersectionObserver((arr) => {
	//arr 是被观察的元素集合
	for (let i = 0, len = arr.length; i < len; i++) {
		let item = arr[i];

		// 通过这个属性判断是否在视口中
		if (item.isIntersecting) {
			// 图片标签
			const _target = item.target;
			//     设置图片的模糊度
			_target.style.filter = 'blur(5px)';
			const url = item.target.getAttribute('data-url');
			_target.src = new URL(url, import.meta.url).href
			//加载完毕后，恢复模糊度
			_target.onload = () => {
				_target.style.opacity = '1';
				setTimeout(() => {
					_target.style.filter = 'blur(0px)';
				}, 300);
			};

			observerImg.unobserve(_target);
		}
	}
});
// 交叉观察器  bg
const observerBg = new IntersectionObserver((arr) => {
	//arr 是被观察的元素集合
	for (let i = 0, len = arr.length; i < len; i++) {
		let item = arr[i];

		// 通过这个属性判断是否在视口中
		if (item.isIntersecting) {
			// 图片标签
			const _target = item.target;
			_target.style.filter = 'blur(5px)';
			const url = item.target.getAttribute('data-url');
			const imgUrl = new URL(url, import.meta.url).href
			_target.style.backgroundImage = `url(${imgUrl})`;

			let img = new Image();
			img.src = imgUrl;
			img.onload = () => {
				_target.style.filter = 'blur(0px)';
			};

			observerBg.unobserve(_target);
		}
	}
});

export default lazy;
