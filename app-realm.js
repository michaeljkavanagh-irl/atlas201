
// Define the Realm client (***** YOU MUST UPDATE YOUR app_id ***** )
const app_id = 'workshop-201-realm-wcqaj';
const app = new Realm.App({ id: app_id});

/* 
    Define the GraphQL Query used to retrieve data (This is used by
     the getMovies() function below)
    
    If you wanted to change the fields/data retrieved from the API,
     you could do so by altering this query
*/
/* const gqlQuery = `
query {
    movies {
        _id
        title
        year
        plot
	rated
    }
}`; */

// Call the getMovies() function to retrieve the movies and update the web page
getMovies();

 
// Define the getMovies function
async function getMovies() {

    const credentials = Realm.Credentials.anonymous();
    try {
      // Authenticate the user
      const user = await app.logIn(credentials);
        const resp = await axios({
           //url: 'https://realm.mongodb.com/api/client/v2.0/app/' + app_id + '/graphql',
           url: 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/' + app_id + '/service/Atlas201_RestAPI/incoming_webhook/Atlas201_Webhook',
           method: 'get',
           //method: 'post',
           headers: {
            'Authorization': `Bearer ${user._accessToken}`
           }/*,
           /* data: {
            query: gqlQuery,
           } */
       });

       /*
           The query returns metadata regarding the query as well as the data itself
           As we just want to work with the data, we are pulling the movies data into its own variable (movies)
           This variable is an array of movie objects */

       var movies = resp.data; 
       //var movies = resp.data.data.movies;
       console.log(movies);
       for (var i = 0; i < movies.length; i++) {
        addToList(movies[i]);
    }
    } 
    catch(err) {
      console.error(err);
    }
      
};

/*
    The addToList function takes a movie object parameter and generates an HTML string to add to the webpage
    It creates some special formating around the 'title' field in the movie object
    All remaining fields are added to the HTML page as key value pairs
*/
function addToList(movie) {
    // Initialise the htmlStr variable
    var htmlStr = "";

    // If there is a title field in this movie, add it to htmlStr with special formatting
    if ("title" in movie) {
        htmlStr += `<b><p style="color:green; font-size: 1.8em;">${movie["title"]}</p></b>`;
        delete movie["title"];
    }

    // For all other fields in the object, add them to htmlStr with the field name in bold, and the field value in plain text
    for (field in movie) {   
           
        htmlStr += `<b>${field}:</b> ${movie[field]} <br />`;

    }

    htmlStr += `<hr />`;
    document.getElementById("results").innerHTML += htmlStr;

};

function deleteMovie(e) {
    console.log('Just got call to delete: ' + Object.values(e));
}
