// Variables needed for Movie Timeline Table
let movieInformation;
let phaseInformation;
let releaseInformation;
let titleInfo;
let reviewInformation;
let phaseHeader = document.getElementById("phaseHeader");

// Variables needed for Review Table
let mediaElement;
let phaseButton;
let reviewElement;
let returnElement;
let instructElement;
let deleteTheadNumber;
let oldHeader;
let noReviewElement;

// Variables needed for API call
const posterPathURL = 'https://image.tmdb.org/t/p/original';
const WEBSITEURL = 'https://api.themoviedb.org/3/list/';
const REVIEWURL = 'https://api.themoviedb.org/3/movie/';
const REVIEWTVURL = 'https://api.themoviedb.org/3/tv/';
const REVIEWPART = '/reviews';
const REVIEWEND = '&language=en-US&page=1';
let reviewInformationURL;


function pickPhaseLink(phase) {

    let phaseHeader = document.getElementById("phaseHeader");

    switch (phase) {

        case 'phase1':
            phaseInformation = '8190650'
            phaseHeader.innerHTML = "Phase 1";
            pullMovieInformation(phaseInformation);
            break;
        case 'phase2':
            phaseInformation = '8191873'
            phaseHeader.innerHTML = "Phase 2";
            pullMovieInformation(phaseInformation);
            break;
        case 'phase3':
            phaseInformation = '8191877'
            phaseHeader.innerHTML = "Phase 3";
            pullMovieInformation(phaseInformation);
            break;
        case 'phase4':
            phaseInformation = '8191878'
            phaseHeader.innerHTML = "Phase 4";
            pullMovieInformation(phaseInformation);
            break;
    }
}

function pullMovieInformation(phaseInformation) {

    fetch(WEBSITEURL + phaseInformation + config.apiKey)
        .then(result => result.json())
        .then((output) => {

            movieInformation = output.items;
            console.log(movieInformation);
            movieInformation.forEach(placeMovieInformation);

        }).catch(err => console.error(err));

}

function placeMovieInformation(movieInformation) {

    switch (movieInformation.release_date) {

                    case undefined:
        
                        switch (movieInformation.first_air_date) {
                            case undefined:
                                releaseInformation = "TBD";
                                break;
                            case '':
                                releaseInformation = "TDB";
                                break;
                            default:
                                releaseInformation = movieInformation.first_air_date;
                                break;
                        }
        
                        break;
                    default:
                        releaseInformation = movieInformation.release_date;
                        break;
        
                }
        
                switch (movieInformation.title) {
                    case undefined:
                        titleInfo = movieInformation.name;
                        break;
                    default:
                        titleInfo = movieInformation.title;
                        break;
                }
        
                if (movieInformation.vote_count == '0') {
                    reviewAverage = "There are no reviews available for this movie."
                } else {
                    reviewAverage = movieInformation.vote_average;
                }
        
                let fullPosterPathURL = posterPathURL + movieInformation.poster_path;
        
                let table = document.getElementById('mediaTable');
                let tr = document.createElement('tr');
                tr.innerHTML += '<td>' + titleInfo + '</td>' + '<td> <img src="' + fullPosterPathURL + '" alt="' + titleInfo + '" /></td>' + '<td>' + movieInformation.overview + '</td>' + '<td>' + movieInformation.media_type + '</td>' + '<td>' + releaseInformation + '</td>' + '<td> <a href="#" onclick="reviewTableSetup(\'' + movieInformation.id + '\',\'' + movieInformation.media_type + '\')">' + reviewAverage + '</a></td>';
                table.appendChild(tr);

}

function createReviewInformationURL(movieID, movieORTV) {

    if (movieORTV == "tv") {
        reviewInformationURL = REVIEWTVURL + movieID + REVIEWPART + config.apiKey + REVIEWEND;
    }
    else {
        reviewInformationURL = REVIEWURL + movieID + REVIEWPART + config.apiKey + REVIEWEND;
    }

    (async () => {
        reviewInformationRAW = "";
        reviewInformation = "";
        reviewInformationRAW = await pullReviewInformation(reviewInformationURL);
        reviewInformation = reviewInformationRAW.results;
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

        let tableReview = document.getElementById('reviewTable');

        let thead = document.createElement('thead');
        tableReview.appendChild(thead);
        deleteTheadNumber = reviewInformation.length;

        reviewInformation.forEach(placeReviewInformation2);

        function placeReviewInformation2(reviewInformation) {

            let individualRating;
            let individualRatingAssessment = reviewInformation.author_details.rating;

            if (individualRatingAssessment == 'null') {
                individualRating = "No Rating"
            }
            else {
                individualRating = individualRatingAssessment;
            }

            let thead = document.createElement('thead');
            tableReview.appendChild(thead);
            thead.innerHTML += ' <tr><td width="10%">' + reviewInformation.author_details.username + '</td><td width="10%" row >' + individualRating + '</td><td width="80%" rowspan="2">' + reviewInformation.content + '</td></tr><tr><td colspan="2">' + reviewInformation.created_at + '</td></tr><tr><td colspan="3"><a href="' + reviewInformation.url + '">' + reviewInformation.url + '</a></td></tr>';

        }
    }
}

function reviewTableSetup(movieID, movieORTV) {

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