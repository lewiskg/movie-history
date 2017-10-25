(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

const apiKeys = () => {

	return new Promise((resolve, reject) => {
		$.ajax('./db/apiKeys.json').done((data) => {
			resolve(data.apiKeys);
		}).fail((error) => {
			reject(error);
		});
	});
};

const retrieveKeys = () => {
	apiKeys().then((results) => {
		tmdb.setKey(results.tmdb.apiKey);
		firebaseApi.setKey(results.firebaseKeys);
		firebase.initializeApp(results.firebaseKeys);
		// console.log("firebase apps?", firebase.apps);
	}).catch((error) => {
		console.log("error in retrieve keys", error);
	});
};

module.exports = {retrieveKeys};
},{"./firebaseApi":4,"./tmdb":6}],2:[function(require,module,exports){
"use strict";

const domString = (movieArray, imgConfig, divName, search) => {
	let domStrang = "";
	// console.log('movieArray', movieArray);
		for (let i = 0; i < movieArray.length; i++) {
		if (i % 3 === 0) {
			domStrang += `<div class="row">`;
		}
		domStrang +=  `<div class="col-sm-6 col-md-4 movie">`;
		domStrang +=    `<div class="thumbnail">`;
		if (!search) {
			domStrang +=	`<button class="btn btn-default delete" data-firebase-id="${movieArray[i].id}">X</button>`;
		}
		domStrang +=     `<img class="poster_path" src="${imgConfig.base_url}/w342/${movieArray[i].poster_path}" alt="">`;
		domStrang +=      `<div class="caption">`;
		domStrang +=        `<h3 class="title">${movieArray[i].title}</h3>`;
		domStrang += 		`<p class="overview">${movieArray[i].overview}</p>`;
		if (search) {
			domStrang +=        `<p><a class="btn btn-primary review" role="button">Review</a> <a href="#" class="btn btn-default wishlist" role="button">Watch List</a></p>`;
		} else {
			domStrang += `<p>Rating ${movieArray[i].rating}</p>`;
		}
		domStrang +=      `</div>`;
		domStrang +=    `</div>`;
		domStrang +=  `</div>`;
		if (i % 3 === 2 || i === movieArray.length -1 ) {
			domStrang += `</div>`;
		}
	}
	printToDom(domStrang, divName);
};

const printToDom = (strang, divName) => {
	// $("#movies").append(strang);
	$(`#${divName}`).append(strang);

};

const clearDom = (divName) => { 
	// $("#movies").empty("");
	// $("#searchBar").val("");
	$(`#${divName}`).empty();
};

module.exports = {domString, clearDom};
},{}],3:[function(require,module,exports){
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
		dom.domString(results, tmdb.getImgConfig(),'moviesMine');
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
},{"./dom":2,"./firebaseApi":4,"./tmdb":6}],4:[function(require,module,exports){
"use strict";


let firebaseKey = "";
let userUid = "";

const setKey = (key) => {
	firebaseKey = key;
};

//Firebase: GOOGLE - Use input credentials to authenticate user.
  let authenticateGoogle = () => {
    return new Promise((resolve, reject) => {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then((authData) => {
        	userUid = authData.user.uid;
            resolve(authData.user);
        }).catch((error) => {
            reject(error);
        });
    });
  };

const getMovieList = () => {
  let movies = [];
  console.log("in getMovieList", userUid);
  return new Promise((resolve, reject) =>{ 
    $.ajax(`${firebaseKey.databaseURL}/movies.json?orderBy="uid"&equalTo="${userUid}"`).then((fbMovies) =>{
      if(fbMovies != null){
        Object.keys(fbMovies).forEach((key) =>{
          fbMovies[key].id = key; //fbMovies["mvoies0"].id = "movies0"
          movies.push(fbMovies[key]);
        });
      }
      resolve(movies);
    }).catch((err) =>{
      reject(err);
    });
  });
};

const saveMovie = (movie) => {
  movie.uid = userUid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "POST",
      url: `${firebaseKey.databaseURL}/movies.json`,
      data: JSON.stringify(movie)
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      reject(error);
    });
  });
};

const deleteMovie = (movieId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
        method: "DELETE",
        url: `${firebaseKey.databaseURL}/movies/${movieId}.json`,
    }).then((fbMovies) => {
      resolve(fbMovies);
    }).catch((err) => {
    });
  });
};

module.exports = {setKey, authenticateGoogle, getMovieList, saveMovie, deleteMovie};
},{}],5:[function(require,module,exports){
"use strict";

let dom = require('./dom');

// let singleMovie = {
// 		adult:false,
// 		backdrop_path:"/c2Ax8Rox5g6CneChwy1gmu4UbSb.jpg",
// 		genre_ids:[28, 12, 878, 14],
// 		id:140607,
// 		original_language:"en",
// 		original_title:"Star Wars: The Force Awakens",
// 		overview:"Thirty years after defeating the Galactic Empire, Han Solo and his allies face a new threat from the evil Kylo Ren and his army of Stormtroopers.",
// 		popularity:49.408373,
// 		poster_path:"/weUSwMdQIa3NaXVzwUoIIcAi85d.jpg",
// 		release_date:"2015-12-15",
// 		title:"Star Wars: The Force Awakens",
// 		video:false,
// 		vote_average:7.5,
// 		vote_count:7965
// 	};

// 	dom.domString([singleMovie, singleMovie, singleMovie, singleMovie]);

let events = require('./events');
let apiKeys = require('./apiKeys');

apiKeys.retrieveKeys();
events.init();


},{"./apiKeys":1,"./dom":2,"./events":3}],6:[function(require,module,exports){
"use strict";

const dom = require('./dom');
// const apiKeys = require('./apiKeys');

let tmdbKey;
let imgConfig;


const searchTMDB = (query) => {
	return new Promise((resolve, reject) => {
		$.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false&query=${query}`).done((data) => {
			resolve(data.results);
		}).fail((error) => {
			reject(error);
			});
	});
};

const tmdbConfiguration = () => {
  return new Promise((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`).done((data) => {
      resolve(data.images);
    }).fail((error) => {
      reject(error);
    });
  });
};

const getConfig = () => {
  tmdbConfiguration().then((results) => {
    imgConfig = results;
    // console.log(imgConfig);
  }).catch((error) => {
    console.log("Error in getConfig", error);
  });
};

const searchMovies = (query) => {
	// console.log("firebase apps?", firebase.apps);
	searchTMDB(query).then((data) => {
		showResults(data);
	}).catch((error) => {
		console.log("error in search Movies", error);
	});
};

const setKey = (apiKey) => {
	tmdbKey = apiKey;
	getConfig();
};

const showResults = (movieArray) => {
	dom.clearDom();
	dom.domString(movieArray, imgConfig, 'movies');
};

const getImgConfig = () => { console.log('in getImgConfig', imgConfig);
  return imgConfig;
};

module.exports = {setKey, searchMovies, getImgConfig};
},{"./dom":2}]},{},[5]);
