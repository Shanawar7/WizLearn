# WizLearn Platform - Detailed Test Cases

**Total Test Cases:** 78  
**Frontend Tests:** 51  
**Backend Tests:** 27  
**Status:** 100% Passed ✅

| ID | Component / Module | Test Scenario | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| **FT-01** | AuthContext | Provides global authentication state (user, loading) | Unit | ✅ Pass |
| **FT-02** | ChatContext | Manages global chat messages and active rooms | Unit | ✅ Pass |
| **FT-03** | Login Page | Renders email and password input fields | Unit | ✅ Pass |
| **FT-04** | Login Page | Validates and updates user input in real-time | Unit | ✅ Pass |
| **FT-05** | Login Page | Authenticates user and redirects to Dashboard | Integration | ✅ Pass |
| **FT-06** | Signup Page | Renders all registration fields | Unit | ✅ Pass |
| **FT-07** | Signup Page | Successfully registers new user and handles API response | Integration | ✅ Pass |
| **FT-08** | App Root | Smoke test: Ensures application renders without crashing | Unit | ✅ Pass |
| **FT-09** | Dashboard | Displays personalized welcome message and layout | Unit | ✅ Pass |
| **FT-10** | AdminDashboard | Renders admin-specific stats (Users, Courses) | Unit | ✅ Pass |
| **FT-11** | Landing Page | Renders Hero, Features, and Footer sections correctly | Unit | ✅ Pass |
| **FT-12** | Profile Page | Displays accurate user profile and account details | Unit | ✅ Pass |
| **FT-13** | ProtectedRoute | Shows loading spinner while checking auth status | Unit | ✅ Pass |
| **FT-14** | ProtectedRoute | Redirects unauthenticated users to Login page | Unit | ✅ Pass |
| **FT-15** | ProtectedRoute | Permits authorized users to access private routes | Unit | ✅ Pass |
| **FT-16** | AdminRoute | Shows loading state during role verification | Unit | ✅ Pass |
| **FT-17** | AdminRoute | Redirects non-authenticated users to Login | Unit | ✅ Pass |
| **FT-18** | AdminRoute | Redirects non-admin users to Student Dashboard | Unit | ✅ Pass |
| **FT-19** | AdminRoute | Permits Admin users to access Management Panel | Unit | ✅ Pass |
| **FT-20** | ChatPage | Renders real-time chat interface components | Unit | ✅ Pass |
| **FT-21** | CoursePage | Shows loading skeleton while fetching course data | Unit | ✅ Pass |
| **FT-22** | CoursePage | Displays full course content once data is loaded | Integration | ✅ Pass |
| **FT-23** | CoursePage | Handles component switching (Quiz vs Resources) | Integration | ✅ Pass |
| **FT-24** | CourseNavbar | Displays course title and context-aware buttons | Unit | ✅ Pass |
| **FT-25** | CourseNavbar | Executes 'Back to Dashboard' navigation logic | Unit | ✅ Pass |
| **FT-26** | CourseNavbar | Triggers Modal displays (Quiz/Material Upload) | Unit | ✅ Pass |
| **FT-27** | CourseNavbar | Safely logs out user from the course context | Unit | ✅ Pass |
| **FT-28** | AI Quiz | Prevents rendering if quiz data is missing | Unit | ✅ Pass |
| **FT-29** | AI Quiz | Processes user answers and calculates final score | Integration | ✅ Pass |
| **FT-30** | AI Quiz | Resets quiz state for multiple attempts | Integration | ✅ Pass |
| **FT-31** | AI Roadmap | Handles empty state gracefully (No roadmap generated) | Unit | ✅ Pass |
| **FT-32** | AI Roadmap | Renders complex nested JSON roadmap steps | Unit | ✅ Pass |
| **FT-33** | CommunityNotes | Fetches and displays shared notes from peers | Integration | ✅ Pass |
| **FT-34** | CommunityNotes | Submits new shared notes to the database | Integration | ✅ Pass |
| **FT-35** | Resources | Handles absence of external resource data | Unit | ✅ Pass |
| **FT-36** | Resources | Defaults to YouTube video search tab | Unit | ✅ Pass |
| **FT-37** | Resources | Successfully toggles between Videos, Books, and Docs | Integration | ✅ Pass |
| **FT-38** | MaterialCard | Displays material metadata (Name, Size, Type) | Unit | ✅ Pass |
| **FT-39** | MaterialCard | Handles callback for Material deletion | Unit | ✅ Pass |
| **FT-40** | MaterialCard | Renders appropriate preview icons for PDFs/Images | Integration | ✅ Pass |
| **FT-41** | UploadModal | Respects 'isOpen' state for visibility | Unit | ✅ Pass |
| **FT-42** | UploadModal | Displays material upload form with validation | Unit | ✅ Pass |
| **FT-43** | UploadModal | Validates required fields before allowing submission | Unit | ✅ Pass |
| **FT-44** | UploadModal | Processes multi-part file upload to backend | Integration | ✅ Pass |
| **FT-45** | ID Generator | Generates unique User IDs (WL-USER-XXXXX) | Unit | ✅ Pass |
| **FT-46** | ID Generator | Generates unique Course Codes (WL-COURSE-XXXXXX) | Unit | ✅ Pass |
| **FT-47** | ID Generator | Returns Dark Navy for color index 0 | Unit | ✅ Pass |
| **FT-48** | ID Generator | Returns Yellow for color index 1 | Unit | ✅ Pass |
| **FT-49** | ID Generator | Cycles through the primary color palette | Unit | ✅ Pass |
| **FT-50** | Storage Utils | Persists user data in Browsers LocalStorage | Unit | ✅ Pass |
| **FT-51** | Storage Utils | Clears LocalStorage on user logout | Unit | ✅ Pass |
| **BT-01** | AppController | Root endpoint returns connectivity success (Hello World) | Unit | ✅ Pass |
| **BT-02** | AdminService | Initialization and Repository Injection | Unit | ✅ Pass |
| **BT-03** | AuthService | Initialization and Repository Injection | Unit | ✅ Pass |
| **BT-04** | AuthService | Compares hashed passwords during login | Unit | ✅ Pass |
| **BT-05** | AuthService | Signs and returns valid JWT tokens | Unit | ✅ Pass |
| **BT-06** | AuthService | Validates account existence before login | Unit | ✅ Pass |
| **BT-07** | ChatService | Initialization and interaction history tracking | Unit | ✅ Pass |
| **BT-08** | CoursesService | Initialization and Course management | Unit | ✅ Pass |
| **BT-09** | CoursesService | Fetches all available courses for discovery | Unit | ✅ Pass |
| **BT-10** | EnrollService | Initialization and Progress calculation login | Unit | ✅ Pass |
| **BT-11** | FriendsService | Initialization and Repository Injection | Unit | ✅ Pass |
| **BT-12** | FriendsService | Processes mutual friendship status | Unit | ✅ Pass |
| **BT-13** | GeminiService | Initialization and AI API Configuration | Unit | ✅ Pass |
| **BT-14** | GeminiService | Generates structured educational Roadmaps | Unit | ✅ Pass |
| **BT-15** | GeminiService | Generates AI-powered knowledge Quizzes | Unit | ✅ Pass |
| **BT-16** | GeminiService | Handles real-time academic chat interactions | Unit | ✅ Pass |
| **BT-17** | MaterialsService| Initialization and File Metadata management | Unit | ✅ Pass |
| **BT-18** | MaterialsService| Deletes materials and associated file records | Unit | ✅ Pass |
| **BT-19** | NotesService | Initialization and Shared Note management | Unit | ✅ Pass |
| **BT-20** | ResourceService | Initialization and External Search API config | Unit | ✅ Pass |
| **BT-21** | ResourceService | Integrates with YoutTube Data API | Unit | ✅ Pass |
| **BT-22** | ResourceService | Integrates with Google Books API | Unit | ✅ Pass |
| **BT-23** | SeedService | Database bootstrapping and mock data insertion | Unit | ✅ Pass |
| **BT-24** | UsersService | Initialization and Repository Injection | Unit | ✅ Pass |
| **BT-25** | UsersService | Creates new persistent user records | Unit | ✅ Pass |
| **BT-26** | UsersService | Retrieves user by email for authentication | Unit | ✅ Pass |
| **BT-27** | UsersService | Handles 'Not Found' edge cases for user queries | Unit | ✅ Pass |
