# Project and Experience Content

## Notes for implementation

This file contains project explainer content and experience notes that should be used to improve storytelling throughout the portfolio.

The writing in this file is directionally correct but not final.
It may be refined, improved, shortened, or restructured for clarity and presentation.

Use this content to support:

1. project explainer copy
2. project detail panels
3. project subtitle and highlights
4. experience section copy
5. technical storytelling for interviewers

Do not treat the wording as locked.
Do not hardcode content in components.
Move content into the typed data layer where appropriate.

## Experience

### Apple

Perception Triage Engineer
Career Experience Program
June 2025 to November 2025

Key points

1. Led weekly triage meetings with the Product Integrity team, quickly analyzing radar data and clearly communicating issues to engineers.
2. Helped the QE team better understand system behavior, which reduced unnecessary radars and made testing more targeted.
3. Identified a recurring issue pattern across multiple radars involving delayed user recognition after reboots. This helped engineers isolate and fix the issue, improving system performance and user experience.

### Apple

Technical Support
May 2022 to June 2025

Key points

1. Resolved technical issues by actively listening and clearly communicating solutions.
2. Maintained an issue resolution rate 10 percent above the organization average.

### Aer Digital

Web Developer
May 2022 to June 2025

Key points

1. Implemented custom functionality using JavaScript and HTML embeds within CRM environments when built in site builder features were not enough.
2. Built and customized websites for clients with a focus on usability, visual polish, and practical business needs.

## Projects

### Anime Browser

Primary summary
A lightweight React and Next.js anime browser built to practice real world front end fundamentals, including API data fetching, state management, and async UI flows.

Expanded explanation
The app pulls anime data from the Jikan API and handles loading and error states so browsing remains responsive and predictable while requests are in flight.

Resume style points

1. Built an infinite scroll anime browser using the Jikan API with IntersectionObserver triggered pagination.
2. Prevented duplicate or rapid fetches using ref based loading guards and a cooldown throttle.
3. Rendered skeleton placeholders while loading.
4. Implemented a responsive grid layout and reusable UI components with Tailwind CSS.

Suggested technical themes

1. async UI handling
2. infinite scroll behavior
3. client side state management
4. responsive component design

### Anime AI App

Primary summary
An interactive SwiftUI anime app that combines anime discovery with natural language AI features for recommendations, summaries, comparisons, and creative responses.

Expanded explanation
The app uses the Jikan API for anime browsing and detail views, then layers in OpenAI powered natural language features so users can ask for recommendations, compare titles, summarize shows, or explore more open ended prompts in a conversational format.

Resume style points

1. Built a scroll heavy discovery UI in SwiftUI using lists and grids with pagination and smooth loading states.
2. Integrated the Jikan API for search and detail pages, including retries, empty states, and cache aware behavior.
3. Added OpenAI powered natural language queries for recommendations, comparisons, and summaries.
4. Translated user prompts into structured UI results.

Feature chapters

1. Explore Top Anime
   Displays top anime fetched from the Jikan API.

2. View Anime Details
   Loads detailed anime information, synopsis, and trailer using dynamic views and API data fetches.

3. AI Summarization
   Generates an AI summary for a specific anime using fetched metadata and synopsis data.

4. Watch Trailer
   Opens the correct trailer for the selected anime.

5. Meet the AI Buddy
   Uses an OpenAI powered chat system that classifies user intent and decides when to fetch data, summarize anime, or generate creative responses.

6. Recommendation Request
   Detects when a prompt asks for similar anime, extracts the referenced title, and queries the Jikan API for related shows based on genre, themes, and popularity.

7. Top Action Anime
   Filters top anime by genre and release year using structured data queries.

8. Summarize Jujutsu Kaisen
   Generates a concise AI summary for a specific anime using fetched metadata and synopsis.

9. Compare Anime
   Analyzes two anime by comparing key attributes such as genres, studios, and popularity metrics.

10. Who Would Win
    Handles open ended versus questions with contextual reasoning and creative response generation.

11. Creative Idea
    Uses generative logic to create original anime concepts from abstract prompts.

12. Session Message History
    Maintains in memory chat history during the session.

Suggested technical themes

1. prompt classification
2. API driven UI
3. SwiftUI state handling
4. AI enhanced product behavior

### Appetizer App

Primary summary
A SwiftUI appetizer ordering app focused on API integration, image caching, validation, and a clean mobile ordering flow.

Expanded explanation
This project was built to practice common iOS app patterns such as fetching remote data, caching images for smoother performance, maintaining order state, validating user input, and building a clean checkout experience.

Resume style points

1. Developed an iOS app in Swift and SwiftUI that displays a dynamic list of appetizers fetched from a custom API.
2. Allowed users to simulate adding items to an order.
3. Cached images efficiently using NSCache to reduce load times and improve responsiveness.
4. Built a checkout flow with validation and persistence focused interactions.

Feature chapters for demo one

1. Browse Menu and Caching
   Appetizers load from the API and images are cached for smoother performance.

2. Adding Items
   The user selects items and adds them to the cart.

3. Order Totals
   The cart updates totals instantly.

Feature chapters for demo two

1. Checkout Info
   The user fills in checkout information.

2. Validation Errors
   Email validation catches mistakes and surfaces clear feedback.

3. Persistence
   The final confirmation screen shows success and completed state.

Suggested technical themes

1. image caching
2. form validation
3. local state updates
4. mobile commerce style flow

### Frameworks App

Primary summary
A SwiftUI app for exploring Apple frameworks with a polished browsing experience and a simple educational product feel.

Expanded explanation
The project focuses on clean SwiftUI layout, navigation, and presentation patterns while displaying framework information in a way that feels approachable and visually consistent.

Feature chapters

1. Browse Frameworks
   Scroll through Apple frameworks in a clean SwiftUI interface.

2. Tap Into Details
   Each framework opens into a concise detail view with a clean layout.

3. Smooth Navigation
   Move between list and detail states fluidly using SwiftUI navigation patterns.

Suggested technical themes

1. SwiftUI navigation
2. clean information architecture
3. reusable view composition

### 2048 Game

Primary summary
A Java Swing implementation of the classic 2048 puzzle game built with object oriented design and a preserved text based version for testing.

Expanded explanation
This project recreates the classic 2048 gameplay loop, where players slide tiles across a grid to merge matching numbers and work toward reaching the 2048 tile.

The code is structured around object oriented principles with separate responsibilities for the board, tile behavior, and controller logic.
The GUI was built using Swing while the original text based version was preserved for easier testing and validation.

Suggested technical themes

1. object oriented design
2. game state management
3. Swing GUI fundamentals
4. separating logic from presentation

### Portfolio Website

Primary summary
A portfolio site built with Next.js, React, Tailwind, and TypeScript to present projects and experience in a polished, professional way.

Expanded explanation
The portfolio was designed as a place to showcase work, experiment with modern front end architecture, and create a clear public presentation of technical projects and experience.

Resume style points

1. Built a multi page portfolio site using Next.js, React, Tailwind CSS, and TypeScript.
2. Deployed on Vercel with Git based deployments for quick iteration.

Suggested technical themes

1. content presentation
2. front end architecture
3. design systems
4. deployment workflow

### Atlas Chat App

Primary summary
A SwiftUI chat app built with MVVM and protocol based dependency injection to support clean architecture and flexible service swapping.

Expanded explanation
The app was designed to explore production style app architecture, including secure session handling, typed networking, optimistic updates, and pagination in a chat experience.

Resume style points

1. Built a SwiftUI iOS chat app using MVVM and protocol based dependency injection, allowing clean swaps between mock and production services.
2. Implemented secure auth and session handling with Keychain token storage, proactive token refresh, and app foreground validation.
3. Developed a consumer style chat experience with conversation CRUD, optimistic sends, and cursor based pagination.
4. Added typed error handling and retry support.

Suggested technical themes

1. architecture and dependency injection
2. auth and session continuity
3. pagination
4. production style mobile design

## Guidance for the portfolio presentation

### Project explainers

Each featured project should have an explainer section that answers:

1. what the project is
2. what technical ideas it explores
3. what was interesting or challenging about it
4. why it matters as a portfolio piece

### Tone

1. clear
2. technical
3. concise
4. not overly academic
5. written for recruiters, interviewers, and engineers

### Preferred presentation style

Project explainers should feel intentional and polished.
They should help the viewer understand the project while the demo is being shown.
They should not feel like raw resume bullets pasted onto the page.

### Content flexibility

This file is editable and may be improved over time.
Use it as a strong starting point, not as final locked copy.
