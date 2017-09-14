var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var fs = require("fs");

var action=process.argv[2];
var query=process.argv[3];

var spotify=new Spotify({
	id: "7a99390b35d84c58b67b01274d4e9741",
	secret: "ab6e458645df4c49a8c040bedda464fb"
});

var tweet = function(){  
	var user = new Twitter(keys); 
	console.log("*",user); 
	user.get("statuses/user_timeline", {screen_name: "JasmineRudra"}, function(error, tweets, response){     
		if (error) {
			console.log("Error",error);
			return;
		}
		else{   
			var length=20;    
			if(tweets.length<20){
				length=tweets.length;
			}
			for (var i = 0; i < length; i++) {
				console.log(tweets[i].created_at);                  
				console.log(tweets[i].text);       
			}     
		}   
	}); 
};

var printNames=function(artistNames){
	return artistNames.name;
};

var spotify_song = function(songName){
	if (songName === undefined) {
		songName = "Waiting for the end to come";   
	}   
	spotify.search({type: "track",query: songName},function(err, data){       
		if (err){         
			console.log("Error occurred: " + err);         
			return;       
		}       
		var songs = data.tracks.items;       
		for (var i = 0; i < songs.length; i++){
			console.log(i);         
			console.log("artist(s): " + songs[i].artists.map(printNames));         
			console.log("song name: " + songs[i].name);         
			console.log("preview song: " + songs[i].preview_url);         
			console.log("album: " + songs[i].album.name);         
		}     
	}); 
};

var omdb_movie = function(movieName){
	console.log("here",movieName);
	if (movieName === undefined) {
		movieName = "Mr Nobody";   
	}   
	var api_omdb = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=40e9cece";  
	request(api_omdb, function(error, response, body) {
		if (error || response.statusCode != 200) {
			console.log("error");
			return;
		}
		else{
			var jsonData = JSON.parse(body);       
			console.log("Title: " + jsonData.Title);       
			console.log("Year: " + jsonData.Year);       
			console.log("Rated: " + jsonData.Rated);       
			console.log("IMDB Rating: " + jsonData.imdbRating);       
			console.log("Country: " + jsonData.Country);       
			console.log("Language: " + jsonData.Language);       
			console.log("Plot: " + jsonData.Plot);       
			console.log("Actors: " + jsonData.Actors);       
			console.log("Rotton Tomatoes URL: " + jsonData.tomatoURL);     
		}   
	}); 
};

var runCommand=function(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);     
		var dataArr = data.split(",");     
		if (dataArr.length === 2) {       
			take_action(dataArr[0], dataArr[1]);     
		}     
		else{
			take_action(dataArr[0],"");     
		}   
	});
}

var take_action= function(action,query){
	console.log("here2");
	if(action === "my-tweets"){
		tweet();
	}
	else if(action === "spotify-this-song"){
		spotify_song(query);
	}
	else if(action === "movie-this"){
		omdb_movie(query);
	}
	else if(action === "do-what-it-says"){
		runCommand();
	}
	else{
		console.log("Invalid Command");
	}
}
take_action(action,query);