const KEYS = {
	FAVORITES: 'favorites',
	CURRENT_CITY: 'currentCity',
};

const Storage = {
	setFavoriteCities(favoriteCitiesSet) {
		const favoriteCities = [...favoriteCitiesSet];
		localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favoriteCities));
	},
	getFavoriteCities() {
		return JSON.parse(localStorage.getItem(KEYS.FAVORITES));
	},
	setCurrentCity(cityName) {
		localStorage.setItem(KEYS.CURRENT_CITY, JSON.stringify(cityName));
	},
	getCurrentCity() {
		return JSON.parse(localStorage.getItem(KEYS.CURRENT_CITY));
	},
};

export default Storage;
