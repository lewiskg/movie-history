"use strict";



const domString = (movieArray) => {
	// console.log('movies', movieArray);
	let domStrang = "";
	for (let i = 0; i < movieArray.length; i++) {
		if (i % 3 === 0) {
			domStrang += `<div class="row">`;
		}
		domStrang +=  `<div class="col-sm-6 col-md-4">`;
		domStrang +=    `<div class="thumbnail">`;
		domStrang +=     `<img src="..." alt="...">`;
		domStrang +=      `<div class="caption">`;
		domStrang +=        `<h3>${movieArray[i].original_title}</h3>`;
		domStrang += 		`<p>${movieArray[i].overview}</p>`;
		domStrang +=        `<p><a href="#" class="btn btn-primary" role="button">Review</a> <a href="#" class="btn btn-default" role="button">Watch List</a></p>`;
		domStrang +=      `</div>`;
		domStrang +=    `</div>`;
		domStrang +=  `</div>`;
		if (i % 3 === 2 || i === movieArray.length -1 ) {
			domStrang += `</div>`;
		}
	}
	printToDom(domStrang);
};


const printToDom = (strang) => {
	$("#movies").append(strang);

};


module.exports = {domString};