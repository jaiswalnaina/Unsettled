let selectedYear = 'All';
let selectedCategory = 'All';

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noStroke();
  setupDropdowns();
  drawVisualization();
}

function setupDropdowns() {
  const yearSelect = createSelect(false); // create p5.js Select
  yearSelect.parent('yearSelect'); // append to existing HTML select element
  yearSelect.option('All');
  years.forEach(year => yearSelect.option(year));
  yearSelect.changed(() => {
    selectedYear = yearSelect.value();
    drawVisualization();
  });

  const categorySelect = createSelect(false);
  categorySelect.parent('categorySelect');
  categorySelect.option('All');
  hazard.forEach(h => categorySelect.option(h));
  categorySelect.changed(() => {
    selectedCategory = categorySelect.value();
    drawVisualization();
  });
}

function drawVisualization() {
  clear();
  background(235, 243, 255);
  drawParticles();
  drawLegend();
}

function draw() {
    background(235, 243, 255);
    drawParticles();
    drawLegend();
  }
  
  
  function drawParticles() {
    for (let p of particles) {
      fill(p.color);
      ellipse(p.x, p.y, p.radius, p.radius);
      if (dist(mouseX, mouseY, p.x, p.y) < p.radius / 2) {
        drawTooltip(p);
      }
    }
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
      textSize(50);
      textAlign(LEFT, CENTER);
      text(hazard[i], legendX + boxSize + 20, legendY + i * textOffset + boxSize / 2);
    }
  }
  