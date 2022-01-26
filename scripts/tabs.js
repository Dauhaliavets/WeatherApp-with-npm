import UI from './view';

export default function initTabs() {
	UI.tabsBtns.forEach((btn) => {
		btn.addEventListener('click', clickBtnTab);
	});

	function clickBtnTab(event) {
		const targetTab = event.target.dataset.tab;

		showSelectedItem(UI.tabsBtns, targetTab);
		showSelectedItem(UI.tabsItems, targetTab);
	}

	function showSelectedItem(selector, target) {
		selector.forEach((elem) => {
			elem.classList.remove('active');

			if (elem.dataset.tab === target) {
				elem.classList.add('active');
			}
		});
	}
}
