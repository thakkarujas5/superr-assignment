superr-assignment/
│
├── config/                # Configuration files (db, env, etc.)
│   ├── db.js
│   └── swagger.js        # Swagger configuration
│
├── controllers/          # Business logic for each resource
│   ├── sessionController.js
│   ├── authController.js
│   ├── quizController.js
│   ├── answerController.js
│   ├── reportController.js
│   └── heartbeatController.js
│
├── middleware/           # Custom middleware
│   └── auth.js          # Authentication and authorization middleware
│
├── routes/              # Express route definitions
│   ├── eventRoutes.js   # Session, quiz, answer, and heartbeat routes
│   ├── reportRoutes.js  # Report generation routes
│   └── authRoutes.js    # Authentication routes
│
├── migrations/          # Database migration scripts
│   └── 001-init.sql    # Initial database schema
│
├── .env                # Environment variables
├── .gitignore
├── index.js            # Main application entry point
├── package.json        # Project dependencies and scripts
└── README.md          # Project documentation