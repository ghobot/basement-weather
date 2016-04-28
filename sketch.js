// A wind direction vector\

var position;
var weatherCondition;
var weatherID;
var system;
var life;
var clouds = [];


function setup() {
  createCanvas(windowWidth, windowHeight - .2 * (windowHeight));
  // Request the data from openweathermap
  var url = 'http://api.openweathermap.org/data/2.5/weather?zip=10016,us&units=imperial&APPID=7bbbb47522848e8b9c26ba35c226c734';
  loadJSON(url, gotWeather);
  life = 500;
  var numClouds = 10;
  system = new ParticleSystem(createVector(width / 2, 50));
  for (var i = 0; i < numClouds; i++) {
    clouds[i] = new Cloud();
  }
}

function draw() {
  background(0);

  if (weatherID == "rain") {
   // console.log("it's raining");
    system.addParticle();
    system.run();
  }

  if (weatherID == "clouds") {
    //console.log("it's cloudy");
    
    for (var i = 0; i < clouds.length; i++) {
      clouds[i].update()
      clouds[i].display();
      
    }
  }
}

function Cloud() {

  this.x = random(0, width);
  this.y = random(height*.1,height * .3);
  this.cloudLength = random(200,400);
  this.speed = random(0.1,1);
  this.opacity = random(240,255);
  this.update = function() {
    this.x += this.speed;
  }

  this.display = function() {
    fill(255,this.opacity);
    noStroke();
    ellipse(this.x, this.y, this.cloudLength, 50);
    ellipse(this.x - 25, this.y - 50, this.cloudLength / 2, this.cloudLength / 2);
    ellipse(this.x + 30, this.y - 50, this.cloudLength / 3, this.cloudLength / 3);
  }
}

function gotWeather(weather) {
  console.log(weather);
  // Get the angle (convert to radians)
  var angle = radians(Number(weather.wind.deg));
  // Get the wind speed
  var windmag = Number(weather.wind.speed);

  // get the weather
  var description = weather.weather[0].description;
  var main = weather.weather[0].main;
  var groupID = weather.weather[0].id.toString();
  // Display as HTML elements

  var temperatureDiv = createDiv(floor(weather.main.temp) + '&deg;');
  //  var windDiv = createDiv("WIND " + windmag + " <small>MPH</small>");
  var weatherDiv = createDiv("Weather: " + description).addClass("weather");
  // Make a vector
  //wind = p5.Vector.fromAngle(angle);

  if (groupID == "801" || groupID == "802" || groupID == "803" || groupID == "804") {
    weatherID = "clouds";

  } else if (groupID.charAt[0] == "2" || groupID.charAt[0] == "3" || groupID.charAt[0] == "5") {
    weatherID = "rain";
  }
}

//clouds



// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  //this.position = position.copy();
  this.position = (createVector(random(0, width), -10));
  this.lifespan = life;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  stroke(200, this.lifespan);
  strokeWeight(0);
  var fade = map(this.lifespan, 0, life, 0, 255);
  fill(0, 0, 255, this.lifespan);
  ellipse(this.position.x, this.position.y, 10, 10);
};

// Is the particle still useful?
Particle.prototype.isDead = function() {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};