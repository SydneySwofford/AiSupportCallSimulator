ai-support-call-simulator/
├── frontend/                  # Next.js 14 app directory
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Home page (chat UI)
│   │   ├── dashboard/        # Session history
│   │   ├── api/              # Optional Edge API routes (Next.js)
│   │   └── styles/           # Global styling (tailwind.css, etc)
│   ├── components/
│   │   ├── ChatBox.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── PersonaSelector.tsx
│   │   ├── ScenarioSelector.tsx
│   │   ├── VoiceToggle.tsx
│   │   └── DashboardCard.tsx
│   ├── lib/
│   │   ├── api.ts            # API client to backend
│   │   ├── types.ts          # Shared types/interfaces
│   │   └── scoringUtils.ts   # (Optional) helpers for score visualizing
│   ├── public/
│   └── tailwind.config.js
│
├── backend/                  # FastAPI app
│   ├── main.py               # Entry point
│   ├── routers/
│   │   ├── chat.py           # OpenAI chat logic
│   │   ├── score.py          # Scoring endpoint
│   │   └── sessions.py       # Logging and fetching sessions
│   ├── services/
│   │   ├── openai_client.py
│   │   ├── elevenlabs_client.py
│   │   └── scoring_engine.py
│   ├── models/
│   │   ├── session.py        # ORM models
│   │   └── schemas.py        # Pydantic schemas
│   ├── db/
│   │   ├── database.py       # DB connection
│   │   └── migrations/
│   └── requirements.txt
│
├── docs/
│   ├── architecture.png      # Diagrams or screenshots
│   └── roadmap.md
│
├── .env
├── .gitignore
├── README.md
└── LICENSE
