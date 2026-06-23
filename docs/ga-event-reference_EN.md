# Google Analytics Event Reference

[中文](./ga-event-reference.md) | English

This document describes the Google Analytics events currently implemented in the marketplace app under `web/`.

## Document Information

- **Type**: Reference
- **Audience**: Repository maintainers who need to verify event reporting in GA or adjust analytics instrumentation
- **Goal**: Record event names, triggers, parameters, and implementation locations

## Scope

Included:

- the measurement ID currently configured in the app
- event names and parameter payloads implemented in code
- file locations responsible for sending each event
- practical checks for validating event delivery

Excluded:

- GA dashboard setup outside this repository
- custom dimensions or audience configuration in GA
- historical analytics interpretation

## Measurement ID

The app currently sends events to `G-GYPECK2498`.

The GA bootstrap is defined in [layout.tsx](../web/src/app/layout.tsx).

## Event Summary

| Event name | Trigger | Key parameters |
|---|---|---|
| `page_view` | Initial page load and subsequent route or query-string changes | `page_path`, `page_location`, `page_title` |
| `nav_github_click` | Click on the GitHub link in the site header | `target`, `location` |
| `skill_list_impression` | A skill card first becomes visible in the viewport | `skill_slug`, `skill_name`, `position`, `list_type` |
| `skill_card_click` | Click on a skill card in the marketplace grid | `skill_slug`, `skill_name`, `position`, `source` |
| `skill_detail_view` | A skill detail modal opens with a loaded skill | `skill_slug`, `skill_name`, `install_name` |
| `skill_install_copy` | Click on the copy button for the installation command | `skill_slug`, `skill_name`, `install_name` |
| `skill_source_click` | Click on the GitHub source link inside the skill modal | `skill_slug`, `skill_name`, `target` |
| `skill_search` | A search query remains unchanged for 500ms | `query`, `result_count` |

## Common Parameters

| Parameter | Meaning |
|---|---|
| `skill_slug` | Route slug used by the marketplace and detail API |
| `skill_name` | Skill name displayed in the UI |
| `install_name` | Installation identifier used in the `npx skills add ... --skill` command |
| `position` | One-based card position in the current ordered marketplace grid |
| `target` | Outbound target name for a clicked link |

## Event Reference

### `page_view`

**Purpose**: Track page views for the initial render and client-side navigation.

**Trigger**: Sent by a dedicated client component whenever the pathname or query string changes.

| Parameter | Value |
|---|---|
| `page_path` | Current pathname plus query string |
| `page_location` | Full browser URL |
| `page_title` | Current document title |

Implementation:

- [GaPageViewTracker.tsx](../web/src/components/GaPageViewTracker.tsx)
- [gtag.ts](../web/src/lib/gtag.ts)
- [layout.tsx](../web/src/app/layout.tsx)

Automatic GA page views are disabled with `send_page_view: false` to prevent duplicate reporting when manual route tracking is enabled.

### `nav_github_click`

**Purpose**: Track clicks on the global GitHub repository link in the header.

**Trigger**: Sent when the header GitHub link is clicked.

| Parameter | Value |
|---|---|
| `target` | `github_repo` |
| `location` | `header` |

Implementation: [GithubNavLink.tsx](../web/src/components/GithubNavLink.tsx)

### `skill_list_impression`

**Purpose**: Track which skill cards were actually seen by the user.

**Trigger**: Sent once per card when the card first intersects the viewport.

| Parameter | Value |
|---|---|
| `skill_slug` | Current skill slug |
| `skill_name` | Current skill display name |
| `position` | One-based position in the current grid |
| `list_type` | `marketplace_grid` |

Implementation: [SkillCard.tsx](../web/src/components/SkillCard.tsx)

The event is deduplicated per mounted card. Visibility is based on `IntersectionObserver` with a `0.5` threshold.

### `skill_card_click`

**Purpose**: Track clicks from the marketplace grid into skill details.

**Trigger**: Sent when a user clicks a skill card.

| Parameter | Value |
|---|---|
| `skill_slug` | Current skill slug |
| `skill_name` | Current skill display name |
| `position` | One-based position in the current grid |
| `source` | `marketplace_grid` |

Implementation: [SkillCard.tsx](../web/src/components/SkillCard.tsx)

### `skill_detail_view`

**Purpose**: Track successful skill detail views.

**Trigger**: Sent when the detail modal is open and a concrete skill has loaded.

| Parameter | Value |
|---|---|
| `skill_slug` | Current skill slug |
| `skill_name` | Current skill display name |
| `install_name` | Installation identifier used by the copy command |

Implementation: [SkillModal.tsx](../web/src/components/SkillModal.tsx)

The event is not sent during loading or error states. Repeated renders of the same open skill are deduplicated.

### `skill_install_copy`

**Purpose**: Track installation intent from the marketplace UI.

**Trigger**: Sent when the user clicks the copy button for the generated installation command.

| Parameter | Value |
|---|---|
| `skill_slug` | Current skill slug |
| `skill_name` | Current skill display name |
| `install_name` | Installation identifier used by the copy command |

Implementation: [SkillModal.tsx](../web/src/components/SkillModal.tsx)

### `skill_source_click`

**Purpose**: Track outbound clicks from the skill modal to the GitHub source page.

**Trigger**: Sent when the user clicks the source link in the modal header.

| Parameter | Value |
|---|---|
| `skill_slug` | Current skill slug |
| `skill_name` | Current skill display name |
| `target` | `github_skill_source` |

Implementation: [SkillModal.tsx](../web/src/components/SkillModal.tsx)

### `skill_search`

**Purpose**: Track explicit user search behavior in the marketplace.

**Trigger**: Sent when a non-empty search query remains unchanged for 500ms.

| Parameter | Value |
|---|---|
| `query` | Trimmed search text |
| `result_count` | Number of results in the filtered skill list |

Implementation: [Marketplace.tsx](../web/src/components/Marketplace.tsx)

Empty searches are not reported. Identical query and result-count combinations are deduplicated.

## Validation Checklist

1. Load the homepage and confirm a `page_view` event appears.
2. Scroll through the marketplace and confirm `skill_list_impression` events appear for visible cards.
3. Click a card and confirm `skill_card_click` followed by `skill_detail_view`.
4. Click the copy button in the modal and confirm `skill_install_copy`.
5. Click the modal GitHub source link and confirm `skill_source_click`.
6. Enter a non-empty query, pause for at least 500ms, and confirm `skill_search`.
7. Click the header GitHub link and confirm `nav_github_click`.

## Code Map

- [layout.tsx](../web/src/app/layout.tsx)
- [gtag.ts](../web/src/lib/gtag.ts)
- [GaPageViewTracker.tsx](../web/src/components/GaPageViewTracker.tsx)
- [GithubNavLink.tsx](../web/src/components/GithubNavLink.tsx)
- [Marketplace.tsx](../web/src/components/Marketplace.tsx)
- [SkillCard.tsx](../web/src/components/SkillCard.tsx)
- [SkillModal.tsx](../web/src/components/SkillModal.tsx)
