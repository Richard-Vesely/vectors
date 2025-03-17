document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup for all grids
    const positionCanvas = document.getElementById('vector-grid');
    const displacementCanvas = document.getElementById('displacement-grid');
    const velocityCanvas = document.getElementById('velocity-grid');
    const accelerationCanvas = document.getElementById('acceleration-grid');
    
    const positionCtx = positionCanvas.getContext('2d');
    const displacementCtx = displacementCanvas.getContext('2d');
    const velocityCtx = velocityCanvas.getContext('2d');
    const accelerationCtx = accelerationCanvas.getContext('2d');
    
    const width = positionCanvas.width;
    const height = positionCanvas.height;
    const derivativeHeight = displacementCanvas.height;
    
    // Legend containers
    const positionLegend = document.getElementById('position-legend');
    const displacementLegend = document.getElementById('displacement-legend');
    const velocityLegend = document.getElementById('velocity-legend');
    const accelerationLegend = document.getElementById('acceleration-legend');
    
    // Grid settings
    const gridSize = 20;
    const gridLines = Math.floor(width / gridSize);
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const derivativeCenterY = Math.floor(derivativeHeight / 2);
    
    // UI elements
    const timeButtons = document.querySelectorAll('.time-btn');
    const positionInfo = document.getElementById('position-info');
    const selectedTimeDisplay = document.getElementById('selected-time');
    const timeInputs = [
        document.getElementById('time1'),
        document.getElementById('time2'),
        document.getElementById('time3'),
        document.getElementById('time4')
    ];
    
    // Time-specific colors for positions
    const timeColors = {
        1: '#E53935', // Red
        2: '#43A047', // Green
        3: '#1E88E5', // Blue
        4: '#8E24AA'  // Purple
    };
    
    // Colors for velocity vectors (different from position colors)
    const velocityColors = {
        "1-2": '#FB8C00', // Orange
        "2-3": '#00ACC1', // Cyan
        "3-4": '#7CB342'  // Light Green
    };
    
    // Colors for acceleration vectors (different from position and velocity colors)
    const accelerationColors = {
        "1-2-3": '#FF5722', // Deep Orange
        "2-3-4": '#9C27B0'  // Purple
    };
    
    // State
    let selectedTime = 1;
    const positions = {
        1: { x: 1, y: 0 },
        2: { x: 1, y: 1 },
        3: { x: 2, y: 2 },
        4: { x: 3, y: 1 }
    };
    
    // Time values (in seconds)
    let timeValues = [1, 2, 3, 4];
    
    // Dragging state
    let isDragging = false;
    let dragTime = null;
    
    // Helper function to calculate vector magnitude
    function vectorMagnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
    
    // Create legends for all visualizations
    function createLegends() {
        // Position legend
        positionLegend.innerHTML = `
            <div class="legend-title">Position Vectors</div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[1]}"></div>
                <div class="legend-text">x₁: Position at time t₁</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[2]}"></div>
                <div class="legend-text">x₂: Position at time t₂</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[3]}"></div>
                <div class="legend-text">x₃: Position at time t₃</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[4]}"></div>
                <div class="legend-text">x₄: Position at time t₄</div>
            </div>
            <div class="legend-equation">
                x = (x, y)
            </div>
        `;
        
        // Displacement legend
        displacementLegend.innerHTML = `
            <div class="legend-title">Displacement Vectors</div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[1]}"></div>
                <div class="legend-text">r₁: Displacement to x₁</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[2]}"></div>
                <div class="legend-text">r₂: Displacement to x₂</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[3]}"></div>
                <div class="legend-text">r₃: Displacement to x₃</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${timeColors[4]}"></div>
                <div class="legend-text">r₄: Displacement to x₄</div>
            </div>
            <div class="legend-equation">
                r = x - x₀ = (x, y)
            </div>
        `;
        
        // Velocity legend
        velocityLegend.innerHTML = `
            <div class="legend-title">Velocity Vectors (Δx/Δt)</div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${velocityColors["1-2"]}"></div>
                <div class="legend-text">v₁₋₂: Velocity from t₁ to t₂</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${velocityColors["2-3"]}"></div>
                <div class="legend-text">v₂₋₃: Velocity from t₂ to t₃</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${velocityColors["3-4"]}"></div>
                <div class="legend-text">v₃₋₄: Velocity from t₃ to t₄</div>
            </div>
            <div class="legend-equation">
                v₁₋₂ = Δx/Δt = (x₂ - x₁)/(t₂ - t₁)
            </div>
        `;
        
        // Acceleration legend
        accelerationLegend.innerHTML = `
            <div class="legend-title">Acceleration Vectors (Δ²x/Δt²)</div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${accelerationColors["1-2-3"]}"></div>
                <div class="legend-text">a₁₋₂₋₃: Acceleration from t₁ to t₃</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${accelerationColors["2-3-4"]}"></div>
                <div class="legend-text">a₂₋₃₋₄: Acceleration from t₂ to t₄</div>
            </div>
            <div class="legend-equation">
                a₁₋₂₋₃ = Δv/Δt = (v₂₋₃ - v₁₋₂)/Δt
                      = Δ²x/Δt²
            </div>
        `;
    }
    
    // Draw grid for position canvas
    function drawPositionGrid() {
        positionCtx.clearRect(0, 0, width, height);
        
        // Draw light gray grid lines
        positionCtx.strokeStyle = '#e0e0e0';
        positionCtx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= gridLines; i++) {
            const x = i * gridSize;
            positionCtx.beginPath();
            positionCtx.moveTo(x, 0);
            positionCtx.lineTo(x, height);
            positionCtx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= gridLines; i++) {
            const y = i * gridSize;
            positionCtx.beginPath();
            positionCtx.moveTo(0, y);
            positionCtx.lineTo(width, y);
            positionCtx.stroke();
        }
        
        // Draw axes with darker color
        positionCtx.strokeStyle = '#999';
        positionCtx.lineWidth = 2;
        
        // X-axis
        positionCtx.beginPath();
        positionCtx.moveTo(0, centerY);
        positionCtx.lineTo(width, centerY);
        positionCtx.stroke();
        
        // Y-axis
        positionCtx.beginPath();
        positionCtx.moveTo(centerX, 0);
        positionCtx.lineTo(centerX, height);
        positionCtx.stroke();
        
        // Add axis labels
        positionCtx.fillStyle = '#333';
        positionCtx.font = '14px Arial';
        
        // X-axis labels (meters)
        for (let i = -Math.floor(gridLines/2); i <= Math.floor(gridLines/2); i += 5) {
            if (i === 0) continue; // Skip zero
            const x = centerX + i * gridSize;
            positionCtx.fillText(`${i}m`, x - 10, centerY + 20);
        }
        
        // Y-axis labels (meters)
        for (let i = -Math.floor(gridLines/2); i <= Math.floor(gridLines/2); i += 5) {
            if (i === 0) continue; // Skip zero
            const y = centerY - i * gridSize;
            positionCtx.fillText(`${i}m`, centerX + 10, y + 5);
        }
        
        // Draw origin label
        positionCtx.fillText('0', centerX - 15, centerY + 15);
        
        // Add unit labels
        positionCtx.font = 'bold 16px Arial';
        positionCtx.fillText('x (meters)', width - 80, centerY - 10);
        positionCtx.fillText('y (meters)', centerX + 10, 20);
        
        // Draw position markers for all times
        drawPositionMarkers();
    }
    
    // Draw grid for derivative canvases (displacement, velocity, acceleration)
    function drawDerivativeGrid(ctx, canvasHeight, title) {
        ctx.clearRect(0, 0, width, canvasHeight);
        
        // Draw light gray grid lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= gridLines; i++) {
            const x = i * gridSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= Math.floor(canvasHeight / gridSize); i++) {
            const y = i * gridSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw axes with darker color
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, derivativeCenterY);
        ctx.lineTo(width, derivativeCenterY);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvasHeight);
        ctx.stroke();
        
        // Add title - moved more to the right
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(title, width / 4, 20);
    }
    
    // Convert grid coordinates to canvas coordinates
    function gridToCanvas(x, y, centerY) {
        return {
            x: centerX + x * gridSize,
            y: centerY - y * gridSize // Invert Y for traditional Cartesian
        };
    }
    
    // Convert canvas coordinates to grid coordinates
    function canvasToGrid(x, y, centerY) {
        return {
            x: Math.round((x - centerX) / gridSize),
            y: Math.round(-(y - centerY) / gridSize) // Invert Y for traditional Cartesian
        };
    }
    
    // Draw arrow for vectors
    function drawArrow(ctx, fromX, fromY, toX, toY, color, lineWidth = 2) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(toX, toY);
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // Draw position markers for all times
    function drawPositionMarkers() {
        Object.entries(positions).forEach(([time, position]) => {
            if (!position) return;
            
            const { x, y } = gridToCanvas(position.x, position.y, centerY);
            const timeInt = parseInt(time);
            const isSelected = timeInt === selectedTime;
            
            // Draw circle
            positionCtx.beginPath();
            positionCtx.arc(x, y, isSelected ? 8 : 6, 0, Math.PI * 2);
            positionCtx.fillStyle = timeColors[timeInt];
            positionCtx.fill();
            
            // Add border if selected
            if (isSelected) {
                positionCtx.strokeStyle = '#333';
                positionCtx.lineWidth = 2;
                positionCtx.stroke();
            }
            
            // Draw label
            positionCtx.fillStyle = '#000';
            positionCtx.font = '12px Arial';
            positionCtx.textAlign = 'center';
            positionCtx.textBaseline = 'bottom';
            positionCtx.fillText(`x${timeInt} (t=${timeValues[timeInt-1]}s)`, x, y - 10);
        });
    }
    
    // Draw displacement vectors
    function drawDisplacementVectors() {
        // Clear and redraw grid
        drawDerivativeGrid(displacementCtx, derivativeHeight, 'Displacement Vectors (from origin)');
        
        // Draw displacement vectors from origin for each point
        Object.entries(positions).forEach(([time, position]) => {
            if (!position) return;
            
            const timeInt = parseInt(time);
            const origin = { x: 0, y: 0 };
            const originCanvas = gridToCanvas(origin.x, origin.y, derivativeCenterY);
            const posCanvas = gridToCanvas(position.x, position.y, derivativeCenterY);
            
            // Draw vector arrow
            drawArrow(
                displacementCtx,
                originCanvas.x,
                originCanvas.y,
                posCanvas.x,
                posCanvas.y,
                timeColors[timeInt],
                2
            );
            
            // Removed label with magnitude
        });
    }
    
    // Draw velocity vectors
    function drawVelocityVectors() {
        // Clear and redraw grid
        drawDerivativeGrid(velocityCtx, derivativeHeight, 'Velocity Vectors (change in displacement)');
        
        // Calculate and draw velocity vectors between consecutive points
        for (let i = 1; i < 4; i++) {
            const currentPos = positions[i];
            const nextPos = positions[i + 1];
            
            if (!currentPos || !nextPos) continue;
            
            // Calculate velocity vector
            const deltaT = timeValues[i] - timeValues[i-1];
            const velocity = {
                x: (nextPos.x - currentPos.x) / deltaT,
                y: (nextPos.y - currentPos.y) / deltaT
            };
            
            // Scale velocity for display (optional)
            const scaledVelocity = {
                x: velocity.x,
                y: velocity.y
            };
            
            // Position velocity vector at center
            const center = { x: 0, y: 0 };
            const centerCanvas = gridToCanvas(center.x, center.y, derivativeCenterY);
            const endPoint = gridToCanvas(scaledVelocity.x, scaledVelocity.y, derivativeCenterY);
            
            // Draw vector arrow with specific velocity color
            const colorKey = `${i}-${i+1}`;
            drawArrow(
                velocityCtx,
                centerCanvas.x,
                centerCanvas.y,
                endPoint.x,
                endPoint.y,
                velocityColors[colorKey],
                2
            );
            
            // Removed label with magnitude
        }
    }
    
    // Draw acceleration vectors
    function drawAccelerationVectors() {
        // Clear and redraw grid
        drawDerivativeGrid(accelerationCtx, derivativeHeight, 'Acceleration Vectors (change in velocity)');
        
        // Need at least 3 points to calculate acceleration
        if (positions[1] && positions[2] && positions[3]) {
            // Calculate velocities first
            const velocities = [];
            
            for (let i = 1; i < 4; i++) {
                const currentPos = positions[i];
                const nextPos = positions[i+1];
                
                if (!currentPos || !nextPos) continue;
                
                const deltaT = timeValues[i] - timeValues[i-1];
                velocities.push({
                    time: timeValues[i-1] + deltaT/2, // middle time
                    vector: {
                        x: (nextPos.x - currentPos.x) / deltaT,
                        y: (nextPos.y - currentPos.y) / deltaT
                    }
                });
            }
            
            // Calculate and draw acceleration vectors
            for (let i = 0; i < velocities.length - 1; i++) {
                const v1 = velocities[i];
                const v2 = velocities[i+1];
                
                const deltaT = v2.time - v1.time;
                const acceleration = {
                    x: (v2.vector.x - v1.vector.x) / deltaT,
                    y: (v2.vector.y - v1.vector.y) / deltaT
                };
                
                // Position acceleration vector at center
                const center = { x: 0, y: 0 };
                const centerCanvas = gridToCanvas(center.x, center.y, derivativeCenterY);
                const endPoint = gridToCanvas(acceleration.x, acceleration.y, derivativeCenterY);
                
                // Draw vector arrow with specific acceleration color
                const colorKey = `${i+1}-${i+2}-${i+3}`;
                drawArrow(
                    accelerationCtx,
                    centerCanvas.x,
                    centerCanvas.y,
                    endPoint.x,
                    endPoint.y,
                    accelerationColors[colorKey],
                    2
                );
                
                // Removed label with magnitude
            }
        }
    }
    
    // Update all visualizations
    function updateAllVisualizations() {
        drawPositionGrid();
        drawDisplacementVectors();
        drawVelocityVectors();
        drawAccelerationVectors();
        
        // Update time display
        selectedTimeDisplay.textContent = `Selected time: ${timeValues[selectedTime-1]}s`;
        
        // Update button labels
        timeButtons.forEach((btn, i) => {
            const timeIndex = i + 1;
            btn.textContent = `t${timeIndex}`;
        });
    }
    
    // Check if mouse is over a point
    function getPointAtPosition(x, y) {
        for (const [time, position] of Object.entries(positions)) {
            if (!position) continue;
            
            const canvasPos = gridToCanvas(position.x, position.y, centerY);
            const distance = Math.sqrt(
                Math.pow(x - canvasPos.x, 2) + 
                Math.pow(y - canvasPos.y, 2)
            );
            
            if (distance <= 10) { // 10px hit radius
                return { time: parseInt(time), position };
            }
        }
        return null;
    }
    
    // Handle canvas click to set or drag position
    positionCanvas.addEventListener('mousedown', (event) => {
        const rect = positionCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Check if clicking on an existing point
        const point = getPointAtPosition(mouseX, mouseY);
        
        if (point) {
            // Start dragging
            isDragging = true;
            dragTime = point.time;
            
            // Select the time of the point being dragged
            selectedTime = dragTime;
            selectedTimeDisplay.textContent = `Selected time: ${timeValues[selectedTime-1]}s`;
            
            // Update button styles
            timeButtons.forEach(btn => {
                if (parseInt(btn.dataset.time) === selectedTime) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } else {
            // Place a new point
            const gridPosition = canvasToGrid(mouseX, mouseY, centerY);
            positions[selectedTime] = gridPosition;
            
            // Update display
            positionInfo.textContent = `Position: (${gridPosition.x}, ${gridPosition.y}) meters`;
        }
        
        updateAllVisualizations();
    });
    
    // Handle mouse move for dragging and position info
    positionCanvas.addEventListener('mousemove', (event) => {
        const rect = positionCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const gridPosition = canvasToGrid(mouseX, mouseY, centerY);
        
        // Update cursor and position info
        if (getPointAtPosition(mouseX, mouseY)) {
            positionCanvas.style.cursor = 'grab';
        } else {
            positionCanvas.style.cursor = 'crosshair';
        }
        
        if (isDragging && dragTime !== null) {
            // Update the position while dragging
            positions[dragTime] = gridPosition;
            positionCanvas.style.cursor = 'grabbing';
            updateAllVisualizations();
        }
        
        positionInfo.textContent = `Position: (${gridPosition.x}, ${gridPosition.y}) meters`;
    });
    
    // Handle end of dragging
    positionCanvas.addEventListener('mouseup', () => {
        if (isDragging && dragTime !== null) {
            isDragging = false;
            dragTime = null;
            positionCanvas.style.cursor = 'crosshair';
        }
    });
    
    // Also handle case where mouse leaves canvas
    positionCanvas.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragTime = null;
        }
    });
    
    // Handle time selection
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update selected time
            selectedTime = parseInt(button.dataset.time);
            selectedTimeDisplay.textContent = `Selected time: ${timeValues[selectedTime-1]}s`;
            
            // Update button styles
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Redraw grid to highlight the selected time
            updateAllVisualizations();
        });
    });
    
    // Handle time input changes
    timeInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            const newValue = parseFloat(input.value);
            if (!isNaN(newValue) && newValue >= 0) {
                timeValues[index] = newValue;
                
                // Make sure time values are in ascending order
                timeValues.sort((a, b) => a - b);
                
                // Update input values to match sorted array
                timeInputs.forEach((inp, i) => {
                    inp.value = timeValues[i];
                });
                
                updateAllVisualizations();
            }
        });
    });
    
    // Initialize
    createLegends();
    updateAllVisualizations();
}); 