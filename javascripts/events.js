"use strict";

const tmdb = require('./tmdb');
const dom = require('./dom');
const firebaseApi = require('./firebaseApi');

const pressEnter = () => {
	$(document).keypress((e) => {
		if (e.key === 'Enter') {
			let searchText = $('#searchBar').val();
			let query = searchText.replace(/\s/g,"%20");
			tmdb.searchMovies(query);
		}
	});
};

const getMahMovies = () => {
	firebaseApi.getMovieList().then((results) =>{
		dom.clearDom('moviesMine');
		dom.domString(results, tmdb.getImgConfig(),'moviesMine',false);
	}).catch((err) =>{
		console.log("error in getMovieList", err);
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
			getMahMovies();
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

const wisthListEvents = () => {
	$('body').on('click', '.wishlist', (e) => {
		console.log("wisthListEvents event", e);
		let mommy = e.target.closest('.movie');
		console.log('mommy', mommy);
		let newMovie = {
			"title": $(mommy).find('.title').html(),
			"overview": $(mommy).find('.overview').html(),
			"poster_path": $(mommy).find('.poster_path').attr('src').split('/').pop(),
			"rating": 0,
			"isWatched": false,
			"uid": ""
		};
		// console.log("newMovie", newMovie);
		firebaseApi.saveMovie(newMovie).then(() => {
			$(mommy).remove();
		}).catch((err) => {
			console.log('error in saveMovie', err);
		});
	});
};

const reviewEvents = () => {
	$('body').on('click', '.review', (e) => {
		console.log("wisthListEvents event", e);
		let mommy = e.target.closest('.movie');
		console.log('mommy find attr', $(mommy).find('.title'));
		let newMovie = {
			"title": $(mommy).find('.title').html(),
			"overview": $(mommy).find('.overview').html(),
			"poster_path": $(mommy).find('.poster_path').attr('src').split('/').pop(),
			"rating": 0,
			"isWatched": true,
			"uid": ""
		};
		// console.log("newMovie", newMovie);
		firebaseApi.saveMovie(newMovie).then(() => {
			$(mommy).remove();
		}).catch((err) => {
			console.log('error in saveMovie', err);
		});
	});
};

const deleteMovies = () => {
	$('body').on('click', '.delete', (e) => {
		let movieId = $(e.target).data('firebase-id');
		firebaseApi.deleteMovie(movieId).then((results) => {
			console.log("results", results);
			getMahMovies();
		}).catch((error) => {
			console.log("error in deleteMovies", error);
		});
		console.log("movieId", movieId);
	});
};

const init = () => {
	myLinks();
	googleAuth();
	pressEnter();
	wisthListEvents();
	reviewEvents();
	deleteMovies();
};

module.exports = {init};