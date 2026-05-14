import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Nexora database...");

  // ── Clean existing seed data (optional but recommended for idempotency) ────
  // We don't delete everything, just the things we are about to seed to avoid duplicates
  
  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@nexora.io" },
    update: { password: adminPassword, role: "ADMIN", isVerified: true },
    create: {
      name: "Priyanshu Danda",
      email: "admin@nexora.io",
      password: adminPassword,
      role: "ADMIN",
      isVerified: true,
      headline: "Founder & CEO, Nexora",
    },
  });

  // ── Recruiter user ──────────────────────────────────────────────────────────
  const recruiterPassword = await bcrypt.hash("recruiter123", 12);
  const recruiter = await db.user.upsert({
    where: { email: "recruiter@nexora.io" },
    update: { password: recruiterPassword, role: "RECRUITER", isVerified: true },
    create: {
      name: "Rohan Sharma",
      email: "recruiter@nexora.io",
      password: recruiterPassword,
      role: "RECRUITER",
      isVerified: true,
      headline: "Talent Partner at TechCorp",
    },
  });

  // ── Demo student ────────────────────────────────────────────────────────────
  const studentPassword = await bcrypt.hash("student123", 12);
  await db.user.upsert({
    where: { email: "student@nexora.io" },
    update: { password: studentPassword, role: "STUDENT", isVerified: true },
    create: {
      name: "Anjali Mehta",
      email: "student@nexora.io",
      password: studentPassword,
      role: "STUDENT",
      isVerified: true,
    },
  });

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    db.category.upsert({ where: { slug: "programming" }, update: {}, create: { name: "Programming", slug: "programming", icon: "Code2", color: "#6366F1" } }),
    db.category.upsert({ where: { slug: "ai-tools" }, update: {}, create: { name: "AI Tools", slug: "ai-tools", icon: "Sparkles", color: "#8B5CF6" } }),
    db.category.upsert({ where: { slug: "ms-office" }, update: {}, create: { name: "MS Office", slug: "ms-office", icon: "FileSpreadsheet", color: "#0EA5E9" } }),
    db.category.upsert({ where: { slug: "data-science" }, update: {}, create: { name: "Data Science", slug: "data-science", icon: "Database", color: "#14B8A6" } }),
    db.category.upsert({ where: { slug: "resume" }, update: {}, create: { name: "Resume & Interview", slug: "resume", icon: "FileUser", color: "#F43F5E" } }),
    db.category.upsert({ where: { slug: "design" }, update: {}, create: { name: "Design", slug: "design", icon: "Palette", color: "#EC4899" } }),
  ]);

  const [progCat, aiCat, officeCat, dsCat, resumeCat, designCat] = categories;

  // ── Course definitions ──────────────────────────────────────────────────────
  const courseDefs = [
    {
      title: "Python for Beginners: Zero to Hero",
      slug: "python-for-beginners",
      description: "Master Python from scratch. Learn variables, loops, functions, OOP, file handling, and build real projects. Perfect for absolute beginners with no prior coding experience.",
      shortDesc: "Learn Python from zero with hands-on projects and quizzes.",
      price: 499,
      level: "BEGINNER" as const,
      categoryId: progCat.id,
      tags: ["python", "programming", "beginner", "coding"],
      duration: 720,
      sections: [
        {
          title: "Getting Started with Python",
          lessons: [
            { title: "What is Python & Why Learn It?", videoUrl: "https://www.youtube.com/embed/x7X9w_GIm1s", duration: 600, isFree: true },
            { title: "Installing Python & VS Code Setup", videoUrl: "https://www.youtube.com/embed/YYXdXT2l-Gg", duration: 720 },
            { title: "Variables, Data Types & Input/Output", videoUrl: "https://www.youtube.com/embed/Z1Yd7upQsXY", duration: 900 },
          ],
          quiz: {
            title: "Python Basics Quiz",
            passingScore: 70,
            questions: [
              { question: "Which of the following is the correct way to print in Python?", options: ["print('Hello')", "echo 'Hello'", "console.log('Hello')", "System.out.println('Hello')"], correctIndex: 0, explanation: "Python uses print() function." },
              { question: "What is the output of: type(3.14)?", options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], correctIndex: 1, explanation: "3.14 is a floating point number." },
              { question: "How do you create a variable in Python?", options: ["var x = 5", "int x = 5", "x = 5", "let x = 5"], correctIndex: 2, explanation: "Python uses dynamic typing, just assign with =." },
            ],
          },
        },
        {
          title: "Control Flow & Functions",
          lessons: [
            { title: "If-Else Statements & Conditionals", videoUrl: "https://www.youtube.com/embed/f4KOjWS_KZs", duration: 840 },
            { title: "For Loops & While Loops", videoUrl: "https://www.youtube.com/embed/94UHCEmprCY", duration: 960 },
            { title: "Functions & Parameters", videoUrl: "https://www.youtube.com/embed/9Os0o3wzS_I", duration: 1080 },
          ],
          quiz: {
            title: "Control Flow Quiz",
            passingScore: 70,
            questions: [
              { question: "What keyword is used to define a function in Python?", options: ["function", "def", "fun", "method"], correctIndex: 1, explanation: "Python uses 'def' to define functions." },
              { question: "Which loop is best when you know the exact number of iterations?", options: ["while loop", "do-while loop", "for loop", "repeat loop"], correctIndex: 2, explanation: "For loops are ideal for known iteration counts." },
              { question: "What does 'return' do in a function?", options: ["Exits the program", "Prints a value", "Sends a value back to the caller", "Loops back"], correctIndex: 2, explanation: "return sends a value back from the function." },
            ],
          },
        },
      ],
    },
    {
      title: "AI Tools Mastery: ChatGPT, Gemini & More",
      slug: "ai-tools-mastery",
      description: "Become an AI power user. Master ChatGPT, Google Gemini, Claude, Midjourney, and 20+ AI tools. Learn prompt engineering, automation workflows, and AI-powered productivity hacks.",
      shortDesc: "Master AI tools for productivity, creativity, and automation.",
      price: 699,
      level: "BEGINNER" as const,
      categoryId: aiCat.id,
      tags: ["ai", "chatgpt", "gemini", "prompt engineering", "automation"],
      duration: 600,
      sections: [
        {
          title: "Introduction to AI Tools",
          lessons: [
            { title: "The AI Revolution: What You Need to Know", videoUrl: "https://www.youtube.com/embed/jPhJbKBuNnA", duration: 540, isFree: true },
            { title: "ChatGPT Deep Dive: Prompts & Use Cases", videoUrl: "https://www.youtube.com/embed/sTeoEFzVNSc", duration: 720 },
            { title: "Google Gemini: Features & Workflows", videoUrl: "https://www.youtube.com/embed/Q1zFVMtp0i0", duration: 660 },
          ],
          quiz: {
            title: "AI Fundamentals Quiz",
            passingScore: 70,
            questions: [
              { question: "What is 'prompt engineering'?", options: ["Building AI models", "Crafting effective inputs for AI", "Programming in Python", "Designing AI hardware"], correctIndex: 1, explanation: "Prompt engineering is about writing effective prompts to get better AI outputs." },
              { question: "Which company created ChatGPT?", options: ["Google", "Meta", "OpenAI", "Microsoft"], correctIndex: 2, explanation: "ChatGPT was created by OpenAI." },
              { question: "What does LLM stand for?", options: ["Large Language Model", "Linear Learning Machine", "Logic Layer Module", "Low Level Memory"], correctIndex: 0, explanation: "LLM = Large Language Model, the architecture behind ChatGPT, Gemini, etc." },
            ],
          },
        },
        {
          title: "Productivity & Automation with AI",
          lessons: [
            { title: "AI for Writing: Emails, Reports & Content", videoUrl: "https://www.youtube.com/embed/Pz_P6XVhBKk", duration: 780 },
            { title: "AI Image Generation with Midjourney", videoUrl: "https://www.youtube.com/embed/SKbhDPtT0Hg", duration: 840 },
            { title: "Building AI Workflows with Zapier & Make", videoUrl: "https://www.youtube.com/embed/2xkMFEiTITs", duration: 900 },
          ],
          quiz: null,
        },
      ],
    },
    {
      title: "MS Excel & Office Suite Complete Course",
      slug: "ms-excel-office-complete",
      description: "From basic spreadsheets to advanced Excel formulas, pivot tables, VLOOKUP, macros, and data analysis. Also covers Word, PowerPoint, and Outlook for a full Office Suite mastery.",
      shortDesc: "Master Excel, Word, PowerPoint and the full MS Office suite.",
      price: 399,
      level: "BEGINNER" as const,
      categoryId: officeCat.id,
      tags: ["excel", "ms office", "spreadsheets", "data analysis", "vlookup"],
      duration: 540,
      sections: [
        {
          title: "Excel Fundamentals",
          lessons: [
            { title: "Excel Interface & Basic Navigation", videoUrl: "https://www.youtube.com/embed/Vl0H-qTclOg", duration: 600, isFree: true },
            { title: "Formulas & Functions: SUM, AVERAGE, IF", videoUrl: "https://www.youtube.com/embed/K74_FNnlIF8", duration: 840 },
            { title: "VLOOKUP & HLOOKUP Explained", videoUrl: "https://www.youtube.com/embed/d3BYVQ6xIE4", duration: 720 },
            { title: "Pivot Tables & Charts", videoUrl: "https://www.youtube.com/embed/qu-AK0Hv0b4", duration: 960 },
          ],
          quiz: {
            title: "Excel Basics Quiz",
            passingScore: 70,
            questions: [
              { question: "Which formula adds a range of cells in Excel?", options: ["=ADD(A1:A10)", "=SUM(A1:A10)", "=TOTAL(A1:A10)", "=COUNT(A1:A10)"], correctIndex: 1, explanation: "SUM is the function used to add a range." },
              { question: "VLOOKUP stands for:", options: ["Vertical Lookup", "Visual Lookup", "Variable Lookup", "Volume Lookup"], correctIndex: 0, explanation: "VLOOKUP = Vertical Lookup, searches column by column." },
              { question: "What is a Pivot Table used for?", options: ["Creating charts", "Summarizing large datasets", "Writing macros", "Formatting cells"], correctIndex: 1, explanation: "Pivot tables are used to summarize and analyze large amounts of data." },
            ],
          },
        },
      ],
    },
    {
      title: "Data Science with Python: Complete Bootcamp",
      slug: "data-science-python-bootcamp",
      description: "Learn data science from scratch using Python. Covers NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, and real-world projects including EDA, ML models, and data visualization.",
      shortDesc: "Complete data science course: Python, ML, visualization & projects.",
      price: 999,
      level: "INTERMEDIATE" as const,
      categoryId: dsCat.id,
      tags: ["data science", "python", "machine learning", "pandas", "numpy"],
      duration: 1080,
      sections: [
        {
          title: "Data Analysis with Pandas",
          lessons: [
            { title: "Introduction to Data Science", videoUrl: "https://www.youtube.com/embed/ua-CiDNNj30", duration: 720, isFree: true },
            { title: "NumPy Arrays & Operations", videoUrl: "https://www.youtube.com/embed/QUT1VHiLmmI", duration: 960 },
            { title: "Pandas DataFrames & Data Cleaning", videoUrl: "https://www.youtube.com/embed/vmEHCJofslg", duration: 1200 },
          ],
          quiz: {
            title: "Data Analysis Quiz",
            passingScore: 70,
            questions: [
              { question: "Which library is used for data manipulation in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], correctIndex: 1, explanation: "Pandas is the primary library for data manipulation and analysis." },
              { question: "What does df.head() do?", options: ["Shows last 5 rows", "Shows first 5 rows", "Shows column names", "Shows data types"], correctIndex: 1, explanation: "df.head() displays the first 5 rows of a DataFrame." },
              { question: "NaN in a dataset stands for:", options: ["Not a Null", "Not a Number", "New Array Node", "Negative and Null"], correctIndex: 1, explanation: "NaN = Not a Number, represents missing values." },
            ],
          },
        },
        {
          title: "Machine Learning Basics",
          lessons: [
            { title: "Introduction to Machine Learning", videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU", duration: 900 },
            { title: "Linear Regression from Scratch", videoUrl: "https://www.youtube.com/embed/KsVBBJRb9TE", duration: 1080 },
            { title: "Classification with Scikit-learn", videoUrl: "https://www.youtube.com/embed/0Lt9w-BxKFQ", duration: 1200 },
          ],
          quiz: {
            title: "ML Fundamentals Quiz",
            passingScore: 70,
            questions: [
              { question: "What is supervised learning?", options: ["Learning without labels", "Learning with labeled data", "Reinforcement-based learning", "Unsupervised clustering"], correctIndex: 1, explanation: "Supervised learning uses labeled training data." },
              { question: "Which algorithm is used for regression problems?", options: ["K-Means", "Decision Tree", "Linear Regression", "PCA"], correctIndex: 2, explanation: "Linear Regression predicts continuous values." },
              { question: "What does train_test_split do?", options: ["Trains the model", "Splits data into training and testing sets", "Scales features", "Evaluates accuracy"], correctIndex: 1, explanation: "train_test_split divides your data to evaluate model performance." },
            ],
          },
        },
      ],
    },
    {
      title: "Resume Writing & Interview Preparation",
      slug: "resume-interview-prep",
      description: "Build an ATS-friendly resume, write compelling cover letters, ace HR rounds, technical interviews, and group discussions. Includes mock interview practice and real-world templates.",
      shortDesc: "Build a killer resume and ace every interview round.",
      price: 299,
      level: "BEGINNER" as const,
      categoryId: resumeCat.id,
      tags: ["resume", "interview", "job search", "career", "placement"],
      duration: 360,
      sections: [
        {
          title: "Building Your Resume",
          lessons: [
            { title: "Resume Fundamentals: What Recruiters Look For", videoUrl: "https://www.youtube.com/embed/Tt08KmFfIYQ", duration: 600, isFree: true },
            { title: "ATS Optimization: Get Past the Bots", videoUrl: "https://www.youtube.com/embed/J-SnbaxhFh0", duration: 720 },
            { title: "Writing a Compelling Cover Letter", videoUrl: "https://www.youtube.com/embed/5Al7HCd-QSk", duration: 540 },
          ],
          quiz: {
            title: "Resume Mastery Quiz",
            passingScore: 70,
            questions: [
              { question: "What does ATS stand for?", options: ["Applicant Tracking System", "Automated Test Suite", "Application Template Software", "Advanced Talent Screening"], correctIndex: 0, explanation: "ATS = Applicant Tracking System, used by companies to filter resumes." },
              { question: "How long should a fresher's resume be?", options: ["3-4 pages", "1 page", "2 pages", "No limit"], correctIndex: 1, explanation: "A fresher's resume should be 1 page \u2014 concise and targeted." },
              { question: "Which resume format is best for freshers?", options: ["Functional", "Chronological", "Combination", "Infographic"], correctIndex: 1, explanation: "Chronological format is most widely accepted and ATS-friendly." },
            ],
          },
        },
        {
          title: "Interview Skills",
          lessons: [
            { title: "HR Round: Common Questions & Best Answers", videoUrl: "https://www.youtube.com/embed/HG68Ymazo18", duration: 780 },
            { title: "Technical Interview Strategies", videoUrl: "https://www.youtube.com/embed/1t1_a1BZ04o", duration: 840 },
          ],
          quiz: null,
        },
      ],
    },
    {
      title: "UI/UX Design Fundamentals",
      slug: "uiux-design-fundamentals",
      description: "Learn the principles of great design. Master Figma, wireframing, prototyping, user research, and design systems. Build a professional portfolio with 3 real-world projects.",
      shortDesc: "Master Figma, design principles, and build a portfolio.",
      price: 599,
      level: "BEGINNER" as const,
      categoryId: designCat.id,
      tags: ["ui design", "ux design", "figma", "wireframing", "portfolio"],
      duration: 660,
      sections: [
        {
          title: "Design Principles & Figma",
          lessons: [
            { title: "What is UI/UX Design?", videoUrl: "https://www.youtube.com/embed/v6n1i0qojws", duration: 480, isFree: true },
            { title: "Figma Crash Course: Interface & Tools", videoUrl: "https://www.youtube.com/embed/jwCmIBJ8Jtc", duration: 900 },
            { title: "Color Theory & Typography for UI", videoUrl: "https://www.youtube.com/embed/GyVMoejbGFg", duration: 720 },
          ],
          quiz: {
            title: "Design Fundamentals Quiz",
            passingScore: 70,
            questions: [
              { question: "What does UX stand for?", options: ["User Excellence", "User Experience", "Unified Exchange", "Universal Extension"], correctIndex: 1, explanation: "UX = User Experience \u2014 how a user feels when interacting with a product." },
              { question: "Which tool is the industry standard for UI design?", options: ["Photoshop", "Illustrator", "Figma", "Canva"], correctIndex: 2, explanation: "Figma is the leading collaborative design tool for UI/UX." },
              { question: "What is a wireframe?", options: ["A finished design", "A low-fidelity blueprint of a screen", "A color palette", "An animation"], correctIndex: 1, explanation: "Wireframes are basic blueprints showing layout without color or style." },
            ],
          },
        },
        {
          title: "Prototyping & User Research",
          lessons: [
            { title: "Creating Interactive Prototypes in Figma", videoUrl: "https://www.youtube.com/embed/lTIeZ2ahEkQ", duration: 840 },
            { title: "User Research Methods", videoUrl: "https://www.youtube.com/embed/bVm7bzarRLQ", duration: 660 },
            { title: "Design Systems & Component Libraries", videoUrl: "https://www.youtube.com/embed/Dtd40cHQQlk", duration: 780 },
          ],
          quiz: {
            title: "Prototyping Quiz",
            passingScore: 70,
            questions: [
              { question: "What is a design system?", options: ["A programming language", "A collection of reusable components and guidelines", "A photo editing tool", "A database structure"], correctIndex: 1, explanation: "Design systems are collections of reusable UI components with usage guidelines." },
              { question: "User interviews are part of:", options: ["Visual design", "User research", "Prototyping", "Development"], correctIndex: 1, explanation: "User interviews are a primary method of user research." },
              { question: "What is the purpose of a prototype?", options: ["Final delivery to users", "Testing concepts before development", "Writing code", "Creating a database"], correctIndex: 1, explanation: "Prototypes let you test ideas and gather feedback before building." },
            ],
          },
        },
      ],
    },
  ];

  // ── Create courses ──────────────────────────────────────────────────────────
  for (const courseDef of courseDefs) {
    const { sections, ...courseData } = courseDef;
    const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);

    // Idempotent Course creation
    const course = await db.course.upsert({
      where: { slug: courseData.slug },
      update: { 
        ...courseData, 
        instructorId: admin.id, 
        status: "PUBLISHED", 
        totalLessons 
      },
      create: {
        ...courseData,
        instructorId: admin.id,
        status: "PUBLISHED",
        rating: parseFloat((4.3 + Math.random() * 0.6).toFixed(1)),
        totalRatings: Math.floor(Math.random() * 2000) + 500,
        totalStudents: Math.floor(Math.random() * 500) + 100,
        totalLessons,
      },
    });

    // Delete existing sections to avoid duplicates when re-seeding
    await db.section.deleteMany({ where: { courseId: course.id } });

    for (let si = 0; si < sections.length; si++) {
      const sectionDef = sections[si];
      const section = await db.section.create({
        data: { title: sectionDef.title, order: si + 1, courseId: course.id },
      });

      for (let li = 0; li < sectionDef.lessons.length; li++) {
        const lessonDef = sectionDef.lessons[li];
        const lesson = await db.lesson.create({
          data: {
            title: lessonDef.title,
            videoUrl: lessonDef.videoUrl,
            duration: lessonDef.duration,
            order: li + 1,
            isFree: (lessonDef as { isFree?: boolean }).isFree ?? false,
            lessonType: "VIDEO",
            sectionId: section.id,
          },
        });

        // Attach quiz to last lesson of section if section has quiz
        if (li === sectionDef.lessons.length - 1 && sectionDef.quiz) {
          const quiz = await db.quiz.create({
            data: {
              title: sectionDef.quiz.title,
              passingScore: sectionDef.quiz.passingScore,
              lessonId: lesson.id,
            },
          });

          for (let qi = 0; qi < sectionDef.quiz.questions.length; qi++) {
            const q = sectionDef.quiz.questions[qi];
            await db.quizQuestion.create({
              data: {
                quizId: quiz.id,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                order: qi + 1,
              },
            });
          }
        }
      }
    }
    console.log(`\u2705 Created/Updated course: ${course.title}`);
  }

  // ── Sample internships ──────────────────────────────────────────────────────
  const internships = [
    {
      title: "Frontend Developer Intern",
      slug: "frontend-developer-intern-techcorp",
      company: "TechCorp India",
      description: "Work with our product team to build React-based web apps.",
      requirements: "Basic knowledge of HTML, CSS, JavaScript.",
      location: "Bengaluru",
      isRemote: true,
      stipend: 15000,
      duration: "3 months",
      skills: ["React", "JavaScript", "CSS", "HTML"],
      status: "OPEN" as const,
      openings: 3,
    },
    {
      title: "Data Science Intern",
      slug: "data-science-intern-analytica",
      company: "Analytica Labs",
      description: "Join our data team to analyze datasets, build ML models.",
      requirements: "Python, Pandas, basic statistics knowledge.",
      location: "Mumbai",
      isRemote: false,
      stipend: 20000,
      duration: "6 months",
      skills: ["Python", "Pandas", "Machine Learning", "Data Analysis"],
      status: "OPEN" as const,
      openings: 2,
    },
  ];

  for (const internshipData of internships) {
    await db.internship.upsert({
      where: { slug: internshipData.slug },
      update: { ...internshipData, recruiterId: recruiter.id },
      create: { ...internshipData, recruiterId: recruiter.id },
    });
  }

  // ── Sample live classes ──────────────────────────────────────────────────────
  const now = new Date();
  const liveClasses = [
    {
      title: "Python Doubt Clearing Session",
      description: "Live Q&A and doubt clearing for Python beginners.",
      scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      meetLink: "https://meet.google.com/nexora-python-live",
      status: "SCHEDULED" as const,
      tags: ["python", "beginner"],
    },
    {
      title: "AI Tools Workshop",
      description: "Hands-on workshop on writing advanced prompts.",
      scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      duration: 120,
      meetLink: "https://meet.google.com/nexora-ai-workshop",
      status: "SCHEDULED" as const,
      tags: ["ai", "chatgpt"],
    },
  ];

  // For simplicity, we delete and recreate live classes as they don't have unique slugs
  await db.liveClass.deleteMany({
    where: { title: { in: liveClasses.map(l => l.title) } }
  });

  for (const liveClass of liveClasses) {
    await db.liveClass.create({ data: liveClass });
  }

  console.log("\u2705 Seeded live classes");
  console.log("\u2728 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });


