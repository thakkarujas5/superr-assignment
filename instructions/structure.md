superr-assignment/
│
├── config/                # Configuration files
│   ├── db.js             # Database configuration (Sequelize)
│   ├── logger.js         # Winston logger configuration
│   └── swagger.js        # Swagger API documentation configuration
│
├── controllers/          # Business logic for each resource
│   ├── sessionController.js    # Handles session start/end events
│   ├── authController.js       # Handles user authentication
│   ├── quizController.js       # Manages quiz creation and updates
│   ├── answerController.js     # Handles student quiz answers
│   ├── reportController.js     # Generates various reports
│   └── heartbeatController.js  # Tracks student engagement
│
├── middleware/           # Custom middleware
│   ├── auth.js          # Authentication and authorization middleware
│   ├── eventLogger.js   # Logging middleware for events
│   └── index.js         # Centralized middleware exports
│
├── routes/              # Express route definitions
│   ├── eventRoutes.js   # Session, quiz, answer, and heartbeat routes
│   ├── reportRoutes.js  # Report generation routes
│   └── authRoutes.js    # Authentication routes
│
├── logs/               # Log files directory
│   ├── error.log      # Error level logs
│   └── combined.log   # All level logs
│
├── migrations/         # Database migration scripts
│   └── 001-init.sql   # Initial database schema
│
├── .env               # Environment variables
├── .gitignore        # Git ignore file
├── server.js         # Main application entry point
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
