import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const DEFAULT_PROFILE = {
  goal: "Become more active",
  level: "Mostly inactive",
  time: "5 minutes",
  environment: "Hostel",
  equipment: "None",
  recent: "Inactive today",
  score: 67,
  fgi: 31,
  xp: 0,
  missionsCompleted: 0,
};

const missions = {
  "5 minutes": {
    title: "5-Minute Energy Reset",
    duration: "5 min",
    difficulty: "Easy",
    steps: [
      "30 sec — March in place",
      "10 — Bodyweight squats",
      "10 — Wall push-ups",
      "30 sec — High knees",
      "1 min — Walk around your room",
      "30 sec — Shoulder mobility",
    ],
    xp: 50,
  },

  "10 minutes": {
    title: "10-Minute Strength Builder",
    duration: "10 min",
    difficulty: "Moderate",
    steps: [
      "1 min — Brisk walk",
      "12 — Bodyweight squats",
      "8 — Wall push-ups",
      "20 sec — Plank",
      "10 — Reverse lunges",
      "1 min — Walk and recover",
      "Repeat once",
    ],
    xp: 80,
  },

  "20+ minutes": {
    title: "20-Minute Full Body Mission",
    duration: "20 min",
    difficulty: "Moderate",
    steps: [
      "2 min — Brisk walking",
      "15 — Squats",
      "10 — Push-ups / wall push-ups",
      "20 sec — Plank",
      "10 — Lunges",
      "2 min — Walking recovery",
      "30 sec — High knees",
      "2 min — Mobility cooldown",
    ],
    xp: 120,
  },
};

function getMission(profile) {
  if (profile.environment === "Classroom") {
    return {
      title: "Classroom Movement Reset",
      duration: "3 min",
      difficulty: "Easy",
      steps: [
        "30 sec — Shoulder mobility",
        "10 — Seated ankle movements",
        "10 — Seated knee extensions",
        "30 sec — Posture reset",
        "1 min — Walk after class",
      ],
      xp: 35,
    };
  }

  if (profile.time === "3 minutes") {
    return {
      title: "3-Minute Reset",
      duration: "3 min",
      difficulty: "Easy",
      steps: [
        "15 — Squats",
        "10 — Wall push-ups",
        "30 sec — High knees",
        "30 sec — Stretching",
      ],
      xp: 30,
    };
  }

  return missions[profile.time] || missions["5 minutes"];
}

