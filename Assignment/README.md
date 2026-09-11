# EN3160: Image Processing and Machine Vision
## Assignment 1: Intensity Transformations and Neighborhood Filtering

This repository contains the starter templates, task breakdowns, presentation slides, and image assets for **EN3160 Assignment 1**.

---

## 📁 Repository Structure

```text
Assignment/
├── EN3160_Assignment_01_Template.ipynb # Starter Jupyter Notebook template with stubs & instructions
├── assignment_01_presentation.html      # Interactive Reveal.js presentation deck (Exportable to PDF)
├── en3160_assignment_01.pdf             # Official assignment problem specification
├── images/                              # Test images for assignment tasks
│   └── images/                          # im01.png, im02.png, im03.png, im04.jpg, im05.jpg, etc.
└── README.md                            # Project documentation
```

---

## 📋 Assignment Overview & Task Breakdown

| Question | Topic | Core Tasks / Objectives | Target Image |
| :--- | :--- | :--- | :--- |
| **Q1** | **Piecewise Linear Transformation** | Implement `intensity_transform(im, breakpoints)` with LUT/interpolation and plot transformation curve. | `im01.png` |
| **Q2** | **Tissue Accentuation** | Design breakpoint mappings to accentuate White Matter and Gray Matter in brain slice. | `im02.png` |
| **Q3** | **Gamma Correction in $L^*a^*b^*$** | Convert to $L^*a^*b^*$ color space, apply power-law transform to $L^*$ plane, plot histograms. | `im03.png` |
| **Q4** | **Vibrance Enhancement** | Non-linear Gaussian saturation boost $f(x)$ on $S$ channel in HSV space; tune parameter $a$. | `im04.jpg` |
| **Q5** | **Custom Histogram Equalization** | Manual histogram equalization from scratch (PDF, normalized CDF mapping) without OpenCV functions. | `im05.jpg` |
| **Q6** | **Selective Foreground Equalization** | HSV plane thresholding, foreground mask extraction, cumulative histogram equalization on foreground. | `q1.jpeg` |
| **Q7** | **Sobel Filtering** | Edge detection via `cv.filter2D`, manual 2D convolution, and 1D horizontal/vertical separable filters. | `q2.jpeg` |
| **Q8** | **Image Zooming & Interpolation** | Implement `zoom_image(im, factor, method)` for Nearest-Neighbor & Bilinear; evaluate with Normalized SSD. | Test pairs |
| **Q9** | **GrabCut & Background Blurring** | Segment flower using `cv.grabCut`, apply Gaussian blur to background, analyze edge artifacts. | Daisy image |
| **Q10**| **Edge-Preserving Bilateral Filtering**| Compare OpenCV `bilateralFilter` vs Gaussian blur vs custom manual bilateral filter implementation. | `im09.jpg` |

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure Python 3.8+ is installed along with the required libraries:
```bash
pip install numpy opencv-python matplotlib scipy jupyter
```

### 2. Running the Notebook Template
Launch Jupyter Notebook or Open in VS Code / Jupyter Lab:
```bash
jupyter notebook EN3160_Assignment_01_Template.ipynb
```
Fill in the function stubs, execute code cells, and record observations in the Markdown discussion sections.

---

## 📺 Interactive Reveal.js Presentation

The file `assignment_01_presentation.html` contains an interactive, web-based presentation deck summarizing the assignment tasks.

### Viewing in Browser
Open `assignment_01_presentation.html` directly in any web browser (Chrome, Edge, Firefox).

### Exporting Presentation to PDF
1. Append `?print-pdf` to the file URL in your browser:
   ```text
   file:///path/to/Assignment/assignment_01_presentation.html?print-pdf
   ```
2. Press `Ctrl + P` (or `Cmd + P` on macOS) to open the print dialog.
3. Select **Destination:** `Save as PDF`.
4. Select **Layout:** `Landscape`.
5. Check **Background graphics**.
6. Click **Save**.

---

## 📜 Submission & Grading Policy

- **Final Report Format:** Export your completed Jupyter Notebook directly to PDF named `your_index_a01.pdf`.
- **Page Limit:** Maximum **10 pages** (-20 marks per page exceeding 10 pages).
- **GitHub Requirement:** Include your GitHub profile link inside the report. Commit your work regularly with meaningful messages to document progress.
- **Weightage:** 5% of final grade.
