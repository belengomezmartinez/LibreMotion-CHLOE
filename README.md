# CHLOE: Clinical Helper for Locomotion Objective Evaluation

**CHLOE** is an advanced web-based biomechanical visualizer and analysis tool designed to process **C3D** files. The system serves as a manufacturer-agnostic normalization engine, allowing clinicians and researchers to process data from various gait laboratories in a unified environment.

---

## Project Overview
This project is the result of a **Bachelor's Thesis (TFG)** in Biomedical Engineering at the Universidad Politécnica de Madrid (UPM). Its primary objective is to bridge the gap between raw laboratory data exports and clinical interpretation through modern web technologies.

## Key Features
* **Multi-Manufacturer Support:** Validated compatibility with files from **Vicon Motion Systems**, **Motion Analysis Corporation**, **NexErgonomics**...
* **Biomechanical Standardization:** Automatic mapping of heterogeneous labels to the official **Plug-in Gait** nomenclature via a robust `STANDARD_MAP`.
* **Heuristic Signal Classification:** Automated identification of analog channels (EMG, Force, Moments, IMU) using a keyword-scoring system, with a manual override feature for clinical precision.
* **Synchronized 3D/2D Visualization:** Anatomical skeleton rendering powered by **Three.js**, temporally synchronized with analog signal dashboards in **Plotly.js**.

## Technology Stack
* **Backend:** Python 3.9+, Flask, `ezc3d` (Binary C3D parsing), NumPy.
* **Frontend:** JavaScript (ES6+), Three.js (3D Engine), Plotly.js (Signal analytics).
* **Deployment:** Containerized with **Docker** to ensure cross-platform portability and environment reliability.

## Standardization Research
The core logic of CHLOE is based on an exhaustive empirical study of the official **C3D.org** sample database.

* **Anatomical Mapping:** Analyzed naming variations (e.g., `LASI` vs. `L_ASIS`) to create a robust abstraction layer for marker data.
* **Analog Disparity:** Developed the `STANDARD_ANALOG_MAP` to detect signals even in files with non-standard or manually assigned labels. Due to high disparity, the system allows users to reassign data types directly via the UI.

## Installation & Usage

### Prerequisites
* [Docker](https://www.docker.com/) installed on your system.

### Deployment with Docker
To run the application locally, clone the repository and execute the following commands in your terminal:

```bash
# Build the image
docker build -t chloe-visualizer .

# Run the container
docker run -p 8080:8080 chloe-visualizer
```

The application will be available at http://localhost:8080.

### Author
Belén Gómez Martínez – Biomedical Engineering, ETSIT, Universidad Politécnica de Madrid (UPM).

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
