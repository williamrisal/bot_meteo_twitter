// Nous commencons par inclure les librairies que nous avons installées.
var querystring = require('querystring');
var request     = require("request");
var mpg321      = require('mpg321');
tweet = ""
const translate = require('translate-api');
var Twit = require('twit');
var d = new Date();
var hours = d.getHours();
var second = d.getSeconds();
var minute = d.getMinutes();

var openWeatherMapURL = `http://api.openweathermap.org/data/2.5/weather?q=Marseille&appid=6db93a028b58851dcd81193539d903de&units=metric`

var T = new Twit({
    consumer_key:         '5nWtQa0YzwTDObJ5k8vP49MdZ',
    consumer_secret:      'RHSPuufhlYsTsJ2uH8njabiQp6ylszhxrPabfCTbbxSl6MGgCW',
    access_token:         '1399025356745629697-IBaMZ7MnPuhqs9J9OaZYfTUQ17u8gA',
    access_token_secret:  's3mfzgJrtrpfH5b9t2LnlbaEXsIAillYGJyhwAQXtEica',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })
  var fete = `https://fetedujour.fr/api/v2/TtoQGxRJSw8fketS/json-normal?api_key=TtoQGxRJSw8fketS&f=json&t=normal`
  var coucher = `http://api.sunrise-sunset.org/json?lat=43.1742,00&lng=-5%C2%B02219,20`
  var text_fete = ""
  var txt_coucher = ""
  request({
    url: coucher,
    json: true // Nous recevrons un JSON
  }, function (error, response, coucher_) {
      txt_coucher = coucher_.results.sunset
      txt_coucher = txt_coucher.charAt(0)

  request({
    url: fete,
    json: true // Nous recevrons un JSON
  }, function (error, response, fete_) {
      text_fete = fete_.name

// Nous procédons ensuite à la requête de l'API.
request({
  url: openWeatherMapURL,
  json: true // Nous recevrons un JSON
}, function (error, response, resp) {

  // Si tout s'est bien passé...
  if (!error && response.statusCode === 200) {

    // Nous construisons le texte à réciter.
    var text = "Bulletin météo :\n "

    // Le temps actuel se trouve dans la variable suivante:
    if (resp.weather[0].description == "Clouds") {
        text = "Un temps Nuageux ☁️"
    }
    if (resp.weather[0].description == "overcast clouds") {
        text = "Légerement Nuageux ☁️"
    }
    console.log(resp)
    // Ensuite, nous ajoutons la température pour conclure la phrase. Notez, que nous l'arrondissons.
    text += ".\nIl fait actuellement une température de "+ Math.round(resp.main.temp) +" degrés"

    // Enfin, nous construisons la requête pour le service Text-To-Speech.
    var result = querystring.stringify({
      tl: "fr",
      q:  text,
      ie: "UTF-8"
    });
    // Dans la version de développement, nous pourrons l'afficher, même si cela n'a visiblement pas grand intêret en prod.
    console.log("Météo Marseille :");
    console.log(text);
    tweet = text
    proc = mpg321()
    T.post('statuses/update', { status: 'Bonjour,  Bulletin météo du jour a Marseille:\n\n' + text + "\n\nle soleil se couchera a "+ txt_coucher + "h du soir" + "\n\nAjourdhui nous fêtons la " + text_fete + "\nNous vous souhaitons une agréable journée"}, function(err, data, response) {
        console.log(data)
      });
  } else {

    // Si une erreur s'est produite, on la note
    console.log("Une erreur est survenue.");
  }
})})})