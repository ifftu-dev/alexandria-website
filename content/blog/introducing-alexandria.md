---
title: Introducing Alexandria
standfirst: An honest attempt to make knowledge — and its recognition — truly free. For everyone. Forever.
date: 2026-07-31
author: Pratyush Pundir
readingTime: 10 min read
kind: Announcement
description: Announcing and open-sourcing Alexandria — a desktop and mobile application that turns every device into a full node in a decentralised education network, with verifiable, learner-owned credentials.
---

Today I am publicly announcing and open-sourcing **Alexandria**: a desktop and mobile
application that turns every device into a full node in a decentralised education network,
with verifiable credentials the learner owns outright.

## Why build this

Education might be the only way out. Wealth concentrates, power consolidates, and the one
lever that has ever reliably moved a person from one side of that line to the other is
what they know and can prove they know. That lever is expensive and gatekept. It should be
free, universal, verifiable, and owned by the people who earn it.

Consider a teenager in a developing nation with a working internet connection. They can
watch the same MIT lectures as a student at Cambridge. Identical material, identical
hours, identical effort. What they cannot get is the credential that opens a door on the
other side of the world.

The knowledge gap has closed. The recognition gap has not.

Solve recognition and human knowledge becomes portable in a way it has never been —
genuinely free, and worth something to the person who holds it.

## The problem, specifically

The internet solved distribution. Khan Academy, YouTube and a hundred others put the
material within reach of anyone with a connection. What none of them solved is
*recognition*, and almost every attempt still runs through one company's infrastructure.

Alexandria is different in one structural way: no central servers hold the platform
together. If this organisation disappeared tomorrow, credentials would still verify,
courses would still be reachable, and reputation records would still exist.

## How this compares to what exists

| Approach | Strengths | Limitations |
| :--- | :--- | :--- |
| MOOCs (Coursera, edX, Udemy) | Structured courses, reputable instructors | Certificates cost money, are platform-issued, and carry limited weight elsewhere |
| Free content (Khan Academy, YouTube) | Truly free, globally accessible | No verifiable credential at the end |
| University credentials | Widely recognised | Expensive, geographically restricted, institution-controlled |
| LinkedIn Learning, digital badges | Convenient, employer-facing | Centralised, proprietary, dependent on the platform |

The gap is the same in every row. We have free content. We do not have free recognition.

## What Alexandria actually is

A local application on Mac, Windows, Linux, iPhone and Android that makes each device a
full participant in the network. Six things it does:

**A learning platform.** Courses, video tutorials, and credentialed practitioner opinions.
Lessons carry interactive exercises and in-browser code editors — Python, JavaScript,
TypeScript, C++ — that run locally. Live peer-to-peer video tutoring connects a learner
directly to a mentor. The interface runs in nine languages, including Hindi, Bengali,
Telugu, Marathi and Urdu. Lessons move between devices peer-to-peer.

**A skill graph.** Every lesson, credential and opinion ties to a three-tier taxonomy —
broad fields, subjects, individual skills — with prerequisite edges and mastery levels
drawn from Bloom's taxonomy. That shared vocabulary is what lets a credential mean the
same thing in two countries.

**Learner-owned credentials.** Issued as W3C Verifiable Credentials, signed by the learner
under their own `did:key`. No platform controls them. Completion can be witnessed by
Cardano validators with optional hash anchoring for tamper-evidence, and the credential
still verifies offline, independently, without any of that.

**Reputation scoring** based on an educator's measured impact on learner progression,
expressed as a distribution with confidence bounds rather than a single number. No
five-star averages. No follower counts.

**On-device integrity assessment.** Sentinel detects cheating during an assessment
locally — no keystroke data, camera feed or behavioural record is transmitted anywhere.

**Decentralised governance** through skill-based DAOs, where voting power comes from
demonstrated proficiency rather than stake or seniority. Proposals move through draft,
committee review and public vote with supermajority thresholds, and outcomes anchor to
Cardano so the record can be audited.

## What is being released

- **The codebase** — everything except enterprise features, under the expat MIT licence
- **Vision paper** — the motivation, the design, and what it means for each stakeholder
- **Protocol specification** — normative detail: wire formats, validation, peer scoring,
  credentials, governance, threat mitigation
- **Project website** — [alexandria.ifftu.dev](https://alexandria.ifftu.dev), with
  early-access signup

## What is honest about the current state

The core architecture is implementation-complete with extensive automated testing. A
February security audit returned 32 findings; 21 were fixed in the March remediation pass
and 11 remain open.

The gaps I would name without being asked: the interface needs real design work, my
thinking on the instructor economy is incomplete, there is no content moderation, frontend
test coverage is thin, and the long-term model for non-profit sustainability is
underdeveloped.

I am publishing at this stage deliberately — to build in the open and get the right people
contributing early, rather than presenting something finished and unexaminable.

## How to contribute

- **Educators** can deepen the pedagogical models, particularly for subjects that resist
  quantification
- **Systems engineers** can adversarially test the peer-to-peer protocol at scale
- **Cryptographers** can review the credential vault, the identity system and the Sentinel
  integrity layer
- **Policy specialists** can work on government credential recognition and regulatory
  frameworks
- **Designers** can run UX testing with non-technical users
- **Learners** can use it, break it, and tell us what happened

## How to get started

Prerequisites, build instructions, onboarding and documentation are at
[github.com/ifftu-dev/alexandria](https://github.com/ifftu-dev/alexandria).

## The bet

Alexandria is a wager that the recognition of human capability can be a public good. With
no centralised control point, there is no meaningful single point of failure.

The challenges are real and I am not going to pretend otherwise: the cold-start problem,
employer trust, and whether peer-to-peer holds up at scale. I would rather find out than
sit on it.

[pratyush@ifftu.dev](mailto:pratyush@ifftu.dev)
