---
name: ui_skeleton_generator
description: Generates UI skeleton screens (loading placeholders) by analyzing frontend component structure and layout without executing application logic.
capabilities:
  - dom_structure_analysis
  - layout_mapping
  - placeholder_generation
  - css_animation_generation
  - framework_agnostic_rendering
tools:
  - DOM_Parser
  - CSS_Extractor
  - CodeAnalyzer
---

# UI Skeleton Generator Skill

## 1. Overview

The UI Skeleton Generator creates structural loading placeholders based on frontend code.

It analyzes UI components and layout structure to generate skeleton screens that improve perceived performance and user experience during loading states.

This skill operates using static analysis and does not execute application logic.

---

## 2. Supported Technologies

This skill supports:

- HTML and CSS
- React (JSX / TSX)
- Vue
- Angular
- Tailwind CSS
- Component-based UI frameworks

---

## 3. Core Responsibilities

- Extract UI structure from DOM, JSX, or templates
- Identify containers, sections, and visual components
- Map layout using spacing and positioning rules
- Replace content with skeleton placeholders
- Generate clean and reusable skeleton UI code
- Suggest lightweight loading animations

---

## 4. Functional Capabilities

### 4.1 DOM / Component Extraction

- Detect containers such as div, section, main
- Detect media elements such as img and video
- Detect text elements such as headings, paragraphs, spans
- Detect interactive elements such as buttons and inputs
- Ignore all logic, hooks, and business functions

---

### 4.2 Layout Mapping

- Analyze width and height
- Analyze padding and margin
- Detect flexbox and grid layouts
- Preserve structure to avoid layout shift

---

### 4.3 Placeholder Generation

Element transformations:

- Text → gray bars
- Image → rectangle or circle
- Avatar → circle
- Button → rounded block

---

### 4.4 Animation Generation

Provide optional animations such as shimmer and pulse.

Example:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #eee 25%,
    #ddd 37%,
    #eee 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```