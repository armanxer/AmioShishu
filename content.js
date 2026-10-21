/* Editable content. Research plans are explicitly distinguished from completed work. */
window.AMIO_CONTENT = {
  "email": "contact.anikarman@gmail.com",
  "gallery": [
    {
      "image": "",
      "caption": "A little flour, a new beginning",
      "alt": "",
      "placeholder": "At the kitchen table"
    },
    {
      "image": "",
      "caption": "Questions worth spending time on",
      "alt": "",
      "placeholder": "Behind the research"
    },
    {
      "image": "",
      "caption": "Learning is better when shared",
      "alt": "",
      "placeholder": "Room to grow"
    }
  ],
  "posts": [
    {
      "id": "a-little-flour",
      "title": "A little flour. A larger purpose.",
      "date": "2026-10-18",
      "category": "Personal notes",
      "excerpt": "Why a pistachio loaf belongs at the beginning of this story.",
      "body": "I looked at a tub of pistachio ice cream and thought: what if this were bread?\n\nA normal person would’ve eaten the ice cream. I reached for the flour.\n\nThat experiment is how I want to begin AmioShishu: with curiosity, a willingness to try, and something to share. I don’t have every answer. But I want the things I learn to become useful to someone else.\n\nAmioShishu means I am also a child. Behind the name is a simple commitment: the child without the books, the support, or the opportunity deserves a place at the table too.",
      "image": "",
      "alt": "",
      "published": false,
      "photos": []
    }
  ],
  "sections": [
    {
      "id": "publications",
      "title": "Publications",
      "description": "Research papers, collaborations, and questions I am exploring.",
      "published": true,
      "entries": []
    },
    {
      "id": "seminars",
      "title": "Seminars",
      "description": "Talks, workshops, and conversations that make learning a shared experience.",
      "published": true,
      "entries": []
    },
    {
      "id": "art",
      "title": "Art",
      "description": "A space for creative experiments, sketches, and things made with care.",
      "published": true,
      "entries": []
    },
    {
      "id": "projects",
      "title": "Projects",
      "description": "Research and development connecting technical methods with practical needs. Current work includes an adaptive learning app concept for parents and teachers with limited resources.",
      "published": true,
      "entries": [
        {
          "projectKey": "adaptive-learning-research",
          "title": "AmioShishu Adaptive Learning — Research in Progress",
          "date": "",
          "body": "A research project exploring how observations from children’s learning activities can become practical guidance for parents and teachers with limited time, materials, or access to specialist support. I have collected data from 50 children to inform parent-focused learning aids. The next goal is an adaptive app that helps an adult choose an activity, adjust its difficulty and format, and understand what to try next.",
          "url": "",
          "linkLabel": "",
          "photos": [],
          "research": {
            "status": "Research in progress · App proposed",
            "current": "Established work: data collected from 50 children. The detailed observation framework and app architecture below describe the proposed next phase; they are not a claim that every listed field has already been collected, that a model has been trained, or that the app has been validated.",
            "question": "How can a small set of understandable learning observations help a parent or teacher select an accessible next activity, using the resources they already have?",
            "dataIntro": "Proposed data dictionary and observation protocol. Before analysis, I plan to audit the existing records, document which fields are actually available, and identify what would require further consented collection.",
            "dataRows": [
              [
                "Learning goal and starting point",
                "Activity type, target skill, task difficulty, and what the learner can do independently before support.",
                "Create an initial learner profile and avoid recommending tasks that are too easy, too difficult, or unrelated to the adult’s goal."
              ],
              [
                "Task attempts and assistance",
                "Completed or skipped steps, correct responses where applicable, retries, and the type of prompt used: demonstration, visual cue, verbal instruction, or guided practice.",
                "Separate independent success from supported success; adjust scaffolding and recommend a smaller next step when needed."
              ],
              [
                "Interaction and access preferences",
                "How the child chooses to respond—speech, pointing, selecting images, or hands-on work—and which instructions or formats appear usable.",
                "Offer alternative response modes and representations rather than interpreting one inaccessible format as a lack of ability."
              ],
              [
                "Participation and session context",
                "Optional task duration, breaks, child-requested stops, interruptions, and the adult’s contextual notes.",
                "Suggest manageable activity lengths and breaks. Avoid treating time-on-task, speed, or a single difficult session as a diagnostic score."
              ],
              [
                "Change across sessions",
                "Repeated observations on comparable tasks, level of assistance, and whether a skill carries over to a different activity.",
                "Build a longitudinal progress view and distinguish a one-off result from a recurring pattern."
              ],
              [
                "Parent and teacher constraints",
                "Preferred language, device and connectivity access, available materials, preparation time, and feedback on instructions.",
                "Recommend feasible activities and formats, including printable alternatives and an offline-first workflow."
              ]
            ],
            "blocks": [
              {
                "title": "From observations to adaptation",
                "text": "The proposed workflow is: pseudonymous learner profile → structured session record → data validation and missing-value checks → rule-based recommendation → adult review → next-session feedback. A simple baseline would suggest a comparable task with less prompting after repeated independent success, offer smaller steps or a different format when support is still needed, and let the adult override or pause any suggestion. These rules would need testing with educators and families before use."
              },
              {
                "title": "Proposed technical architecture",
                "text": "An offline-first Progressive Web App (PWA) would provide a lightweight interface on shared or low-cost devices. IndexedDB could store activity packs and session records locally; service-worker caching could keep core resources usable without a continuous connection. A tagged activity library would describe each task’s target skill, difficulty, materials, response options, and language. An explainable recommendation engine would match those tags to a learner profile and adult-selected goals. An optional synchronization layer would be a later design decision, with access controls and retention rules defined before collecting data online."
              },
              {
                "title": "Why begin with interpretable rules?",
                "text": "Fifty children provide a starting point for exploratory research and requirements gathering, not evidence that a general-purpose prediction model will work. I plan to begin with descriptive analysis, within-learner trends, and transparent rules. If a later dataset justifies machine learning, candidate approaches such as knowledge tracing would be compared against that baseline, with learner-level evaluation splits to reduce data leakage. No accuracy score or model performance is claimed at this stage."
              },
              {
                "title": "Designed for adults working with fewer resources",
                "text": "The proposed app would pair each recommendation with a short explanation, a simple activity guide, and inexpensive material options. Design priorities include plain-language instructions, visual supports, adjustable pacing, Bangla-first content with English options, printable activities, and flexible ways for a child to respond. Parents and teachers would remain the decision-makers. The aim is to reduce preparation effort while preserving each child’s choices and support needs."
              },
              {
                "title": "Evaluation planned",
                "text": "The next research steps are to audit the existing dataset, refine the observation rubric with parent and educator feedback, create an initial activity library, and prototype the adult workflow. Evaluation would examine instruction clarity, preparation time, task accessibility, independent versus prompted completion, and perceived usefulness. Repeated sessions and an appropriate comparison design would be needed before claiming that the app improves learning. Findings would be reported with their limitations, including the small sample and differences between learners."
              },
              {
                "title": "Data boundaries",
                "text": "The proposed protocol calls for parent or guardian consent, age-appropriate child assent where possible, pseudonymous identifiers, limited access, and a defined deletion schedule. Identifiable child-level records would not be published on this website. The app is intended as an educational support tool, not a diagnostic or therapeutic system; automatic diagnosis, emotion recognition, and rankings of children are outside its proposed scope."
              }
            ],
            "sources": [
              {
                "title": "CAST — Universal Design for Learning",
                "url": "https://www.cast.org/what-we-do/universal-design-for-learning/",
                "note": "Framework informing flexible engagement, representation, and ways to act or respond."
              },
              {
                "title": "UNICEF Innocenti — Accessible Digital Textbooks",
                "url": "https://www.unicef.org/innocenti/projects/accessible-digital-textbooks",
                "note": "Accessibility and implementation-research context for digital learning materials."
              }
            ]
          }
        }
      ]
    },
    {
      "id": "sourdough-recipes",
      "title": "My Sourdough Recipes",
      "description": "Recipes, kitchen notes, and experiments with flour, patience, and pistachios.",
      "published": true,
      "entries": []
    }
  ],
  "schemaVersion": 5
};
