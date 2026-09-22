# Architecture Decision Log

## ADR-001 — Spring Boot Main Backend
**Status:** ACCEPTED

Main backend is Java 17 + Spring Boot 3.

## ADR-002 — AI as Music Copilot
**Status:** ACCEPTED

AI assists rather than silently replacing user creativity. Material changes require preview/acceptance.

## ADR-003 — Browser Is Primary Music Environment
**Status:** ACCEPTED

The product provides music creation directly in the browser; low-latency interactions favor Web Audio API client-side processing.

## ADR-004 — Frontend Stack
**Status:** ACCEPTED

HTML5 + Vanilla CSS3 (Glassmorphism design) + JavaScript (ES6+ OOP Modules) + Web Audio API.

## ADR-005 — Database
**Status:** ACCEPTED

PostgreSQL 15 (Docker containerized) + H2 Database (In-Memory profile fallback).

## ADR-006 — AI / Music Copilot Service
**Status:** ACCEPTED

Integrated Spring Boot Algorithmic & Generative AI Copilot Service (`AiCopilotService`) + Client-side Autocorrelation Pitch Tracker (`PitchTracker.js`).

## ADR-007 — Hum/Sing to Melody
**Status:** ACCEPTED

Integrated Web Audio MediaStream microphone recorder + Autocorrelation pitch extraction to music timeline.

## ADR-008 — Real-Time Collaboration
**Status:** DEFERRED

Future scope unless explicitly promoted into MVP.
