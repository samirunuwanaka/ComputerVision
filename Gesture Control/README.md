# Gesture Control & Invisibility Mode

A real-time computer vision application built with **Python**, **OpenCV**, and **MediaPipe**. The project performs real-time human selfie segmentation and hand gesture tracking to replace the user with a pre-captured background, creating a seamless invisibility effect.

---

## 📁 Directory Structure

```text
Gesture Control/
├── main.py       # Application entry point, video capture, hotkeys, and main loop
├── engine.py     # Segmentation engine, gesture tracker, background model, and HUD
└── README.md     # Module documentation
```

---

## ✨ Features

- **Real-Time Invisibility Effect**: Blends background and foreground frames upon activation.
- **MediaPipe Selfie Segmentation**: Accurate real-time person segmentation without a physical green screen.
- **Hand Gesture Controls**:
  - **Show Interaction Box**: Spread both hands apart to display the yellow interaction bounding box.
  - **Toggle Invisibility**: Pinch your thumb and index finger together on either hand to toggle invisibility mode on and off.
- **Automatic Dependency Check**: Automatically checks for required libraries (`opencv-python`, `numpy`, `mediapipe`) on launch and installs missing packages if needed.
- **Multi-Camera & Platform Support**: Supports webcam indexing on Windows (DirectShow/MSMF/Auto), Linux, and macOS.
- **Real-Time HUD**: Displays FPS, processing device (CPU/GPU), and current status indicators.

---

## 🚀 How to Run

Launch the application from this directory:

```bash
python main.py
```

Or pass a specific camera index:

```bash
python main.py 1
```

### Keyboard Controls:
- **`R`**: Recalibrate background baseline (3 seconds).
- **`S`**: Take a screenshot.
- **`Q`** or **`ESC`**: Exit application.
