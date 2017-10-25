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