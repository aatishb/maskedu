// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let particles = [];
    let mouseParticle;
    let mouseOnScreen = false;
    let target;
    let emojis = {};
    let width, height;

    // VARIABLES
    let initialParticles = 50; 
    let particleSize = 30;
    let drag = 0.99;
    let bounciness = 0.2;
    let range = 125;

    let paused = false;
    let numint0, numint1, numint2;

    function checkIfMouseIsOverCanvas() {
      if (!mouseOnScreen) {
        if (p.mouseX > -particleSize/2 && p.mouseX < p.width + particleSize/2 && p.mouseY > -particleSize/2 && p.mouseY < p.height + particleSize/2) {
          mouseOnScreen = true;
        }
      }

      if (mouseOnScreen) {
        if (!(p.mouseX > -particleSize/2 && p.mouseX < p.width + particleSize/2 && p.mouseY > -particleSize/2 && p.mouseY < p.height + particleSize/2)) {
          mouseOnScreen = false;        
        }
      }      
    }

    p.preload = function() {
      emojis.neutral = p.loadImage('assets/neutral.png');
      emojis.mask = p.loadImage('assets/mask.png');
    }

    p.setup = function() {
      target = parent.$el;
      width = target.clientWidth;
      height = width * parent.data.height;
      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
      p.noStroke();
      p.strokeWeight(2);
      p.imageMode(p.CENTER);

      createParticles(width*height);

    };

    p.draw = function() {

      if (!paused) {
        p.background(0, 0, 51);

        for (let particle of particles) {
          particle.update();
        }

        if (mouseOnScreen) {
          mouseParticle.update(p.mouseX, p.mouseY);
        }

        let particleArray = mouseOnScreen ? [...particles, mouseParticle] : particles;

        drawEdges(particleArray, range);

        for (let p of particleArray) {
          p.display();
        }

        checkIfMouseIsOverCanvas();

        let total = numint0 + numint1 + numint2;
        if (p.frameCount %  60 == 0) {
          parent.$emit('update:numint0', numint0/total);
          parent.$emit('update:numint1', numint1/total);
          parent.$emit('update:numint2', numint2/total);
        }
      }

    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(val, oldVal) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
      updateParticles(width);
      paused = parent.data.paused;
    };

    p.mouseClicked = function() {
      
    }

    // this is a new function we've added to p5
    // it runs only when the canvas scrolls in or out of the page view
    p.visibilityChanged = function(isVisible) {
      //console.log('visibility changed to ', isVisible, Date.now());
      if (isVisible) {
        p.loop()
      } else {
        p.noLoop();
      }
    };

    // particle class
    function particle(isMasked, isMouse = false) {

      this.y = p.random(0, p.height);
      this.x = p.random(0, p.width);
      this.angle = p.random(0, 2*Math.PI);
      this.wander = bounciness;
      this.v0 = 0;
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);
      this.isMouse = isMouse;
      this.isMasked = isMasked;
      this.face =  isMasked ? emojis.mask : emojis.neutral;

      this.update = function(posX, posY) {
        
        if (posX && posY) {

          // for mouseParticle
          this.x = posX;
          this.y = posY;
        
        } else {
 
          // brownian motion
          this.angle = p.random(2 * p.PI);

          this.ax = this.wander * Math.cos(this.angle);
          this.ay = this.wander * Math.sin(this.angle);

          this.vx += this.ax;
          this.vy += this.ay;

          // drag
          this.vx *= drag;
          this.vy *= drag;
          
          this.x = this.x + this.vx;
          this.y = this.y + this.vy;

          if(mouseOnScreen && !this.isMouse) {
            let pushDist = 75;
            if (distSquared(p.mouseX, p.mouseY, this.x, this.y) < pushDist*pushDist) {
              let dy = this.y - p.mouseY;
              let dx = this.x - p.mouseX;
              let angle = Math.atan2(dy, dx);
              this.x = p.mouseX + (pushDist + 1) * Math.cos(angle);
              this.y = p.mouseY + (pushDist + 1) * Math.sin(angle);
            }
          }


          // wraparound the screen: x
          if (this.x > p.width + particleSize/2) {
            this.x = -particleSize/2;
          } else if (this.x < -particleSize/2) {
            this.x = p.width + particleSize/2;
          }

          // wraparound the screen: y
          if (this.y > p.height + particleSize/2) {
            this.y = -particleSize/2;
          } else if (this.y < -particleSize/2) {
            this.y = p.height + particleSize/2;
          }
        }

      };

      this.display = function() {
        p.image(this.face, this.x, this.y, particleSize, particleSize);

        /*
        p.noStroke();
        p.fill(238, 232, 170, 200);
        p.ellipse(this.x, this.y, this.size);
        */
      };

      this.remove = function() {
        let index = particles.indexOf(this);
        particles.splice(index, 1);
      };

      this.mask = function() {
        this.isMasked = true;
        this.face =  emojis.mask;
      };

      this.unmask = function() {
        this.isMasked = false;
        this.face =  emojis.neutral;
      };

    }

    function distSquared(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    function drawEdges(particleArray, length) {

      let l = particleArray.length;

      numint0 = 0;
      numint1 = 0;
      numint2 = 0;

      for (let i = 0; i < l; i++) {
        for (let j = 0; j < i; j++) {
          let p1 = particleArray[i];
          let p2 = particleArray[j];
          let distSq = distSquared(p1.x, p1.y, p2.x, p2.y);
          if (distSq < length*length) {
            let dist = Math.sqrt(distSq);
            let opacity = p.map(dist, 50, length, 255, 0, true);
            let weight = p.map(dist, 50, length, 3, 0, true);

            p.strokeWeight(weight);

            if (p1.isMasked && p2.isMasked) {
              p.stroke(220, 220, 110, opacity);
              numint2++;
            } else if(p1.isMasked || p2.isMasked) {
              p.stroke(220, 142, 0, opacity);
              numint1++;
            } else {
              p.stroke(220, 60, 60, opacity);
              numint0++;
            }
            p.line(p1.x, p1.y, p2.x, p2.y);
          }
        } 
      }
    }

    function createParticles(area) {
      let maskusage = parent.data.maskusage;

      numParticles = p.round(initialParticles * area / (800*400));
      let numMasked = p.round(numParticles * maskusage);

      particles = [];

      for (let i = 0; i < numMasked; i++) {
        particles.push(new particle(true));
      }

      for (let i = numMasked; i < numParticles; i++) {
        particles.push(new particle(false));
      }

      mouseParticle = new particle(maskusage >= 0.5, true);
    }


    function updateParticles(width) {
      let maskusage = parent.data.maskusage;

      //numParticles = p.round(initialParticles * width/800);
      let numParticles = particles.length;
      let numMasked = p.round(numParticles * maskusage);
      //console.log(maskusage, numParticles, numMasked);

      for (let i = 0; i < numMasked; i++) {
        particles[i].mask();
      }

      for (let i = numMasked; i < numParticles; i++) {
        particles[i].unmask();
      }

      mouseParticle = new particle(maskusage >= 0.5, true);
    }

    p.windowResized = function() {
      //console.log('p5 canvas resized');
      width = target.clientWidth;
      height = width * parent.data.height;
      p.resizeCanvas(width, height);

      mouseOnScreen = false;

      createParticles(width * height);


    };

  };
}