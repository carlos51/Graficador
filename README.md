# Graficador
## Project Overview

This project is an **unfinished experimental 3D mathematical visualizer** built with **Three.js** and **MathQuill**.

The main goal of the project is to explore the visualization of mathematical surfaces in three dimensions while allowing **real-time interaction with both functions and coordinate bases**.

Users can:
- Input mathematical expressions using LaTeX-style notation
- Generate 3D surfaces dynamically from those expressions
- Modify the basis vectors \( \vec i, \vec j, \vec k \)
- Observe how surfaces and grids transform under a change of basis
- Navigate the scene using orbital camera controls

The surface geometry is generated manually by sampling a function over a grid, constructing vertices and indices, and applying a custom transformation matrix derived from the selected basis vectors.

This project focuses on understanding:
- Surface discretization
- Linear transformations in 3D space
- Real-time geometry updates
- Interactive mathematical visualization

---

## Current Status

⚠️ **This project is not finished.**

Some planned or incomplete aspects include:
- Limited validation of mathematical input
- Missing optimization for complex surfaces
- No UI controls for domain boundaries
- Lack of documentation and examples
- Incomplete grid and axis interaction features

Despite this, the project successfully demonstrates:
- Real-time function parsing and surface generation
- Manual geometry construction using Three.js
- Dynamic change-of-basis visualization
- Integration of math input with 3D rendering

This repository represents an exploratory and learning-focused project rather than a polished visualization tool.

---

## Demo

### GIF Preview
<p align="center">
  <img src="images/graficador.gif" width="600" />
</p>

*Short preview showing real-time surface generation and interaction.*

---

### Demo
 
https://carlos51.github.io/Graficador/
