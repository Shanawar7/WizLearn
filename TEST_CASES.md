| TC ID | Module | Test Scenario | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Auth | User Signup | 1. Navigate to Signup Page<br>2. Enter Name, Email, Password<br>3. Click 'Sign Up' | User account is created and redirected to Dashboard. | **Pass** |
| **TC-02** | Auth | User Login | 1. Navigate to Login Page<br>2. Enter valid Email & Password<br>3. Click 'Login' | User is authenticated and redirected to Dashboard. | **Pass** |
| **TC-03** | Auth | Invalid Login | 1. Enter incorrect Email or Password<br>2. Click 'Login' | Error message "Invalid credentials" displayed. | **Pass** |
| **TC-04** | Auth | Logout | 1. Click Profile Icon<br>2. Select 'Logout' | User session ends, redirected to Landing/Login page. | **Pass** |
| **TC-05** | Profile | View Profile | 1. Navigate to /profile | User details (Name, Email, Role) are displayed correctly. | **Pass** |
| **TC-06** | Profile | Edit Profile | 1. Click 'Edit Profile'<br>2. Update Name/Avatar<br>3. Save | Profile information is updated in database and UI. | **Pass** |
| **TC-07** | Course | View All Courses | 1. Navigate to 'Courses' tab<br>2. Scroll through list | All available courses are displayed with titles and descriptions. | **Pass** |
| **TC-08** | Course | Search Course | 1. Enter keyword in Search Bar<br>2. Press Enter | Only courses matching the keyword are displayed. | **Pass** |
| **TC-09** | Course | Enroll in Course | 1. Select a Course<br>2. Click 'Enroll Now' | Course added to 'My Courses' section. Enrollment status active. | **Pass** |
| **TC-10** | Course | View Material | 1. Open Enrolled Course<br>2. Click on a Material (PDF/Video) | Material loads in the viewer/player successfully. | **Pass** |
| **TC-11** | AI | Generate Roadmap | 1. Open Course<br>2. Click 'Generate AI Roadmap'<br>3. Select context/Material | AI generates a structured 4-week study plan with daily tasks. | **Pass** |
| **TC-12** | AI | Roadmap Interaction | 1. Click on a Roadmap task | Modal/Details expand showing study resources for that task. | **Pass** |
| **TC-13** | AI | Generate Quiz | 1. Open Material<br>2. Click 'Take AI Quiz' | AI generates 10 relevant MCQs based on the material. | **Pass** |
| **TC-14** | AI | Submit Quiz | 1. Select answers for 10 questions<br>2. Click 'Submit' | Score is calculated and displayed immediately. | **Pass** |
| **TC-15** | Chat | Academic Chat | 1. Open Chatbox<br>2. Ask "Explain Quantum Computing" | AI answers with a detailed, academic explanation. | **Pass** |
| **TC-16** | Chat | Off-Topic Guard | 1. Open Chatbox<br>2. Ask "Who won the World Cup?" | AI politely declines: "I can only answer academic questions." | **Pass** |
| **TC-17** | Social | Search Friend | 1. Go to Friends > Find Friends<br>2. Search "John" | List of users named John appears. | **Pass** |
| **TC-18** | Social | Send Request | 1. Click 'Add Friend' on a user | Button changes to 'Request Sent'. | **Pass** |
| **TC-19** | Social | Accept Request | 1. Login as Receiver<br>2. Go to Requests<br>3. Click 'Accept' | User added to Friends List. Chat becomes available. | **Pass** |
| **TC-20** | Social | Real-time Chat | 1. Open Chat with Friend<br>2. Send "Hello" | "Hello" appears instantly on Friend's screen (no refresh). | **Pass** |
| **TC-21** | Community | View Notes | 1. Navigate to /community | Public notes from other students are visible. | **Pass** |
| **TC-22** | Community | Create Note | 1. Click 'New Note'<br>2. Enter Title/Content<br>3. Toggle 'Public'<br>4. Save | Note appears in Community feed. | **Pass** |
| **TC-23** | Community | Rate/Like Note | 1. Click 'Like' on a community note | Like counter increments by 1. | **Pass** |
| **TC-24** | Admin | Admin Login | 1. Login with Admin credentials | Redirected to Admin Dashboard (not User Dashboard). | **Pass** |
| **TC-25** | Admin | System Stats | 1. View Dashboard Home | Total Users, Courses, and Active Users counts are correct. | **Pass** |
| **TC-26** | Admin | Create Course | 1. Courses > Create New<br>2. Fill details<br>3. Save | New course is visible in Student's Course Catalog. | **Pass** |
| **TC-27** | Admin | Upload Material | 1. Select Course<br>2. Add Module > Upload File | File is uploaded and accessible to enrolled students. | **Pass** |
| **TC-28** | Admin | Manage Users | 1. Admin > Users<br>2. Search user<br>3. Click 'Disable/Ban' | User cannot login anymore. | **Pass** |
| **TC-29** | Admin | View Analytics | 1. Go to Analytics Tab | Graphs show user growth and course popularity. | **Pass** |
| **TC-30** | System | Responsive UI | 1. Resize browser to Mobile width | UI adapts (Hamburger menu appears, grid stacks). | **Pass** |
| **TC-31** | Security | Unauthorized Admin Access | 1. Login as Student<br>2. Manually navigate to '/admin' URL | Access Denied / Redirected to Dashboard. | **Pass** |
| **TC-32** | Security | Access without Login | 1. Logout<br>2. Manually navigate to '/dashboard' | Redirected to Login Page immediately. | **Pass** |
| **TC-33** | Course | Duplicate Enrollment | 1. Enroll in 'React 101'<br>2. Try to Click 'Enroll' again | Button disabled or message "Already Enrolled". | **Pass** |
| **TC-34** | AI | Invalid File Type | 1. Generate Roadmap<br>2. Upload an executable (.exe) file | Error: "Invalid file format. Please upload PDF/Text". | **Pass** |
| **TC-35** | Chat | Empty Message | 1. Open Chat<br>2. Leave input empty<br>3. Try to press Enter/Send | Message is not sent. | **Pass** |
| **TC-36** | Auth | SQL Injection Attempt | 1. Login Email: `' OR 1=1 --`<br>2. Click Login | Login fails. System is secure against SQLi. | **Pass** |
