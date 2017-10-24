"use strict";

const tmdb = require('./tmdb');

const pressEnter = () => {
	$(document).keypress((e) => {
		if (e.key === 'Enter') {
			let searchText = $('#searchBar').val(); console.log(searchText);
			let query = searchText.replace(/\s/g,"%20");
			tmdb.searchMovies(query);
		}
	});
};

const myLinks = () => {
	$(document).on('click', function(e) {
		let idLink = e.target.id;
		if(idLink === 'search-link') {
			$('#input-search').removeClass('hide');
			$('#myMovies').addClass('hide');
			$('#authScreen').addClass('hide');
		} else if(idLink ==='mymovies-link') {
			$('#input-search').addClass('hide');
			$('#myMovies').removeClass('hide');
			$('#authScreen').addClass('hide');
		} else if (idLink === 'auth-link') {
			$('#input-search').addClass('hide');
			$('#myMovies').addClass('hide');
			$('#authScreen').removeClass('hide');
		}
	});
};

module.exports = {pressEnter, myLinks};