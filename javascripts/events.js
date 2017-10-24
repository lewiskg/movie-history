"use strict";

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');
const dom = require('./dom');

const pressEnter = () => {
	$(document).keypress((e) => {
		if (e.key === 'Enter') {
			let searchText = $('#searchBar').val();
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
			firebaseApi.getMovieList().then((results) => {
				console.log("results", results);
				dom.clearDom('myMovies');
				dom.domString(results, tmdb.getImgConfig, 'myMovies');
			}).catch((err) => { 
				console.log("error in getMoviesList()", err);
			});
		} else if (idLink === 'auth-link') {
			$('#input-search').addClass('hide');
			$('#myMovies').addClass('hide');
			$('#authScreen').removeClass('hide');
		}
	});
};

const googleAuth = () => {
	$('#googleButton').click((e) => {
		firebaseApi.authenticateGoogle().then((result) => {
			console.log("result", result);
		}).catch((err) => {
			console.log("error in authenticateGoogle", err);
		});
	});
};


module.exports = {pressEnter, myLinks, googleAuth};