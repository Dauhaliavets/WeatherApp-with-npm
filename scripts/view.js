const UI = {
	FORM: {
		form: document.querySelector('.form__search'),
		formInput: document.querySelector('.form__search-input'),
		formBtn: document.querySelector('.form__search-button'),
	},
	tabsItems: document.querySelectorAll('.tabs__item'),
	tabsBtns: document.querySelectorAll('.tabs__btn'),
	temperature: document.querySelectorAll('.temperature span'),
	location: document.querySelectorAll('.location__name'),
	weatherIcon: document.querySelector('.icon-now'),
	likeIcon: document.querySelector('.like__icon'),
	locationsList: document.querySelector('.locations__list'),
	DETAILS: {
		feelsLike: document.querySelector('.feels__like span'),
		weather: document.querySelector('.weather span'),
		sunrise: document.querySelector('.sunrise span'),
		sunset: document.querySelector('.sunset span'),
	},
	FORECAST_CARDS: document.querySelector('.forecast__cards'),
};

export default UI;
