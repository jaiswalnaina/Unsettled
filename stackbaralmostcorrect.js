let hoverParticle = null; // Declare this outside of any function to make it global
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

let hazardInfo = {
    'Drought': 'Droughts cause widespread crop failure and water shortages.',
    'Earthquake': 'Earthquakes can result in significant structural damage and loss of life.',
    'Extreme Temperature': 'Extreme temperatures can lead to health emergencies like heatstroke.',
    'Flood': 'Floods can inundate communities, causing displacement and property damage.',
    'Storm': 'Storms can bring strong winds and heavy rainfall, leading to various hazards.',
    'Volcanic Activity': 'Volcanic activity can spew ash and lava, creating various health and environmental risks.',
    'Mass Movement': 'Mass movements like landslides can occur suddenly, causing destruction in their path.',
    'Wildfire': 'Wildfires can rapidly spread and consume large areas, causing ecological and property damage.'
  };
  

let particles = [];

let yearTotals = {}; // Object to store the total for each year

let fontLight;
let fontRegular;
let fontBold;

function preload() {
    // Make sure the path to the font file is correct
    fontLight = loadFont('font/Roboto-Thin.ttf', fontLoaded, loadError);
    fontRegular = loadFont('font/Roboto-Regular.ttf', fontLoaded, loadError);
    fontBold = loadFont('font/Roboto-Bold.ttf', fontLoaded, loadError);
}

function fontLoaded() {
    console.log('Font loaded successfully!');
}

function loadError(err) {
    console.error('Failed to load the font:', err);
}


function setup() {
    createCanvas(windowWidth, windowHeight); // Assuming full browser window for canvas
    background(235, 243, 255);
    noStroke();

    // Constants and calculations for layout
    let availableWidth = width * 0.8; // Use 80% of the width for the visualization
    let contentStartX = width * 0.35; // Start 20% from the left, leaving space for text and titles on the left

    // Center positions for the visualization
    let centerX = contentStartX + availableWidth / 2;
    let centerY = height / 2;
    let spaceBetweenRings = 25;
    let ringMinRadius = 80;

    // Calculate maximum radius based on the available dimensions
    let ringMaxRadius = min(availableWidth / 2, centerY) - spaceBetweenRings * (numYears - 1);

    // Compute the total ring space and the width of each ring
    let totalRingSpace = ringMaxRadius - ringMinRadius;
    let ringWidth = (totalRingSpace - (spaceBetweenRings * (numYears - 1))) / numYears;

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
  for (let yearIndex = 0; yearIndex < numYears; yearIndex++) {
    let yearTotal = 0;
    for (let categoryIndex = 0; categoryIndex < numCategories; categoryIndex++) {
      yearTotal += dataValues[categoryIndex][yearIndex];
    }
    yearTotals[years[yearIndex]] = yearTotal;
  }
}

calculateYearTotals();