function App() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("athlora-profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [page, setPage] = useState("dashboard");

  const currentMission = useMemo(
    () => getMission(profile),
    [profile]
  );

  function updateProfile(key, value) {
    const updated = {
      ...profile,
      [key]: value,
    };

    setProfile(updated);
    localStorage.setItem("athlora-profile", JSON.stringify(updated));
  }

  function completeMission() {
    const updated = {
      ...profile,
      xp: profile.xp + currentMission.xp,
      missionsCompleted: profile.missionsCompleted + 1,
      fgi: Math.min(100, profile.fgi + 2),
    };

    setProfile(updated);
    localStorage.setItem("athlora-profile", JSON.stringify(updated));
    setPage("complete");
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="brand">
          <div className="brand-mark">A</div>

          <div>
            <div className="brand-name">ATHLORA</div>
            <div className="brand-subtitle">
              THE ANTI-SEDENTARY ENGINE
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        {page === "dashboard" && (
          <Dashboard
            profile={profile}
            mission={currentMission}
            onStart={() => setPage("mission")}
            onSetup={() => setPage("setup")}
          />
        )}

        {page === "setup" && (
          <Setup
            profile={profile}
            updateProfile={updateProfile}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "baseline" && (
          <Baseline
            profile={profile}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "passport" && (
          <Passport
            profile={profile}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "mission" && (
          <Mission
            profile={profile}
            mission={currentMission}
            onComplete={completeMission}
            onVerify={() => setPage("verify")}
          />
        )}

        {page === "verify" && (
          <Verify
            onComplete={completeMission}
            onBack={() => setPage("mission")}
          />
        )}

        {page === "complete" && (
          <Complete
            profile={profile}
            mission={currentMission}
            onDashboard={() => setPage("dashboard")}
            onMission={() => setPage("mission")}
          />
        )}

        {page === "campus" && (
          <Campus
            onBack={() => setPage("dashboard")}
          />
        )}
      </main>

      <BottomNavigation
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({
  profile,
  mission,
  onStart,
  onSetup,
}) {
  return (
    <div className="page">
      <section className="dashboard-intro">
        <div>
          <span className="eyebrow">YOUR DAILY ENGINE</span>

          <h1>
            Fitness that fits
            <br />
            <span>your actual day.</span>
          </h1>

          <p>
            ATHLORA finds small opportunities to move instead
            of waiting for you to schedule a workout.
          </p>
        </div>

        <div className="profile-badge">
          <span>FITNESS</span>
          <strong>{profile.score}</strong>
        </div>
      </section>

      <section className="context-card">
        <div className="section-label">
          <span className="live-dot"></span>
          CONTEXT-AWARE FITNESS
        </div>

        <div className="context-grid">
          <div>
            <small>TIME AVAILABLE</small>
            <strong>{profile.time}</strong>
          </div>

          <div>
            <small>ENVIRONMENT</small>
            <strong>{profile.environment}</strong>
          </div>

          <div>
            <small>FITNESS LEVEL</small>
            <strong>{profile.level}</strong>
          </div>

          <div>
            <small>GOAL</small>
            <strong>{profile.goal}</strong>
          </div>
        </div>

        <button
          className="secondary-button"
          onClick={onSetup}
        >
          Adjust My Context →
        </button>
      </section>

      <section className="mission-card">
        <div className="mission-top">
          <div>
            <span className="eyebrow">LIVE MISSION</span>

            <h2>{mission.title}</h2>

            <p>
              Generated around your current time,
              environment and activity level.
            </p>
          </div>

          <div className="mission-time">
            <strong>{mission.duration}</strong>
            <span>{mission.difficulty}</span>
          </div>
        </div>

        <div className="mission-preview">
          {mission.steps.slice(0, 4).map((step, index) => (
            <div className="mission-step" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <button
          className="primary-button"
          onClick={onStart}
        >
          Start Move Mission →
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>FITNESS GROWTH</span>
          <strong>+{profile.fgi}%</strong>
          <small>Improvement index</small>
        </div>

        <div className="stat-card">
          <span>MISSION XP</span>
          <strong>{profile.xp}</strong>
          <small>Total earned</small>
        </div>

        <div className="stat-card">
          <span>MISSIONS</span>
          <strong>{profile.missionsCompleted}</strong>
          <small>Completed</small>
        </div>
      </section>

      <section className="innovation-callout">
        <div className="callout-icon">✦</div>

        <div>
          <span>ATHLORA DIFFERENCE</span>
          <h3>
            We don't ask, "How fit are you?"
          </h3>
          <p>
            We ask, "How much are you improving?"
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================
   SETUP
========================= */

function Setup({
  profile,
  updateProfile,
  onBack,
}) {
  return (
    <div className="page">
      <PageHeading
        eyebrow="MY SETUP"
        title="Tell ATHLORA about your day."
        description="This context helps the Opportunity Engine generate realistic Move Missions."
      />

      <div className="setup-grid">
        <OptionGroup
          title="What's your goal?"
          value={profile.goal}
          options={[
            "Become more active",
            "Build strength",
            "Improve mobility",
            "Improve stamina",
          ]}
          onChange={(value) => updateProfile("goal", value)}
        />

        <OptionGroup
          title="Current activity level"
          value={profile.level}
          options={[
            "Mostly inactive",
            "Lightly active",
            "Moderately active",
            "Very active",
          ]}
          onChange={(value) => updateProfile("level", value)}
        />

        <OptionGroup
          title="Time available"
          value={profile.time}
          options={[
            "3 minutes",
            "5 minutes",
            "10 minutes",
            "20+ minutes",
          ]}
          onChange={(value) => updateProfile("time", value)}
        />

        <OptionGroup
          title="Where are you?"
          value={profile.environment}
          options={[
            "Hostel",
            "Room / Home",
            "Classroom",
            "Campus",
            "Gym",
          ]}
          onChange={(value) =>
            updateProfile("environment", value)
          }
        />

        <OptionGroup
          title="Equipment available"
          value={profile.equipment}
          options={[
            "None",
            "Chair",
            "Mat",
            "Dumbbells",
          ]}
          onChange={(value) =>
            updateProfile("equipment", value)
          }
        />

        <OptionGroup
          title="Recent activity"
          value={profile.recent}
          options={[
            "Inactive today",
            "Active today",
            "Inactive for 2+ days",
            "Regularly active",
          ]}
          onChange={(value) =>
            updateProfile("recent", value)
          }
        />
      </div>

      <button
        className="primary-button"
        onClick={onBack}
      >
        Save My Context →
      </button>
    </div>
  );
}

/* =========================
   BASELINE
========================= */

function Baseline({
  profile,
  onBack,
}) {
  const tests = [
    {
      title: "Squat Assessment",
      text: "Check lower-body movement and stability.",
    },
    {
      title: "Push-up Assessment",
      text: "Measure upper-body strength capability.",
    },
    {
      title: "Plank Assessment",
      text: "Estimate core endurance.",
    },
    {
      title: "Jumping Jack Assessment",
      text: "Observe coordination and activity capacity.",
    },
    {
      title: "Mobility Assessment",
      text: "Check basic range of movement.",
    },
  ];

  return (
    <div className="page">
      <PageHeading
        eyebrow="AI BASELINE"
        title="Understand your starting point."
        description="Computer vision can create an initial fitness profile from simple movement tests."
      />

      <div className="baseline-score">
        <div>
          <span>CURRENT FITNESS PROFILE</span>
          <strong>{profile.score}</strong>
        </div>

        <div className="score-ring">
          {profile.score}
        </div>
      </div>

      <div className="test-list">
        {tests.map((test, index) => (
          <div className="test-card" key={test.title}>
            <div className="test-number">
              0{index + 1}
            </div>

            <div>
              <h3>{test.title}</h3>
              <p>{test.text}</p>
            </div>

            <button>Test →</button>
          </div>
        ))}
      </div>

      <button
        className="secondary-button full-width"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

/* =========================
   PASSPORT
========================= */

function Passport({
  profile,
  onBack,
}) {
  return (
    <div className="page">
      <PageHeading
        eyebrow="FITNESS PASSPORT"
        title="Your improvement profile."
        description="ATHLORA focuses on personal growth instead of comparing you with athletes."
      />

      <section className="passport-hero">
        <span>FITNESS GROWTH INDEX</span>

        <strong>+{profile.fgi}%</strong>

        <p>
          Your progress is measured against your own
          previous performance.
        </p>
      </section>

      <div className="passport-grid">
        <div className="passport-stat">
          <span>FITNESS SCORE</span>
          <strong>{profile.score}</strong>
        </div>

        <div className="passport-stat">
          <span>MISSIONS</span>
          <strong>{profile.missionsCompleted}</strong>
        </div>

        <div className="passport-stat">
          <span>XP EARNED</span>
          <strong>{profile.xp}</strong>
        </div>

        <div className="passport-stat">
          <span>GROWTH</span>
          <strong>+{profile.fgi}%</strong>
        </div>
      </div>

      <div className="growth-message">
        <span>WHY FGI?</span>

        <h3>
          Improvement matters more than starting ability.
        </h3>

        <p>
          A beginner improving from 8 push-ups to 12
          has meaningful growth, even if another student
          can already do 40.
        </p>
      </div>

      <button
        className="secondary-button full-width"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

/* =========================
   MISSION
========================= */

function Mission({
  mission,
  onComplete,
  onVerify,
}) {
  return (
    <div className="page">
      <PageHeading
        eyebrow="MOVE MISSION"
        title={mission.title}
        description="A small achievable activity generated around your current context."
      />

      <section className="active-mission">
        <div className="active-mission-header">
          <div>
            <span>DURATION</span>
            <strong>{mission.duration}</strong>
          </div>

          <div>
            <span>DIFFICULTY</span>
            <strong>{mission.difficulty}</strong>
          </div>

          <div>
            <span>REWARD</span>
            <strong>+{mission.xp} XP</strong>
          </div>
        </div>

        <div className="full-step-list">
          {mission.steps.map((step, index) => (
            <div
              className="full-step"
              key={index}
            >
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className="mission-actions">
          <button
            className="primary-button"
            onClick={onVerify}
          >
            Verify My Movement →
          </button>

          <button
            className="secondary-button"
            onClick={onComplete}
          >
            Complete Demo Mission
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================
   VERIFY
========================= */

function Verify({
  onComplete,
  onBack,
}) {
  const [reps, setReps] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);

  function startCamera() {
    setCameraOn(true);
  }

  return (
    <div className="page">
      <PageHeading
        eyebrow="AI VERIFICATION"
        title="Prove the movement."
        description="The prototype can use computer vision to verify exercise form and repetitions."
      />

      <div className="camera-card">
        {cameraOn ? (
          <div className="camera-placeholder">
            <div className="camera-grid"></div>

            <div className="camera-person">
              ◯
              <br />
              /|\
              <br />
              / \
            </div>

            <span>POSE DETECTION ACTIVE</span>
          </div>
        ) : (
          <div className="camera-off">
            <div className="camera-icon">◉</div>

            <h3>Camera Verification</h3>

            <p>
              Allow camera access to demonstrate
              real-time movement verification.
            </p>

            <button
              className="primary-button"
              onClick={startCamera}
            >
              Start Camera
            </button>
          </div>
        )}
      </div>

      <div className="verification-stats">
        <div>
          <span>REPS VERIFIED</span>
          <strong>{reps}</strong>
        </div>

        <div>
          <span>FORM STATUS</span>
          <strong>
            {cameraOn ? "Tracking" : "Waiting"}
          </strong>
        </div>
      </div>

      <div className="demo-controls">
        <button
          className="secondary-button"
          onClick={() => setReps((value) => value + 1)}
        >
          + Add Verified Rep
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Finish Mission →
        </button>
      </div>

      <button
        className="text-button"
        onClick={onBack}
      >
        ← Back to Mission
      </button>
    </div>
  );
}

/* =========================
   COMPLETE
========================= */

function Complete({
  profile,
  mission,
  onDashboard,
  onMission,
}) {
  return (
    <div className="page completion-page">
      <div className="success-icon">✓</div>

      <span className="eyebrow">MISSION COMPLETE</span>

      <h1>
        You created
        <br />
        <span>active time.</span>
      </h1>

      <p>
        That's the ATHLORA loop:
        <br />
        Find an opportunity → Move → Verify → Improve.
      </p>

      <div className="reward-card">
        <div>
          <span>XP EARNED</span>
          <strong>+{mission.xp}</strong>
        </div>

        <div>
          <span>FITNESS GROWTH</span>
          <strong>+{profile.fgi}%</strong>
        </div>

        <div>
          <span>TOTAL MISSIONS</span>
          <strong>{profile.missionsCompleted}</strong>
        </div>
      </div>

      <div className="completion-actions">
        <button
          className="primary-button"
          onClick={onDashboard}
        >
          Return to Dashboard
        </button>

        <button
          className="secondary-button"
          onClick={onMission}
        >
          Do Another Mission
        </button>
      </div>
    </div>
  );
}

/* =========================
   CAMPUS
========================= */

function Campus({
  onBack,
}) {
  return (
    <div className="page">
      <PageHeading
        eyebrow="CAMPUS CHALLENGE"
        title="Make movement social."
        description="A campus-wide layer can turn individual activity into collective participation."
      />

      <section className="campus-hero">
        <div>
          <span>THIS WEEK</span>
          <h2>Move More Campus</h2>
          <p>
            Students contribute movement XP to their
            campus challenge.
          </p>
        </div>

        <strong>12,480 XP</strong>
      </section>

      <div className="campus-list">
        <div>
          <span>01</span>
          <strong>Computer Science</strong>
          <b>4,280 XP</b>
        </div>

        <div>
          <span>02</span>
          <strong>Data Science</strong>
          <b>3,940 XP</b>
        </div>

        <div>
          <span>03</span>
          <strong>Engineering</strong>
          <b>2,810 XP</b>
        </div>
      </div>

      <button
        className="secondary-button full-width"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function PageHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>
  );
}

function OptionGroup({
  title,
  value,
  options,
  onChange,
}) {
  return (
    <div className="option-group">
      <h3>{title}</h3>

      <div className="option-list">
        {options.map((option) => (
          <button
            key={option}
            className={
              value === option
                ? "option selected"
                : "option"
            }
            onClick={() => onChange(option)}
          >
            <span>{option}</span>

            {value === option && (
              <span className="option-check">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function BottomNavigation({
  page,
  setPage,
}) {
  const items = [
    {
      id: "dashboard",
      icon: "⌂",
      label: "Dashboard",
    },
    {
      id: "setup",
      icon: "⚙",
      label: "My Setup",
    },
    {
      id: "baseline",
      icon: "◎",
      label: "AI Baseline",
    },
    {
      id: "passport",
      icon: "◈",
      label: "Passport",
    },
    {
      id: "mission",
      icon: "⚡",
      label: "Mission",
    },
    {
      id: "verify",
      icon: "◉",
      label: "Verify",
    },
    {
      id: "campus",
      icon: "♙",
      label: "Campus",
    },
  ];

  return (
    <nav className="bottom-navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={
            page === item.id
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() => setPage(item.id)}
        >
          <span className="nav-icon">
            {item.icon}
          </span>

          <span className="nav-label">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
