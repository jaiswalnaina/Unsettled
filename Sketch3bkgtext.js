let numCategories = 8;
let numYears = 10;
let hazard = ["Drought", "Earthquake", "Extreme Temperature", "Flood", "Storm", "Volcanic Activity", "Mass Movement", "Wildfire"];
let years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
let dataValues = [
  [0, 0, 0, 0, 127.92, 76.5321, 29.373, 6.1923, 25.6552, 221.4692],
  [177.8765, 149.1288, 442.373, 59.1719, 58.879, 91.228, 92.329, 13.5774, 66.5118, 69.7199],
  [16.32, 0.006, 0.2032, 8.486, 0.421, 2.3876, 2.4471, 4.6511, 2.0112, 1.4851],
  [611.9639, 816.0932, 829.0885, 1024.6525, 863.6798, 537.8517, 995.8864, 1412.6727, 1007.4334, 1919.2519],
  [1407.4282, 910.7468, 630.3509, 1312.7313, 746.1836, 958.6109, 1350.9428, 1477.9051, 1151.4345, 1001.0801],
  [5.082, 24.504, 3.2125, 1.6913, 16.909, 18.6064, 2.453, 51.7728, 66.252, 1.6141],
  [0.5724, 6.7276, 5.4493, 1.9316, 3.7689, 19.3042, 6.8009, 10.1151, 7.3025, 4.1309],
  [8.4997, 4.7304, 8.7448, 33.0853, 41.4112, 42.088, 52.9218, 121.7357, 45.1328, 36.5839]
];

let hazardColors = [
  [183, 114, 114], // Brown for Drought
  [234, 193, 110], // Yellow for Earthquake
  [216, 74, 75], // Orange for Extreme Temperature
  [105, 178, 203], // Blue for Flood
  [70, 112, 179], // Dark Blue for Storm
  [221, 139, 80], // Red for Volcanic activity
  [222, 132, 177], // Pink for Mass Movement
  [134, 192, 119] // Green for Wildfire
];


let particles = [];

let myImage;

function preload() {
  // Make sure the path to the image is correct
  myImage = loadImage('Group 21.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(235, 243, 255);
  noStroke();
    // Set up the content margin and visualization center
    let contentMargin = 2500; // Space for title and text on the left
    centerX = width / 2 + contentMargin / 2;
    centerY = height / 2;
    spaceBetweenRings = 25;
    ringMinRadius = 40;
    ringMaxRadius = min(centerX - contentMargin / 2, centerY) - spaceBetweenRings * (numYears - 1);
    let totalRingSpace = ringMaxRadius - ringMinRadius;
    ringWidth = (totalRingSpace - (spaceBetweenRings * (numYears - 1))) / numYears;
  
  // Create particles for each data point
  for (let yearIndex = 0; yearIndex < numYears; yearIndex++) {
    let outerRadius = ringMinRadius + (yearIndex + 1) * (ringWidth + spaceBetweenRings);
    let innerRadius = outerRadius - ringWidth;
    let totalValueForYear = dataValues.reduce((acc, curr) => acc + curr[yearIndex], 0);
    let startAngle = 0;
    for (let categoryIndex = 0; categoryIndex < numCategories; categoryIndex++) {
      let value = dataValues[categoryIndex][yearIndex];
      let angleSpan = TWO_PI * (value / totalValueForYear);
      let categoryAngle = startAngle;
      let incrementAngle = angleSpan / Math.floor(value);
      while (categoryAngle < startAngle + angleSpan) {
        let r = random(innerRadius, outerRadius);
        let x = centerX + r * cos(categoryAngle);
        let y = centerY + r * sin(categoryAngle);
        particles.push({
          x,
          y,
          radius: 8,
          year: years[yearIndex],
          category: hazard[categoryIndex],
          value: value,
          color: color(...hazardColors[categoryIndex])
        });
        categoryAngle += incrementAngle;
      }
      startAngle += angleSpan;
    }
  }
}



function draw() {
       // Define the start and end colors for the gradient
        let startColor = color(39, 19, 97);
        let endColor = color(17, 7, 44); // Let's fade to white
        noStroke(); // Disable stroke for shapes
        // Create the gradient by interpolating between startColor and endColor
        for (let y = 0; y < height; y++) {
            let inter = map(y, 0, height, 0, 1); // Calculate the interpolation value
            let c = lerpColor(startColor, endColor, inter); // Get the color at position y
            fill(c); // Use fill instead of stroke
            rect(0, y, width, 1); // Draw a filled rectangle instead of a line
        }
        // Create the gradient by interpolating between startColor and endColor
       // for (let y = 0; y < height; y++) {
         // let inter = map(y, 0, height, 0, 1); // Calculate the interpolation value
         // let c = lerpColor(startColor, endColor, inter); // Get the color at position y
         // stroke(c);
        //  line(0, y, width, y); // Draw a horizontal line with color c
      //  }
      
  drawParticles();
  drawLegend();

   // Draw title and additional content on the left
fill(255, 255, 255); // White color for the text

// Set style and size for the title
textSize(300); // Larger size for the title
textStyle(BOLD); // Bold text for the title
textAlign(LEFT, TOP);
text('Unsettled', 100, 200); // Adjusted position if necessary

// Coordinates for the text
let xPosition = 130;
let yPosition = 600;
let lineSpacing = 100; // Space between lines

// Define each line of text
let textLines = [
  'In the past decade, an average of 20 million',
  'individuals annually have been displaced from',
  'their homes, a stirring consequence of the',
  'escalating natural disasters fueled by climate',
  'change and global warming.'
];

let imageYPosition = 1350;
image(myImage, 130, imageYPosition);

// Draw each line of text with appropriate spacing
textSize(70); // Set the text size
textStyle(NORMAL); // Bold text for the title
fill(255, 255, 255); // Set text color to white
for (let i = 0; i < textLines.length; i++) {
  text(textLines[i], xPosition, yPosition + i * lineSpacing);
}
}


function drawParticles() {
    let hoverCategory = null;
    // First pass: determine if mouse is hovering any particle
    for (let p of particles) {
        if (dist(mouseX, mouseY, p.x, p.y) < p.radius / 2) {
            hoverCategory = p.category;
            break;
        }
    }

    // Second pass: draw all particles with opacity adjustment based on hover
    for (let p of particles) {
        if (hoverCategory && p.category !== hoverCategory) {
            // Apply transparency
            fill(red(p.color), green(p.color), blue(p.color), 30); // Reduced opacity
        } else {
            // Full color if not hovering or is the same category
            fill(p.color);
        }
        ellipse(p.x, p.y, p.radius, p.radius);
    }
}

function drawLegend() {
    let legendX = 140;  // Starting X position for the legend
    let legendY = height - 200;  // Y position is fixed, as the legend is horizontal
    let boxSize = 30;  // Diameter of the circle
    let textOffsetX = 20;  // Horizontal offset for the text relative to the circle

    let spacing = 300;  // Space between each legend item

    for (let i = 0; i < numCategories; i++) {
        let xPosition = legendX + i * spacing;  // Calculate X position for each item

        fill(hazardColors[i]);
        ellipse(xPosition + boxSize / 2, legendY, boxSize, boxSize);  // Draw circle

        fill(255, 255, 255);
        textSize(40);  // Adjusted for better fit in a horizontal layout
        textAlign(LEFT, CENTER);
        text(hazard[i], xPosition + boxSize + textOffsetX, legendY);
    }
}