// This function will calculate the total values for each year and store them in yearTotals
function calculateYearTotals() {
    for (let i = 0; i < numYears; i++) {
      let total = 0;
      for (let j = 0; j < numCategories; j++) {
        total += dataValues[j][i];
      }
      yearTotals[years[i]] = total;
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
      
  drawParticles();
  drawLegend();
  drawStackedBarChart();
   // If hoverParticle is null after drawParticles(), draw the default info text.
   if (!hoverParticle) {
    drawHazardInfo(null);
}

   // Draw title and additional content on the left
fill(255, 255, 255); // White color for the text

// Set style and size for the title
textFont(fontBold);
textSize(300); // Larger size for the title
textAlign(LEFT, TOP);
text('Unsettled', 100, 200); // Adjusted position if necessary

// Set style and size for the title
//textFont(fontRegular);
//textSize(40); // Larger size for the title
//textAlign(LEFT, TOP);
//text('2013', 4365, 1455); // Adjusted position if necessary

// Set style and size for the title
textFont(fontRegular);
textSize(50); // Larger size for the title
textAlign(LEFT, TOP);
text('2022--------------------------------------------------------2013', 2980, 1455); // Adjusted position if necessary


// Coordinates for the text
let xPosition = 130;
let yPosition = 600;
let lineSpacing = 100; // Space between lines

// Define each line of text
let textLines = [
  'In the past decade, an average of 20 million individuals annually have been',
  'displaced from their homes, a stirring consequence of the escalating',
  'natural disasters fueled by climate change and global warming.',
];

// Draw each line of text with appropriate spacing
textSize(70); // Set the text size
textFont(fontLight);
fill(255, 255, 255); // Set text color to white
for (let i = 0; i < textLines.length; i++) {
  text(textLines[i], xPosition, yPosition + i * lineSpacing);
}

fill(255); // White color for the ellipse
    ellipse(5200, 200, 30, 30); // Draw ellipse
    fill(255); // Black color for text
    textSize(80);
    textFont(fontRegular);
    textAlign(LEFT, CENTER);
    text("   10k People", 5200, 190); // Add label

}


function drawParticles() {
    let hoverCategory = null;
    hoverParticle = null;

    // First pass: determine if mouse is hovering over any particle
    for (let p of particles) {
        if (dist(mouseX, mouseY, p.x, p.y) < p.radius) {
            hoverCategory = p.category;
            hoverParticle = p;
            break;
        }
    }

    // Second pass: draw all particles with opacity adjustment based on hover
    for (let p of particles) {
        if (hoverCategory && p.category !== hoverCategory) {
            fill(red(p.color), green(p.color), blue(p.color), 30); // Reduced opacity
        } else {
            fill(p.color);
        }
        ellipse(p.x, p.y, p.radius, p.radius);
    }

    // If a particle is being hovered, display the category information
    if (hoverParticle) {
        drawHazardInfo(hoverParticle);
    }
}

function drawStackedBarChart() {
  // Set chart dimensions and positioning variables
  let chartTopMargin = 100; // Margin from the top of the canvas
  let chartBottomMargin = 150; // Space at the bottom for labels
  let maxBarHeight = 1100 - chartTopMargin - chartBottomMargin; // Maximum bar height

  // Compute scaling factors based on particle counts
  let particlesPerYear = {};
  for (let p of particles) {
      particlesPerYear[p.year] = (particlesPerYear[p.year] || 0) + 1;
  }
  let maxParticles = max(Object.values(particlesPerYear)); // Find max for scaling

  let barWidth = (width - 3700) / numYears; // Adjust bar width
  let spacing = 25; // Spacing between bars
  let chartX = 100; // X start position for the chart

  // Loop through each year and draw the stacked bars
  for (let yearIndex = 0; yearIndex < numYears; yearIndex++) {
      let year = years[yearIndex];
      let x = chartX + yearIndex * (barWidth + spacing);
      let y = 2500 - chartBottomMargin; // Start at the base of the chart
      let totalParticlesForYear = particlesPerYear[year] || 0;

      // Scale the bar heights to the max number of particles
      let totalHeightFactor = (totalParticlesForYear / maxParticles) * maxBarHeight;

      // Draw the bars
      if (!hoverParticle) {
        for (let categoryIndex = 0; categoryIndex < numCategories; categoryIndex++) {
            let value = dataValues[categoryIndex][yearIndex];
            let barHeight = (value / yearTotals[year]) * totalHeightFactor;

            // Determine fill based on hover state
            let fillColor = color(hazardColors[categoryIndex]);
            fill(fillColor);

            // Draw the bar segment
            rect(x, y - barHeight, barWidth, barHeight);
            y -= barHeight; // Decrement y position for the next bar segment
        }
      } else {
        for (let categoryIndex = 0; categoryIndex < numCategories; categoryIndex++) {
            if (hoverParticle.category === hazard[categoryIndex]) {
                let value = dataValues[categoryIndex][yearIndex];
                let barHeight = (value / yearTotals[year]) * totalHeightFactor;

                // Determine fill based on hover state
                let fillColor = color(hazardColors[categoryIndex]);
                fillColor.setAlpha(255); // Full opacity for hovered category
                fill(fillColor);

                // Draw the bar segment at the base of the chart
                rect(x, y - barHeight, barWidth, barHeight);
            }
        }
      }

      // Draw the year label
      fill(255);
      noStroke();
      textSize(40);
      textAlign(CENTER, BOTTOM);
      text(year, x + barWidth / 2, height - 520);
  }
}



function drawHazardInfo(particle) {
    // Set the position for the text
    let infoX = 140; // Position at a fixed location, e.g., top-left corner
    let infoY = 1300;

    // Define default text
    let defaultText = "Hover over a particle to see hazard information";

    // Use ternary operator to set infoText based on whether a particle is hovered
    let infoText = particle ? hazardInfo[particle.category] : defaultText;

    // Set the style for the text
    fill(255); // White text
    noStroke();
    textSize(60);
    textFont(fontRegular);
    textAlign(LEFT, TOP);

    // Estimate the height of the text box based on whether it's the default text or dynamic info
    let textHeight = particle ? 80 : (textSize() + 10) * defaultText.split('\n').length;
    
    // Display the text background
    noFill(); // Semi-transparent black background
    rect(infoX, infoY, textWidth(infoText) + 20, textHeight); // Adjust dimensions as needed

    // Display the text
    fill(255); // White text for better readability
    text(infoText, infoX + 10, infoY + 10); // Offset the text slightly from the rectangle's edge

    if (!particle) {
        // Set the position for the default text
        let infoX = 140;
        let infoY = 1300;

        // Set the style for the default text
        noFill(); // White text
        noStroke();
        textSize(60);
        textAlign(LEFT, TOP);

        let defaultText = "Hover over a particle to see hazard information.";
        let textHeight = textSize() * 1.2; // Slightly more than one line of text height

        // Display the default text background
        noFill(); // Semi-transparent black background
        rect(infoX, infoY, textWidth(defaultText) + 20, textHeight); // Adjust dimensions as needed

        // Display the default text
        fill(255); // White text for better readability
        text(defaultText, infoX + 10, infoY + 10); // Offset the text slightly from the rectangle's edge
    }
}



function drawLegend() {
    let startX = 140;  // Starting X position for the legend
    let legendY = height - 200;  // Y position is fixed, as the legend is horizontal
    let boxSize = 30;  // Diameter of the circle
    let textOffsetX = 20;  // Horizontal offset for the text relative to the circle
    let padding = 130;  // Additional spacing between items to prevent overlap

    textSize(50);  // Set the text size for the legend
    textFont(fontRegular);  // Ensure you've defined and loaded `fontRegular` beforehand

    let xPosition = startX;  // Initialize xPosition with the starting X

    for (let i = 0; i < numCategories; i++) {
        fill(hazardColors[i]);
        ellipse(xPosition + boxSize / 2, legendY, boxSize, boxSize);  // Draw circle

        let labelWidth = textWidth(hazard[i]);  // Measure the text width for proper spacing
        fill(255, 255, 255);
        textAlign(LEFT, CENTER);
        text(hazard[i], xPosition + boxSize + textOffsetX, legendY);

        // Update xPosition for the next item, ensuring enough space based on text width
        xPosition += boxSize + labelWidth + textOffsetX + padding;
    }
}

