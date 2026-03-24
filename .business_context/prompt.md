# What we need to build

## High level overview
There are two documents in the .business_context directory which describe the state and event models for the possessions business process. 
I need to be able to visualise a process based on the state and event models which I can then manipulate and see the impact of removing/changing a process on the state and event model. 

## Tech stack
Please create an SPA using React or Next JS, with a node backend. Use Tailwind as a styling framework. 

## Event model
I want to be able to see the event models in a clear and concise way. Currently users are using poss/.business_context/Event Model Possession Service V0.1.xlsx which is far from ideal. A user should be able to see and explore the event models through a clean UI. 

## State model
The same principles apply to the event models... a user should be able to see and explore the state models in poss/.business_context/State model and dependencies v0.10.pdf through a clean UI. 

## Possessions digital twin
We need a digial twin for the possession process which I can view and interact with to determine if a business process is viable given the end state describe in the state and event models. 

## Clarifications (round 2)

- **Toggling granularity**: Effects should be visible at three levels simultaneously — micro (a specific event), meso (a case journey/path), and macro (whole process/claim type viability).
- **Digital twin interaction modes**: Both (a) step through a case event by event and (b) set conditions upfront and compute a path.
- **Valid end states**: Inferred from the model (states with no outgoing transitions).
- **Handling messy/incomplete data**: Treat uncertainty as first-class content. Flag states and events with unresolved notes, placeholder text, or open questions visually. Show a completeness indicator per state and per claim type. This surfaces where the model needs more work — directly useful for the shaping purpose.

## Clarifications (round 1)

- **State model format**: It is a diagram (PDF). An image may be needed to view it.
- **Manipulation**: Toggling scenarios — not permanently editing the model, but switching things on/off to explore impact.
- **Impact visualisation**: Highlighted paths that break and unreachable states.
- **Digital twin scope**: Single case simulation, not system-wide volume modelling.
- **Viability definition**: A case must be able to reach a valid end state for its claim type.
- **Users**: Business analysts fluent in business process understanding, not technical users.
- **Context**: Internal tooling for a small group to interrogate understanding and shape system design.
- **Styling**: No constraint to GOV.UK Design System. Use whatever framework best achieves the brief. Inspiration: https://www.siteinspire.com/websites/category/web-and-interactive-design

## What you should do next
Do not write any code. Think hard to determine how this could be achived given the artifacts you have access to in .business_context. This should be something we build togther and I want you to ask me questions so we can flesh out this very loose idea. We should create a spec.md which can be iterated on.


