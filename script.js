
var movieInformation;
var phaseInformation;

var releaseInformation;
var titleInfo;
var reviewInformation;

var mediaElement;
var phaseButton;
var reviewElement;
var returnElement;
var instructElement;
var deleteTheadNumber;
var oldHeader;

var noReviewElement;

const posterPathURL = 'https://image.tmdb.org/t/p/original';
const API_KEY = '?api_key=ce1dc6c891349801c4270eeaafa473bd';
const WEBSITEURL = 'https://api.themoviedb.org/3/list/';

const REVIEWURL = 'https://api.themoviedb.org/3/movie/';
const REVIEWTVURL = 'https://api.themoviedb.org/3/tv/';
const REVIEWPART = '/reviews';
const REVIEWEND = '&language=en-US&page=1';
var reviewInformationURL;

function pickPhaseLink(phase) {
    
    switch (phase) {

        case 'phase1':
            phaseInformation = '8190650'
            pullMovieInformation(phaseInformation);
            break;
        case 'phase2':
            phaseInformation = '8191873'
            pullMovieInformation(phaseInformation);
            break;
        case 'phase3':
            phaseInformation = '8191877'
            pullMovieInformation(phaseInformation);
            break;
        case 'phase4':
            phaseInformation = '8191878'
            pullMovieInformation(phaseInformation);
            break;    
        }
}

function pullMovieInformation(phaseInformation) {

    fetch(WEBSITEURL + phaseInformation + API_KEY)
    .then(result => result.json())
    .then((output) => {
        //console.log('Output: ', output.items);
        movieInformation = output.items;
        console.log(movieInformation);

        placeMovieInformation(movieInformation);
        
     }).catch(err => console.error(err));

    }

function placeMovieInformation(movieInformation) {

    for (i = 0; i < movieInformation.length; i++) {
        
        switch(movieInformation[i].release_date) {
            
            case undefined:

                switch (movieInformation[i].first_air_date) {
                    case undefined:
                        releaseInformation = "TBD";
                        break;
                    case '':
                        releaseInformation = "TDB";
                        break;
                    default:
                        releaseInformation = movieInformation[i].first_air_date;
                        break;
                }

                break;
            default:
                releaseInformation = movieInformation[i].release_date;
                break;

        }

        switch (movieInformation[i].title){
            case undefined:
                titleInfo = movieInformation[i].name;
                break;
            default:
                titleInfo = movieInformation[i].title;
                break;
        }

        if (movieInformation[i].vote_count =='0') {
            reviewAverage = "There are no reviews available for this movie."
        } else {
            reviewAverage = movieInformation[i].vote_average;
        }

        var fullPosterPathURL = posterPathURL + movieInformation[i].poster_path;

        var table = document.getElementById('mediaTable');
        var tr = document.createElement('tr');
        tr.innerHTML += '<td>' + titleInfo + '</td>' +  '<td> <img src="' + fullPosterPathURL + '"/></td>' +'<td>' + movieInformation[i].overview + '</td>' +  '<td>' + movieInformation[i].media_type + '</td>' +  '<td>' + releaseInformation + '</td>' + '<td> <a href="#" onclick="reviewTableSetup(\'' + movieInformation[i].id + '\',\'' + movieInformation[i].media_type + '\')">' + reviewAverage + '</a></td>';
                    table.appendChild(tr);

    }
}

function createReviewInformationURL(movieID, movieORTV) {

    if (movieORTV == "tv") {
        reviewInformationURL = REVIEWTVURL + movieID + REVIEWPART + API_KEY + REVIEWEND;
    }
    else {
        reviewInformationURL = REVIEWURL + movieID + REVIEWPART + API_KEY + REVIEWEND;
    }
    
    (async() => {
    reviewInformationRAW = "";
    reviewInformation = "";
    reviewInformationRAW = await pullReviewInformation(reviewInformationURL);
    reviewInformation = reviewInformationRAW.results;
    console.log(reviewInformationRAW);
    console.log(reviewInformation);
    placeReviewInformation(reviewInformation);
    })();



    }

function pullReviewInformation(reviewURL) {
    return fetch(reviewURL)
    .then(response => response.json());
}

function placeReviewInformation(reviewInformation) {


    if (reviewInformation.length < 1) {
        noReviewElement = document.getElementById("noReviewsExplanation");
        noReviewElement.removeAttribute("hidden");
    } else {

        var tableReview = document.getElementById('reviewTable');
        var individualRating;
        var individualRatingAssessment = reviewInformation[0].author_details.rating;

        if (individualRatingAssessment = 'null') {
            individualRating = "No Rating"
        }
        else {
            individualRating = individualRatingAssessment;
        }
        var thead = document.createElement('thead');
        tableReview.appendChild(thead);
        thead.innerHTML += ' <tr><td width="10%">' + reviewInformation[0].author_details.username + '</td><td width="10%" row >' + individualRating + '</td><td width="80%" rowspan="2">' + reviewInformation[0].content + '</td></tr><tr><td colspan="2">' + reviewInformation[0].created_at + '</td></tr><tr><td colspan="3"><a href="' + reviewInformation[0].url + '">' + reviewInformation[0].url + '</a></td></tr>';
        deleteTheadNumber = reviewInformation.length;
    
        for (i = 1; i < reviewInformation.length; i++) {

            var individualRating;
            var individualRatingAssessment = reviewInformation[i].author_details.rating;

            if (individualRatingAssessment = 'null') {
                individualRating = "No Rating"
            }
            else {
                individualRating = individualRatingAssessment;
            }
    
            var thead = document.createElement('thead');
            tableReview.appendChild(thead);
            thead.innerHTML += ' <tr><td width="10%">' + reviewInformation[i].author_details.username + '</td><td width="10%" row >' + individualRating + '</td><td width="80%" rowspan="2">' + reviewInformation[i].content + '</td></tr><tr><td colspan="2">' + reviewInformation[i].created_at + '</td></tr><tr><td colspan="3"><a href="' + reviewInformation[i].url + '">' + reviewInformation[i].url + '</a></td></tr>';
    
        }
    }



}

function reviewTableSetup(movieID, movieORTV){

    mediaElement = document.getElementById("mediaTable");
    phaseElement = document.getElementById("phaseButton");
    reviewElement = document.getElementById("reviewTable");
    returnElement = document.getElementById("returnButton");
    instructElement = document.getElementById("phaseInstructions");
    phaseHeaderElement = document.getElementById("phaseHeader");

    noReviewElement = document.getElementById("noReviewsExplanation");


    if (mediaElement.hasAttribute("hidden")) {

        mediaElement.removeAttribute("hidden");
        phaseElement.removeAttribute("hidden");
        instructElement.removeAttribute("hidden");
        reviewElement.setAttribute("hidden", true);
        returnElement.setAttribute("hidden", true);
        phaseHeaderElement.innerHTML = oldHeader;

        noReviewElement.setAttribute("hidden", true);

        for (i = 0; i < deleteTheadNumber; i++) {
            reviewElement.deleteTHead();
        }

    } else {

        mediaElement.setAttribute("hidden", true);
        phaseElement.setAttribute("hidden", true);
        instructElement.setAttribute("hidden", true);
        reviewElement.removeAttribute("hidden");
        returnElement.removeAttribute("hidden");
        createReviewInformationURL(movieID, movieORTV);

        oldHeader = phaseHeaderElement.innerHTML;
        phaseHeaderElement.innerHTML = "Reviews";

    }


}

function removeReviewTable() {



}