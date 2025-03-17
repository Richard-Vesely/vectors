# Vector Visualization Tool

A comprehensive web application for visualizing position vectors, displacement vectors, velocities, and accelerations.

## Features

- Interactive grid for positioning vectors at different times
- Four time slots with customizable time values
- Unique colors for each time point
- Position coordinates displayed in meters
- Ability to drag and reposition vectors after placement
- Automatically calculated and visualized:
  - Displacement vectors (from origin to each position)
  - Velocity vectors (change in displacement over time)
  - Acceleration vectors (change in velocity over time)
- Vector magnitudes displayed with appropriate units

## Usage

1. Open `index.html` in any modern web browser
2. Optionally customize the time values (default: 1s, 2s, 3s, 4s)
3. Select a time point using the buttons at the top
4. Click on the grid to place a position vector for that time
5. To reposition a vector, simply click and drag it to a new location
6. Observe how displacement, velocity, and acceleration vectors update automatically
7. Repeat for each time point to visualize motion

## Physics Concepts Visualized

- **Position Vectors**: Points in 2D space at specific time points
- **Displacement Vectors**: Vectors showing position relative to origin (0,0)
- **Velocity Vectors**: Rate of change of displacement (first derivative)
- **Acceleration Vectors**: Rate of change of velocity (second derivative)

## Implementation Details

- Pure HTML, CSS, and JavaScript implementation
- Uses HTML5 Canvas for vector visualization
- No external dependencies required
- Cartesian coordinate system with origin at center
- Units displayed in meters, m/s, and m/s² 