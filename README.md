# 💎 AURA CAD STUDIO v5.0 — Web-Based Parametric Jewelry Engine

> An enterprise-grade, browser-based 3D CAD Studio for real-time parametric ring design, automatic gemstone pave distribution, WASM CSG boolean seat cutting, and 1-click watertight STL manufacturing export.

![AURA CAD Studio Banner](https://img.shields.io/badge/WebGL-Three.js-amber?style=for-the-badge&logo=three.js)
![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![WASM CSG](https://img.shields.io/badge/Engine-BVH--CSG-emerald?style=for-the-badge)

---

## ✨ Key Enterprise Features

* **🎛️ Parametric Ring Band Engine:** Real-time geometry synthesis with dynamic Inner Radius, Band Width, Wall Thickness, and Profile Shapes (*Comfort Fit*, *Flat/Boxy*, *Knife Edge*).
* **✂️ True WASM CSG Boolean Subtraction:** Real-time Boolean subtraction that cuts 3D tapered gem seats and culet drill holes directly into the metal band mesh.
* **✨ Dual Gem Pave System:**
  * **Parametric Radial Array:** Auto-distribute gemstones across 180° Half Eternity or 360° Full Eternity patterns with equal mathematical spacing.
  * **Manual Raycast Placement:** Surface normal raycasting for precise single-click diamond setting.
* **📏 Live Distance & Structural Clearance Check:** Real-time 3D distance vector line overlays and clearance calculation (<0.2mm structural risk warning).
* **💰 Live B2B Wholesale Pricing Engine:** Mass, volume ($cm^3$), gold weight ($g$), total carat weight ($TCW$), and live estimated wholesale cost calculations.
* **🖨️ 1-Click Watertight STL Export:** Instant binary `.STL` file generation ready for 3D Wax Printers and CNC casting.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework:** React 18 with Vite
* **3D & Graphics Engine:** React Three Fiber (R3F), Three.js, `@react-three/drei`
* **Constructive Solid Geometry (CSG):** `three-bvh-csg` (High-performance BVH-accelerated CSG)
* **Styling & UI:** Tailwind CSS, Glassmorphic Design, Lucide Icons
* **Language:** TypeScript 5.0 (Strict Modular Architecture)

---

## 📁 Project Structure

```text
src/
├── types/
│   └── cad.ts                  # Shared TypeScript interfaces & domain types
├── components/
│   ├── 3d/
│   │   ├── GemstoneMesh.tsx    # Diamond & 4-Prong 3D mesh
│   │   ├── GemDistanceOverlay.tsx # 3D Clearance line & distance HUD
│   │   └── ParametricRing.tsx  # Dynamic lathe ring & CSG Boolean cutter engine
│   └── ui/
│       └── Sidebar.tsx         # Inspector panel, controls & live costing HUD
└── App.tsx                     # Main viewport canvas & state orchestrator