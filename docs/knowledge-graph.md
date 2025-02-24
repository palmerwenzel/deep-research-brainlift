# Knowledge Graph System: Design and Implementation Plan

## Overview
The knowledge graph system is designed to organize, visualize, and track a user's learning journey across various concepts. It is built to be adaptive, user-driven, and focused on measuring Depth of Knowledge (DoK) at multiple levels. Leveraging natural language and LLMs, the system manages complex, interconnected information while remaining scalable and user-friendly.

### Key Features
- **Agentic Conversations**: The LLM guides the user through discussions to facilitate learning, and uses tools to automatically structure knowledge from the discussion into the knowledge graph.
- **Depth of Knowledge (DoK) Tracking**: A summative scoring system measures mastery at each level, from basic recall (DoK 1) to synthesis (DoK 4).
- **AI-Powered Management**: LLMs handle tagging, suggest structural changes, and support Retrieval-Augmented Generation (RAG) for context-aware interactions.

## Core Structure
The knowledge graph follows a hierarchical structure:
- **Domain**: The broadest domain (e.g., *Baseball*).
- **Area**: Major areas within a Domain (e.g., *Pitching*).
- **Concept**: Specific focus areas within a Area (e.g., *Pitching Physics*).
- **Aspects**: Finer divisions under a Concept (e.g., *Spin Rate* under *Pitching Physics*).
- **Information**: Natural language content stored under Aspects, tagged by DoK level and with LLM-generated Tags.

## Managing Growth
As knowledge deepens, the Information under a Aspect may grow too large for effective management or LLM processing. To handle this growth:

### Critical Mass Detection
- **Token-Based Trigger**: Monitor the token count of Information under a Aspect. When it approaches the LLM's context window limit (e.g., 4,000 tokens for a 5,000-token limit), the system flags it for restructuring.

### Process for Splitting or Adding Aspects
1. **LLM Analysis**: The LLM analyzes the Information to identify natural breakpoints (e.g., thematic clusters).
2. **User Notification**: The user is made aware of the need to split into additional Aspects.
3. **Reorganization**: The system updates the knowledge graph, moving Information to the new Aspects.

This ensures the structure remains manageable and optimized for both the user and the LLM.

## Depth of Knowledge (DoK) System
The DoK system measures the user's mastery of knowledge at each level of the hierarchy, from basic recall to advanced synthesis.

### DoK Levels and Points
- **DoK 1**: Recall and reproduction (1 point).
  - Example: "What is spin rate?"
- **DoK 2**: Application of skills and concepts (2 points).
  - Example: "How does spin rate affect pitch movement?"
- **DoK 3**: Strategic thinking and reasoning (3 points).
  - Example: "Why might a pitcher adjust spin rate based on batter tendencies?"
- **DoK 4**: Extended thinking and synthesis (4 points).
  - Example: "Design a pitch sequence using spin rate to exploit a batter's weakness."

### Mastery and Scoring
- **Information Mastery**: A piece of Information is "mastered" when the user demonstrates understanding, by producing (in conversation) at least 3 items for each DoK level.
- **Aspect Scoring**:
  - A aspect's score is the number of bullet points in each DoK level, multiplied by the DoK level.
  - A aspect's score can utilize, at most, 3 bullet points per DoK level. This means a aspect can score a maximum of 30 points (DoK 1 x 3 + DoK 2 x 3 + DoK 3 x 3 + DoK 4 x 3).
- **Higher-Level Scoring**:
  - **Concept Score**: Sum of it's Aspects' scores.
  - **Area Score**: Sum of its Concepts' scores.
  - **Domain Score**: Sum of its Areas' scores.
- **Summative Approach**: Mastery at higher levels (e.g., Area or Domain) requires broad and deep knowledge across multiple Concepts or Aspects.

### Example
- **Concept: Pitching Physics**
  - Information:
    - "Spin rate basics" (DoK 1, 1 pt)
    - "Magnus effect" (DoK 2, 2 pts)
    - "Spin vs. control" (DoK 3, 3 pts)
    - "Pitch sequence design" (DoK 4, 4 pts)
  - **Concept Score**: 1 + 2 + 3 + 4 = 10

If *Pitching Physics* is split into new Concepts (e.g., *Spin Rate* with its own Information), each new Concept would have its own score, and the Area score would reflect the sum of these Concepts.

## Data Structures
The following JSON-like schemas illustrate how the knowledge graph's components are structured and related:

### Domain
```json
{
  "id": "baseball",
  "name": "Baseball",
  "areas": ["pitching", "hitting"]
}
```
- **Purpose**: Defines a broad domain with references to its Areas.
- **Relationships**: Links to Areas via the `areas` array.

### Area
```json
{
  "id": "pitching",
  "name": "Pitching",
  "parent": "baseball",
  "concepts": ["pitching-physics", "situational-counts"]
}
```
- **Purpose**: Organizes a Domain into major areas, linking to Concepts.
- **Relationships**: `parent` links upward to Domain; `concepts` links downward to Concepts.

### Concept
```json
{
  "id": "pitching-physics",
  "name": "Pitching Physics",
  "parent": "pitching",
  "aspects": ["spin-rate", "grip-techniques"],
  "tags": ["#Physics", "#Mechanics"],
  "dok_score": 6  // Example score based on mastered Information
}
```
- **Purpose**: Represents a specific focus area, containing Information or Aspects.
- **Relationships**: `parent` links to Area; `aspects` link downward; `tags` enable cross-connections.

