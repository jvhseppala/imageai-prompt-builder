# 🎨 ImageAI Prompt Builder

A professional, layer-based prompt construction tool designed for **Midjourney v6 & v7** in mind, but usable for other tools as well. 

This application helps users overcome "blank page paralysis" by structurally breaking down image generation into three distinct layers: **Subject Definition**, **Atmosphere/Style**, and **Technical Parameters**.

## 🔗 Live Demo
[**Click here to use the Prompt Builder**](https://jvhseppala.github.io/imageai-prompt-builder/)
## ✨ Key Features

### 1. 🧠 Layered Prompt Logic
Instead of a chaotic text box, the app guides you through a logical flow:
* **Subjects:** Define up to 3 distinct subjects with specific ages, outfits, and individual poses.
* **Group Dynamics:** Automatically generates interaction logic (e.g., *"Subject A and Subject B are dancing together"*).
* **Atmosphere:** Layer on art styles, lighting conditions, camera angles, and shot types.

### 2. 🎛️ Midjourney-Specific Controls
Full control over technical parameters without memorizing CLI flags:
* **Model Selection:** v6, v7, and Niji (Anime).
* **Aspect Ratios:** Standard presets + Custom input support.
* **Stylization:** Sliders for `--chaos`, `--stylize`, and `--weird`.
* **Utility:** Seamless tiling (`--tile`) and Repeat (`--r`) controls.

### 3. 🚀 The Workflow
Designed as the first step in a high-quality generation pipeline:
1.  **Construct:** Build the "Base Prompt" logic in this tool to ensure structural accuracy.
2.  **Refine:** Copy the output and paste it into **Gemini** (using the custom "XYZ" Gem) for creative linguistic polish.
3.  **Generate:** Paste the final result into Midjourney.

## 🛠️ Tech Stack

* **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** GitHub Pages

## 🤝 Contributing

Feel free to fork this repository and submit pull requests. Suggestions for new Midjourney parameters or UI improvements are welcome!