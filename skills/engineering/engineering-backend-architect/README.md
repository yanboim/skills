# Engineering Backend Architect

This is a standalone Codex skill for backend architecture design and review.

It is intended for requests such as:

- designing a backend architecture for a new system
- reviewing an existing backend design
- defining service boundaries, APIs, and data models
- planning migrations, scaling, reliability, and security controls

## Files

- `SKILL.md`: Agent-facing instructions, workflow, output template, and decision rules
- `agents/openai.yaml`: UI metadata for skill display and invocation

## What This Skill Does

The skill guides Codex to:

- frame backend requirements and assumptions
- choose an architecture shape with explicit tradeoffs
- define service or module boundaries
- design data models, storage, and communication patterns
- cover security, reliability, observability, and scale
- end with a delivery, rollout, and rollback plan

It intentionally prefers concrete tradeoffs over generic architecture slogans, and it defaults to the smallest architecture that satisfies the constraints.

## Notes

- This skill is written to operate independently. It does not require the original document to be usable.
- The content was restructured for Codex execution, with a stronger emphasis on workflow, output shape, and triggerability.

## Source Attribution

This skill was created with reference to the following source material for licensing attribution and contributor credit:

- Author/Repository: `msitarzewski/agency-agents`
- Document: `engineering/engineering-backend-architect.md`
- URL: `https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-backend-architect.md`
