# Computer Vision & Machine Vision Repository

Welcome to the **Machine Vision** repository. This workspace brings together coursework for **EN3160: Image Processing and Machine Vision**, paper review & implementation of state-of-the-art vision models, real-time gesture control computer vision applications, and academic tutorials.

---

## 📁 Repository Overview

```text
Machine Vision/
├── Assignment/               # EN3160 Assignment 1 (Notebooks, Slides, Specifications, Images)
├── Gesture Control/          # Real-Time Invisibility & Gesture Control Application (main.py, engine.py)
├── Paper presentation/       # WACV 2025 Paper Review & PyTorch Code Implementation (StrDA)
├── Tutorials/                # Course tutorial sheets & study materials
├── Pipfile                   # Pipenv dependency configuration
└── LICENSE.txt               # Repository license
```

---

## 🖐️ 1. Real-Time Application: Gesture Control & Invisibility Mode (`Gesture Control/`)

A real-time computer vision application using **OpenCV** and **MediaPipe** that creates an invisibility illusion by replacing detected foreground human pixels with a calibrated background model.

### Key Features:
- **MediaPipe Selfie Segmentation**: Real-time person masking.
- **Hand Gesture Controls**:
  - **Show Interaction Box**: Spread both hands apart to display active bounds.
  - **Toggle Invisibility**: Pinch thumb and index finger together on either hand to vanish/reappear.
- **Automatic Setup & Hardware Acceleration**: Auto-installs required packages (`opencv-python`, `numpy`, `mediapipe`) and detects CUDA GPU acceleration if available.

### How to Run:
```bash
cd "Gesture Control"
python main.py
```
*(Press `R` to recalibrate background, `S` for screenshot, `Q` or `ESC` to exit)*

---

## 🎓 2. EN3160 Assignment 1: Intensity Transformations & Filtering (`Assignment/`)

Contains starter templates, task breakdowns, interactive HTML presentation decks, and image datasets for **EN3160 Assignment 1**.

### Covered Topics (Q1 – Q10):
- **Q1: Piecewise Linear Transformation**: Custom intensity mapping function with lookup tables.
- **Q2: Tissue Accentuation**: Contrast adjustment to highlight White and Gray Matter in MRI brain slices.
- **Q3: Gamma Correction in $L^*a^*b^*$**: Color space transformation and luminance channel power-law adjustments.
- **Q4: Vibrance Enhancement**: Non-linear saturation scaling on the $S$ channel in HSV space.
- **Q5: Custom Histogram Equalization**: Manual histogram calculation and CDF mapping without OpenCV helper functions.
- **Q6: Selective Foreground Equalization**: HSV thresholding mask extraction and selective histogram equalization.
- **Q7: Sobel Edge Filtering**: 2D spatial convolution and separable 1D horizontal/vertical filtering kernels.
- **Q8: Image Zooming & Interpolation**: Nearest-Neighbor vs Bilinear interpolation evaluated with Normalized SSD.
- **Q9: GrabCut & Background Blurring**: Foreground segmentation via `cv.grabCut` combined with background Gaussian blurring.
- **Q10: Edge-Preserving Bilateral Filtering**: Comparative analysis of Gaussian blur, OpenCV bilateral filter, and custom bilateral filter implementation.

### Quick Start:
```bash
cd Assignment
jupyter notebook EN3160_Assignment_01_Template.ipynb
```

---

## 📄 3. Paper Review & Code Implementation (`Paper presentation/`)

Contains the paper review, presentation slides, and PyTorch implementation for the WACV 2025 paper:
> **"Stratified Domain Adaptation: A Progressive Self-Training Approach for Scene Text Recognition"** (StrDA)

### Module Breakdown:
- **Paper Specification**: `Le_Stratified_Domain_Adaptation_..._paper.pdf`
- **Presentation Deck**: `StrDA_Canva_Style_Presentation.pptx`
- **Codebase (`Paper presentation/Paper code implimentation/`)**:
  - `stage1_DD.py`: Stage 1 Domain Discrepancy alignment.
  - `stage1_HDGE.py`: Stage 1 Hierarchical Domain Guided Feature Enhancement.
  - `stage2_StrDA.py`: Stage 2 Stratified Domain Adaptation self-training pipeline.
  - `supervised_learning.py`: Baseline supervised training script.
  - `test.py`: Benchmark evaluation module.
  - `download_dataset.py`: Synthetic and real scene text recognition dataset preparation.

---

## 📚 4. Tutorials (`Tutorials/`)

Contains problem sets and reference sheets for machine vision concepts:
- `en3160_tutorial_t1.pdf`: Fundamental image processing, intensity transformations, and spatial filtering problems.

---

## 🛠️ Environment & Dependencies

Requirements vary by submodule:
- **Gesture Control**: Python 3.10 – 3.12 (`opencv-python`, `numpy`, `mediapipe`)
- **Assignment**: Python 3.8+ (`numpy`, `opencv-python`, `matplotlib`, `scipy`, `jupyter`)
- **Paper Implementation**: Python 3.8+, PyTorch, Torchvision, LMDB, Pillow

Setup using Pipenv:
```bash
pipenv install
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.