### Aspect
```json
{
  "id": "spin-rate",
  "name": "Spin Rate",
  "parent": "pitching-physics",
  "information": ["info3", "info4"],
  "tags": ["#SpinRate", "#MagnusEffect"],
  "dok_score": 10  // Example score if fully mastered
}
```
- **Purpose**: Provides finer granularity under a Concept.
- **Relationships**: `parent` links to Concept; `information` links to content; `tags` connect across the graph.

### Information
```json
{
  "id": "info_spinrate_001",
  "parent": "spin-rate",
  "bullet_points": {
    "dok_1": [
      "Spin rate is measured in revolutions per minute (RPM).",
      "Typical fastball spin rates range from 2000-2500 RPM."
    ],
    "dok_2": [
      "Higher spin rates increase the Magnus effect, curving the pitch.",
      "Spin rate interacts with velocity to determine pitch movement."
    ],
    "dok_3": [
      "Pitchers adjust spin rate to deceive batters based on game context."
    ],
    "dok_4": [
      "{Can design a training drill to optimize spin rate for a curveball.}",
      "{Can analyze spin rate data to predict batter swing outcomes.}",
      "{Can propose a pitch sequence leveraging spin rate against a power hitter.}"
    ]
  },
  "tags": ["#SpinRate", "#MagnusEffect"]
}
```
- **Purpose**: Stores the actual knowledge content with DoK metadata.
- **Relationships**: Implicitly linked to its parent Aspect via storage; `tags` (added by LLM) connect it to related concepts.

### Relationships
- **Hierarchical Relationships**: Established via `parent` fields (e.g., Concept to Area).
- **Tags**: Used for cross-cutting connections (e.g., `#SpinRate` links Concepts across Domains).
- **Explicit Relationships** (optional): Can be added via a `related` field if needed (e.g., `"related": ["batter-perception"]`).

## AI Integration
LLMs play a central role in managing and enhancing the knowledge graph:

### Key AI Functions
- **Tagging**: LLMs generate Tags from Information content (e.g., extracting keywords or themes).
  - Example: Input "Spin rate affects trajectory via the Magnus effect." → Tags `#SpinRate`, `#MagnusEffect`.
- **Split Suggestions**: LLMs analyze Information to propose natural split points when critical mass is reached.
  - Example: Large *Pitching Physics* Information → Suggested Concepts: *Spin Rate*, *Aerodynamics*.
- **DoK Classification**: LLMs help classify Information into DoK levels based on content complexity.
  - Example: "Design a pitch sequence" → Classified as DoK 4.
- **RAG Support**: Information chunks are retrieved and fed to the LLM for context-aware responses during user interactions.

### AI Workflow Examples
1. **Tag Generation**:
   - Input: Information text.
   - Process: LLM identifies key concepts and generates Tags.
   - Output: Updated `tags` field in the data structure.
2. **Split Proposal**:
   - Input: Information exceeding token threshold.
   - Process: LLM clusters content thematically.
   - Output: Suggested Concepts or Aspects presented to the user.
3. **DoK Scoring**:
   - Input: User responses to mastery questions.
   - Process: LLM evaluates depth of understanding.
   - Output: Updated `mastered` status and `dok_score`.

## Implementation Steps
To build this system, follow these action items:

1. **Database Setup**:
   - **Action**: Choose a database that supports hierarchical data. Supabase is a good choice, and offers vector support for RAG down the line.
   - **Details**: Implement schemas as shown above for Domains, Areas, Concepts, Aspects, and Information.
   - **Priority**: High (foundation for all data).

2. **LLM Integration**:
   - **Action**: Set up API calls to an LLM for:
     - Tag generation.
     - Split suggestions.
     - DoK classification.
   - **Details**: Ensure the LLM can process Information chunks for RAG (e.g., chunk size < context window).
   - **Priority**: High (core functionality).

3. **Token Monitoring**:
   - **Action**: Implement a token counter for Information fields.
   - **Details**: Define a threshold (e.g., 80% of LLM context window, such as 4,000 tokens) to trigger split proposals.
   - **Priority**: Medium (supports scalability).

4. **User Interface**:
   - **Action**: Build a frontend with a node-edge graph visualization (e.g., using D3.js or Cytoscape.js).
   - **Details**: Include controls for users to choose splitting options and view DoK scores.
   - **Priority**: Medium (enhances usability).

5. **DoK System**:
   - **Action**: Develop logic to calculate DoK scores at each level based on mastered Information.
   - **Details**: Implement summative scoring for higher levels (e.g., average Concept scores for Areas).
   - **Priority**: High (core feature).

6. **Mastery Assessment Module**:
   - **Action**: Create a system for generating questions or tasks to assess mastery of Information.
   - **Details**: Use LLM to tailor questions based on DoK levels and user progress.
   - **Priority**: Medium (validates DoK scores).

7. **Testing and Iteration**:
   - **Action**: Prototype with a small set of Domains (e.g., *Baseball*) and test splitting mechanisms.
   - **Details**: Gather user feedback on splitting process and DoK scoring visibility; refine as needed.
   - **Priority**: Medium (ensures quality).

---

This document provides a deep, well-planned blueprint for implementing our knowledge graph system. Each section offers actionable steps, detailed processes, and examples to guide execution. The integration of LLMs ensures adaptability and intelligence, while the DoK system provides a robust framework for tracking mastery. Follow this plan closely to build a system that is both powerful and user-centric.