/**
 * Charts Module
 * Pure JavaScript pixel-style chart renderer (no external libraries)
 */

'use strict';

/**
 * Initialize chart rendering
 */
export function initChart() {
  const canvas = document.getElementById('pixel-chart');
  if (!canvas) return;
  
  // Generate sample data
  const data = generateSampleData();
  
  // Render the pixel chart
  renderPixelBarChart(canvas, data);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    renderPixelBarChart(canvas, data);
  });
}

/**
 * Generate sample activity data for the chart
 * @returns {Array<Object>} Array of data points
 */
function generateSampleData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    label: month,
    value: Math.floor(Math.random() * 80) + 20 // Random value between 20-100
  }));
}

/**
 * Render a pixel-style bar chart on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array<Object>} data - Chart data
 */
export function renderPixelBarChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set canvas size based on container
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  
  // Chart dimensions
  const width = rect.width;
  const height = rect.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Get max value for scaling
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Calculate bar dimensions
  const barWidth = chartWidth / data.length;
  const barPadding = barWidth * 0.2;
  const actualBarWidth = barWidth - barPadding;
  
  // Get colors from CSS variables
  const sageBase = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-sage-base').trim();
  const sageDark = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-sage-dark').trim();
  const textMuted = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-text-muted').trim();
  
  // Disable image smoothing for pixel aesthetic
  ctx.imageSmoothingEnabled = false;
  
  // Draw bars
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = padding + index * barWidth + barPadding / 2;
    const y = padding + chartHeight - barHeight;
    
    // Draw bar with pixel aesthetic
    drawPixelBar(ctx, x, y, actualBarWidth, barHeight, sageBase, sageDark);
    
    // Draw label
    ctx.fillStyle = textMuted;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + actualBarWidth / 2, height - padding + 20);
    
    // Draw value on top of bar
    ctx.fillStyle = sageDark;
    ctx.font = 'bold 12px monospace';
    ctx.fillText(item.value.toString(), x + actualBarWidth / 2, y - 5);
  });
  
  // Draw grid lines (optional)
  drawPixelGrid(ctx, padding, padding, chartWidth, chartHeight, 4);
  
  // Draw axes
  drawPixelAxes(ctx, padding, padding, chartWidth, chartHeight, textMuted);
}

/**
 * Draw a single pixel-style bar
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Bar width
 * @param {number} height - Bar height
 * @param {string} fillColor - Fill color
 * @param {string} borderColor - Border color
 */
function drawPixelBar(ctx, x, y, width, height, fillColor, borderColor) {
  // Fill
  ctx.fillStyle = fillColor;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
  
  // Border with pixel steps
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
  
  // Add stepped shadow effect
  ctx.fillStyle = borderColor;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(Math.floor(x + 2), Math.floor(y + height), Math.floor(width - 2), 2);
  ctx.globalAlpha = 1;
}

/**
 * Draw pixel-style grid lines
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Grid width
 * @param {number} height - Grid height
 * @param {number} divisions - Number of grid divisions
 */
function drawPixelGrid(ctx, x, y, width, height, divisions) {
  ctx.strokeStyle = 'rgba(122, 173, 125, 0.2)';
  ctx.lineWidth = 1;
  
  // Horizontal lines
  for (let i = 0; i <= divisions; i++) {
    const yPos = y + (height / divisions) * i;
    ctx.beginPath();
    ctx.moveTo(x, Math.floor(yPos));
    ctx.lineTo(x + width, Math.floor(yPos));
    ctx.stroke();
  }
}

/**
 * Draw pixel-style axes
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Chart width
 * @param {number} height - Chart height
 * @param {string} color - Axis color
 */
function drawPixelAxes(ctx, x, y, width, height, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + height);
  ctx.stroke();
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.stroke();
}

/**
 * Render a simple pixel sparkline
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array<number>} values - Array of values
 * @param {string} color - Line color
 */
export function renderSparkline(canvas, values, color = '#7dad7d') {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const padding = 4;
  
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;
  
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  
  const stepX = (width - padding * 2) / (values.length - 1);
  
  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  values.forEach((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // Draw dots at each point
  ctx.fillStyle = color;
  values.forEach((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    ctx.fillRect(x - 2, y - 2, 4, 4);
  });
}

/**
 * Create a simple data visualization in a container
 * @param {string} containerId - ID of container element
 * @param {Array<Object>} data - Data to visualize
 * @param {Object} options - Visualization options
 */
export function createVisualization(containerId, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 400;
  canvas.height = options.height || 200;
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  
  container.appendChild(canvas);
  
  if (options.type === 'sparkline') {
    renderSparkline(canvas, data, options.color);
  } else {
    renderPixelBarChart(canvas, data);
  }
}