# Yanbo Skills Marketplace Design Philosophy

[中文](./design-philosophy.md) | English

The core objective of this project is to build an **efficient, minimalist, and developer-friendly** AI skill discovery and distribution platform. Its design and implementation follow the principles below, which should also guide future iterations and similar projects.

## 1. Minimalist Design

- **SaaS aesthetics**: Avoid flashy decoration. Use a neutral palette and generous whitespace to improve information-scanning efficiency.
- **Atomic functionality**: Remove nonessential display fields such as author, version, and category tags so users can focus on the skill name and functional description.
- **Unified icon language**: Use consistent terminal and tool-oriented icons to reinforce the command-line nature of skills.

## 2. Efficiency-First Interaction

- **Embedded installation commands**: Put installation instructions directly in the skill details and provide one-click copying. The `npx` CLI connects discovery to installation.
- **Immersive modals**: Open details instantly without breaking browsing context. Closing the modal returns users to the same position at minimal interaction cost.
- **Deep linking**: Give every skill a unique URL parameter (`?skill=slug`) for direct sharing and precise access.

## 3. Dynamic Data Model (File-Based CMS)

- **Git as the database**: Avoid a traditional backend database and generate skill data by scanning the local file system.
- **Low-configuration expansion**: Add a directory and `SKILL.md` under `skills/`, then run the data generator to make the marketplace recognize and display the new skill.

## 4. Performance and SEO

- **Hybrid rendering**: Preload the skill list on the server. Fetch complete skill content only when a user opens a modal or visits a deep link.
- **Fast initial load**: Read the initial list on the server so the client can render without an additional API request.

## 5. Cross-Platform Consistency

- **Native dark mode**: Support system theme switching across both the interface and favicon for comfortable long-term use.
- **Responsive layout**: Preserve information hierarchy across cards, search, and detail modals on desktop and mobile.
- **Accessible interaction**: Use semantic controls, visible keyboard focus states, and clear assistive labels.

---

This document records the project's design core. Future features and visual changes should be evaluated against these principles.
