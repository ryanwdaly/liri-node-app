require("dotenv").config();

var keys = require("./keys.js");
var args = process.argv;
args.shift();
args.shift();
var command = args[0];
args.shift();
var input = parseInput(args);   

exeCommand(command, input);

////////////////FUNCTIONS////////////////////

//Take the args string in and subsitiute " " for "+"
function parseInput(args) {
    var input = "";
    
    for(i = 0; i < args.length; i++) {
        if(i + 1 < args.length){
            input += args[i] + "+";
        } else {
            input += args[i];
        }
    }
    return input;
}

//Determin that action taken based on the command
function exeCommand(command, input) {
    // console.log(command)
    switch(command) {
        case "concert-this":
            searchArtist(input);
            break;
        case "spotify-this-song":
            searchSong(input);
            break;
        case "movie-this":
            searchMovie(input);
            break;
        case "do-what-it-says":
            searchTxtFile();
            break;
        default:
            console.log("Unidentified Command.");
    }
}
//Search bands in town via axios
function searchArtist(input){
    var axios = require("axios");
    var artist = input;

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(
        function(response) {
            for(i = 0; i < response.data.length; i++) {
                var venue = response.data[i].venue.name;
                var location = response.data[i].venue.city;
                var date = response.data[i].datetime;

                //format date
                var year = date.substring(0, 4);
                var month = date.substring(5, 7);
                var day = date.substring(8, 10);
                date = month + "/" + day + "/" + year; 
                
                console.log(
                    "\n" +
                    "Venue: " + venue + "\n",
                    "City: " + location + "\n",
                    "Date: " + date + "\n"
                );
            }
        }
    );
}  
//Searches node spotify api for "input"
function searchSong(input) {
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys.spotify);
    var song = input;

    spotify.search({ type: "track", query: song, limit: 1}, function(err, data) {
        if(err) {
            return console.log("Error occured: " + err);
        }

        var artist_name = data.tracks.items[0].album.artists[0].name;
        var song_name = data.tracks.items[0].name;
        var preview_link = data.tracks.items[0].preview_url;
        var album_name = data.tracks.items[0].album.name;

        console.log(
            "\n" +
            "Artist(s): " + artist_name + "\n",
            "Song: " + song_name + "\n",
            "Preview URL: " + preview_link + "\n",
            "Album: " + album_name + "\n"
        );
    });
};

//Search OMBD based on input for movie title
function searchMovie(input) {
    var axios = require("axios");
    var movie = input;

    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
    function(response) {
        var title = response.data.Title;
        var year = response.data.Year;
        var imdb_rating = response.data.imdbRating;
        var rt_rating = response.data.Ratings[1].Value;
        var country = response.data.Country;
        var language = response.data.Language;
        var plot = response.data.Plot;
        var actors = response.data.Actors;

        console.log(
            "\n" +
            "Title: " + title + "\n",
            "Year: " + year + "\n",       
            "IMDB Rating: " + imdb_rating + "\n",
            "Rotten Tomatoes Rating: " + rt_rating + "\n",
            "Country: " + country + "\n",
            "Language: " + language + "\n",
            "Plot: " + plot + "\n",
            "Actors: " + actors + "\n"
        );
    });  
};

//search a txt file named "random.txt" for inputs
function searchTxtFile() {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        } else {
            var inputArr = data;
            inputArr = inputArr.split(",");
            var command = inputArr[0];
            inputArr.shift();
            var input = parseInput(inputArr);
            exeCommand(command, input);
        }
    });
}