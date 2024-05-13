let numCategories = 8;
let numYears = 10;
let hazard = ["Drought", "Earthquake", "Extreme Temperature", "Flood", "Storm", "Volcanic activity", "Mass Movement", "Wildfire"];
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

let spaceBetweenRings = 25; // Space between the rings
let centerX, centerY; // Center coordinates of the window
let ringMinRadius; // Minimum radius for the innermost ring
let ringMaxRadius; // Maximum radius for the outermost ring
let ringWidth; // Width of each ring

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(235, 243, 255);
  noStroke();

  // Define center of the sketch
  centerX = width / 2;
  centerY = height / 2;

  // Define the min and max radii for the rings
  ringMinRadius = 40; // Larger inner radius to reduce crowding
  ringMaxRadius = min(centerX, centerY) - spaceBetweenRings * (numYears - 1);

  // Adjust ring widths and spacings
  let totalRingSpace = ringMaxRadius - ringMinRadius;
  ringWidth = (totalRingSpace - (spaceBetweenRings * (numYears - 1))) / numYears;

  // Draw rings and labels
  for (let yearIndex = 0; yearIndex < numYears; yearIndex++) {
    // Calculate the inner and outer radii for this year's ring
    let outerRadius = ringMinRadius + (yearIndex + 1) * (ringWidth + spaceBetweenRings);
    let innerRadius = outerRadius - ringWidth;
    // Calculate the total value for the year to determine angle spans
    let totalValueForYear = 0;
    for (let categoryIndex = 0; categoryIndex < numCategories; categoryIndex++) {
      totalValueForYear += dataValues[categoryIndex][yearIndex];
    }

    let startAngle = 0; // Starting angle for the first category
    
    for (let categoryIndex = 0; categoryIndex < numCategories; categoryIndex++) {
      let value = dataValues[categoryIndex][yearIndex];
      let angleSpan = TWO_PI * (value / totalValueForYear); // Angle span for this category

      let categoryAngle = startAngle; // Current angle within the category's span
      let incrementAngle = angleSpan / Math.floor(value);
      while (categoryAngle <= startAngle + angleSpan) {
        let r = random(innerRadius, outerRadius); // Radius within the ring
        let x = centerX + r * cos(categoryAngle);
        let y = centerY + r * sin(categoryAngle);
        fill(hazardColors[categoryIndex]);
        ellipse(x, y, 8, 8); // Draw the particle
        
        // Increment the angle for the next particle, adjust the step for density
        categoryAngle += incrementAngle;
      }
      startAngle += angleSpan; // Increment the starting angle for the next category
    }
  }

  // Add labels for the years on the rings
  drawLegend();
}

function drawLegend() {
  let legendX = 100;
  let legendY = height - 100;
  let boxSize = 20;
  let textOffset = 30;

  for (let i = 0; i < numCategories; i++) {
    fill(hazardColors[i]);
    rect(legendX, legendY + i * textOffset, boxSize, boxSize);
    fill(0);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(hazard[i], legendX + boxSize + 10, legendY + i * textOffset + boxSize / 2);
  }
}
