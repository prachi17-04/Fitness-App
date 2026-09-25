import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { createRoot } from "react-dom/client";

import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils
} from "@mediapipe/tasks-vision";

import "./styles.css";


/* =========================================================
   MEDIAPIPE
========================================================= */

const MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

const WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";


/* =========================================================
   DEFAULT PROFILE
========================================================= */

const DEFAULT = {
  goal: "Become more active",
  level: "Mostly inactive",
  time: "5 minutes",
  environment: "Hostel",
  equipment: "None",
  recent: "Inactive today",

  score: 67,
  fgi: 0,
  streak: 4,
  xp: 0
};


/* =========================================================
   MISSION ENGINE
========================================================= */

function mission(p) {

  const t = parseInt(p.time) || 5;


  if (p.environment === "Classroom") {

    return {
      title: `${t}-Minute Classroom Reset`,

      focus: "Mobility + posture",

      items: [
        ["30 sec", "Shoulder mobility"],
        ["30 sec", "Ankle movement"],
        ["60 sec", "Posture reset"],
        ["2 min", "Walk after class"]
      ]
    };
  }


  if (t <= 3) {

    return {
      title: "3-Minute Energy Reset",

      focus: "Activation",

      items: [
        ["15 reps", "Bodyweight squats"],
        ["10 reps", "Wall push-ups"],
        ["30 sec", "High knees"],
        ["30 sec", "Mobility"]
      ]
    };
  }


  if (
    t >= 10 &&
    p.goal === "Build strength"
  ) {

    return {
      title: `${t}-Minute Strength Builder`,

      focus: "Strength",

      items: [
        ["12 reps", "Squats"],
        ["10 reps", "Wall / incline push-ups"],
        ["10 reps", "Reverse lunges"],
        ["30 sec", "Plank"],
        ["2 min", "Brisk walk"]
      ]
    };
  }


  return {

    title: `${t}-Minute Mobility + Energy Boost`,

    focus: "Mobility",

    items: [
      ["15 reps", "Bodyweight squats"],
      ["10 reps", "Reverse lunges"],
      ["30 sec", "Hip mobility"],
      ["60 sec", "March in place"],
      ["2 min", "Brisk walk"]
    ]

  };

}


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [p, setP] = useState(() => {

    const saved =
      JSON.parse(
        localStorage.getItem("athlora") || "{}"
      );

    return {
      ...DEFAULT,
      ...saved
    };

  });


  const [setup, setSetup] = useState(p);

  const [page, setPage] =
    useState("dashboard");


  const m =
    useMemo(
      () => mission(p),
      [p]
    );


  useEffect(() => {

    localStorage.setItem(
      "athlora",
      JSON.stringify(p)
    );

  }, [p]);


  const save = () => {

    setP({
      ...setup
    });

    setPage("baseline");

  };


  const baseline = () => {

    setP(x => ({
      ...x,
      score: 67
    }));

    setPage("passport");

  };


  const done = () => {

    setP(x => ({
      ...x,

      xp: x.xp + 80,

      fgi: x.fgi + 2,

      streak: Math.min(x.streak + 1, 7)

    }));

    setPage("complete");

  };


  return (

    <div className="app">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="top-header">

        <div>

          <div className="brand">

            ATHLORA
            <span>.</span>

          </div>

          <small>
            Fitness Made Easy
          </small>

        </div>


        <div className="header-status">

          <span className="online-dot"></span>

          ATHLORA FIT

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">


        {page === "dashboard" && (

          <Dashboard
            p={p}
            m={m}
            go={setPage}
          />

        )}


        {page === "setup" && (

          <Setup
            s={setup}
            set={setSetup}
            save={save}
          />

        )}


        {page === "baseline" && (

          <Baseline
            done={baseline}
          />

        )}


        {page === "passport" && (

          <Passport
            p={p}
            go={setPage}
          />

        )}


        {page === "mission" && (

          <Mission
            p={p}
            m={m}
            go={setPage}
          />

        )}


        {page === "verify" && (

          <Verifier
            done={done}
          />

        )}


        {page === "complete" && (

          <Complete
            p={p}
            go={setPage}
          />

        )}


        {page === "campus" && (

          <Campus />

        )}


        <footer>

          ATHLORA-Fitness Becomes a Daily Behaviour, Not a Scheduled Workout
          

        </footer>

      </main>


      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <BottomNavigation
        page={page}
        setPage={setPage}
      />

    </div>

  );

}


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

function BottomNavigation({
  page,
  setPage
}) {

  const items = [

    {
      id: "dashboard",
      icon: "⌂",
      label: "Dashboard"
    },

    {
      id: "setup",
      icon: "◉",
      label: "My Setup"
    },

    {
      id: "baseline",
      icon: "◌",
      label: "AI Baseline"
    },

    {
      id: "passport",
      icon: "◎",
      label: "Passport"
    },

    {
      id: "mission",
      icon: "⚡",
      label: "Mission"
    },

    {
      id: "verify",
      icon: "◈",
      label: "Verify"
    },

    {
      id: "campus",
      icon: "♧",
      label: "Campus"
    }

  ];


  return (

    <nav className="bottom-nav">

      <div className="bottom-nav-inner">

        {items.map(item => (

          <button

            key={item.id}

            className={
              page === item.id
                ? "bottom-item active"
                : "bottom-item"
            }

            onClick={() =>
              setPage(item.id)
            }

          >

            <span className="bottom-icon">

              {item.icon}

            </span>


            <span className="bottom-label">

              {item.label}

            </span>

          </button>

        ))}

      </div>

    </nav>

  );

}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  p,
  m,
  go
}) {

  const consistency =
    Math.min(p.streak, 7);

  const consistencyPercent =
    (consistency / 7) * 100;


  return (

    <section className="dashboard">


      {/* =================================================
          TODAY'S CONSISTENCY
          ONLY EXISTS ON DASHBOARD
      ================================================= */}

      <section className="consistency-card">

        <div className="consistency-header">

          <div>

            <small>
              TODAY'S CONSISTENCY
            </small>

            <h2>
              {consistency} / 7
            </h2>

            <p>
              active days this week
            </p>

          </div>


          <div className="consistency-icon">

            {consistency >= 5
              ? "🔥"
              : "⚡"}

          </div>

        </div>


        <div className="consistency-bar">

          <div
            style={{
              width:
                `${consistencyPercent}%`
            }}
          />

        </div>


        <div className="consistency-days">

          {[
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S"
          ].map((day, index) => (

            <div
              className={
                index < consistency
                  ? "day active"
                  : "day"
              }
              key={`${day}-${index}`}
            >

              <span>
                {index < consistency
                  ? "✓"
                  : ""}
              </span>

              <small>
                {day}
              </small>

            </div>

          ))}

        </div>

      </section>


      {/* =================================================
          CONTEXT + LIVE MISSION
      ================================================= */}

      <div className="hero">

        <section className="card context-card">

          <small>
            CONTEXT-AWARE FITNESS
          </small>


          <h2>
            Fitness that fits
            into a student's day.
          </h2>


          <p>

            ATHLORA uses

            <b>
              fitness level +
              available time +
              environment +
              recent activity
            </b>

            to turn a real-life
            constraint into a practical
            Move Mission.

          </p>


          <div className="button-group">

            <Btn
              onClick={() =>
                go("setup")
              }
            >

              Build My Fitness Profile →

            </Btn>


            <Btn

              secondary

              onClick={() =>
                go("mission")
              }

            >

              I Have 5 Minutes

            </Btn>

          </div>

        </section>


        <section className="card mission">

          <em>
            ⚡ LIVE MISSION
          </em>


          <h3>
            {m.title}
          </h3>


          <p>

            Designed for

            {" "}

            {p.level.toLowerCase()}

            {" • "}

            {p.environment}

            {" • "}

            {p.equipment}

            {" "}equipment.

          </p>


          {m.items
            .slice(0, 3)
            .map(x => (

              <div
                className="row"
                key={x[1]}
              >

                <span>

                  {x[0]}
                  {" • "}
                  {x[1]}

                </span>

                <b>
                  READY
                </b>

              </div>

            ))}


          <Btn
            onClick={() =>
              go("verify")
            }
          >

            Try AI Verification →

          </Btn>

        </section>

      </div>


      {/* =================================================
          DASHBOARD STATS
      ================================================= */}

      <div className="stats">

        <Stat
          a="Fitness Score"
          b={p.score}
          c="starting profile"
        />


        <Stat
          a="Fitness Growth Index"
          b={`+${p.fgi || 31}%`}
          c="personal improvement"
        />


        <Stat
          a="XP"
          b={p.xp}
          c="earned through movement"
        />

      </div>


      {/* =================================================
          CORE IDEA
      ================================================= */}

      <div className="callout">

        <b>
          Core idea:
        </b>

        {" "}

        don't ask a student to
        find a workout.

        Ask for the constraint—

        <b>
          time, place, ability
        </b>

        —and generate the movement
        around it.

      </div>

    </section>

  );

}


/* =========================================================
   BUTTON
========================================================= */

function Btn({
  children,
  onClick,
  secondary = false
}) {

  return (

    <button

      className={
        secondary
          ? "secondary"
          : "primary"
      }

      onClick={onClick}

    >

      {children}

    </button>

  );

}


/* =========================================================
   STAT
========================================================= */

function Stat({
  a,
  b,
  c
}) {

  return (

    <section className="card stat">

      <small>
        {a}
      </small>


      <strong>
        {b}
      </strong>


      <span>
        {c}
      </span>

    </section>

  );

}


/* =========================================================
   SETUP
========================================================= */

function Setup({
  s,
  set,
  save
}) {

  const data = {

    goal: [
      "Become more active",
      "Build strength",
      "Improve endurance",
      "Mobility & flexibility"
    ],

    level: [
      "Mostly inactive",
      "Occasionally active",
      "Regularly active",
      "Very active"
    ],

    time: [
      "3 minutes",
      "5 minutes",
      "10 minutes",
      "20+ minutes"
    ],

    environment: [
      "Room / Home",
      "Classroom",
      "Hostel",
      "Campus / Outdoors"
    ],

    equipment: [
      "None",
      "Chair",
      "Stairs",
      "Resistance band",
      "Dumbbells"
    ],

    recent: [
      "Inactive today",
      "Active today",
      "Active yesterday",
      "Returning after 3+ days"
    ]

  };


  return (

    <section className="card">

      <small>
        PERSONALIZATION
      </small>


      <h2>
        Let's make fitness
        fit your life.
      </h2>


      <p>

        No sport selection is required.
        Sports can be an optional
        training goal later.

      </p>


      {Object.entries(data)
        .map(
          ([key, values], index) => (

            <div
              className="setup"
              key={key}
            >

              <h3>

                {index + 1}.

                {" "}

                {key
                  .charAt(0)
                  .toUpperCase() +
                  key.slice(1)}

              </h3>


              <div className="options">

                {values.map(value => (

                  <button

                    className={
                      s[key] === value
                        ? "selected"
                        : ""
                    }

                    onClick={() =>
                      set({
                        ...s,
                        [key]: value
                      })
                    }

                    key={value}

                  >

                    {value}

                  </button>

                ))}

              </div>

            </div>

          )
        )}


      <Btn onClick={save}>

        Continue to AI Baseline →

      </Btn>

    </section>

  );

}


/* =========================================================
   BASELINE
========================================================= */

function Baseline({
  done
}) {

  const tests = [

    ["01", "Squats", "10 reps"],

    ["02", "Push-ups", "8 reps"],

    ["03", "Plank", "42 sec"],

    ["04", "Jumping Jacks", "30 sec"],

    ["05", "Mobility", "guided"]

  ];


  return (

    <section className="card">

      <small>
        AI FITNESS BASELINE • 5 MINUTES
      </small>


      <h2>
        Measure first.
        Improve intelligently.
      </h2>


      <p>

        A short baseline creates
        the student's starting profile.

        The camera module can later
        collect these values automatically.

      </p>


      <div className="tests">

        {tests.map(x => (

          <div
            className="card"
            key={x[0]}
          >

            <b>

              {x[0]}
              {" • "}
              {x[1]}

            </b>


            <small>
              {x[2]}
            </small>

          </div>

        ))}

      </div>


      <Btn onClick={done}>

        Complete Baseline →

      </Btn>

    </section>

  );

}


/* =========================================================
   FITNESS PASSPORT
========================================================= */

function Passport({
  p,
  go
}) {

  const metrics = [

    ["Strength", 72],

    ["Endurance", 69],

    ["Mobility", 54],

    ["Stability", 61]

  ];


  return (

    <section className="card">

      <small>
        FITNESS PASSPORT
      </small>


      <h2>
        A measurable
        starting point
      </h2>


      <div className="passport">

        <div>

          <div className="score">

            <b>
              {p.score}
            </b>

          </div>


          <p>
            Overall Fitness Score
          </p>

        </div>


        <div>

          {metrics.map(x => (

            <div
              className="metric"
              key={x[0]}
            >

              <span>

                {x[0]}

                <b>
                  {x[1]}
                </b>

              </span>


              <div className="bar">

                <i
                  style={{
                    width:
                      x[1] + "%"
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>


      <div className="callout">

        <b>
          ⚡ AI focus area: Mobility
        </b>

        <br />

        Next mission adapts to
        your weakest area and
        today's constraints.

      </div>


      <Btn
        onClick={() =>
          go("mission")
        }
      >

        Generate My Move Mission →

      </Btn>

    </section>

  );

}


/* =========================================================
   MOVE MISSION
========================================================= */

function Mission({
  p,
  m,
  go
}) {

  return (

    <section className="card mission">

      <small>
        CONTEXT-AWARE ACTIVITY GENERATION
      </small>


      <h2>
        ⚡ {m.title}
      </h2>


      <div className="chips">

        <span>
          {p.time}
        </span>

        <span>
          {p.level}
        </span>

        <span>
          {p.environment}
        </span>

        <span>
          {p.equipment}
        </span>

      </div>


      {m.items.map(x => (

        <div
          className="row big"
          key={x[1]}
        >

          <b>

            {x[0]}
            {" • "}
            {x[1]}

          </b>


          <em>
            AI SELECTED
          </em>

        </div>

      ))}


      <Btn
        onClick={() =>
          go("verify")
        }
      >

        Start AI Verification →

      </Btn>

    </section>

  );

}


/* =========================================================
   AI VERIFIER
========================================================= */

function Verifier({
  done
}) {

  const video =
    useRef(null);

  const canvas =
    useRef(null);

  const land =
    useRef(null);

  const stream =
    useRef(null);

  const phase =
    useRef("up");

  const last =
    useRef(0);

  const running =
    useRef(false);


  const [run, setRun] =
    useState(false);

  const [reps, setReps] =
    useState(0);

  const [angleV, setAngleV] =
    useState(180);

  const [status, setStatus] =
    useState("Camera is off");


  function ang(a, b, c) {

    const ab = [
      a.x - b.x,
      a.y - b.y
    ];

    const cb = [
      c.x - b.x,
      c.y - b.y
    ];


    const d =
      ab[0] * cb[0] +
      ab[1] * cb[1];


    const mag =
      Math.hypot(...ab) *
      Math.hypot(...cb);


    if (!mag) {
      return 180;
    }


    return Math.round(

      Math.acos(
        Math.max(
          -1,
          Math.min(
            1,
            d / mag
          )
        )
      ) *
      180 /
      Math.PI

    );

  }


  async function start() {

    try {

      setStatus(
        "Loading AI model…"
      );


      const v =
        await FilesetResolver
          .forVisionTasks(WASM);


      try {

        land.current =
          await PoseLandmarker
            .createFromOptions(
              v,
              {
                baseOptions: {
                  modelAssetPath: MODEL,
                  delegate: "GPU"
                },

                runningMode: "VIDEO",

                numPoses: 1
              }
            );

      } catch {

        land.current =
          await PoseLandmarker
            .createFromOptions(
              v,
              {
                baseOptions: {
                  modelAssetPath: MODEL,
                  delegate: "CPU"
                },

                runningMode: "VIDEO",

                numPoses: 1
              }
            );

      }


      stream.current =
        await navigator
          .mediaDevices
          .getUserMedia({

            video: {
              facingMode: "user",

              width: {
                ideal: 960
              },

              height: {
                ideal: 720
              }

            },

            audio: false

          });


      video.current.srcObject =
        stream.current;


      await video.current.play();


      running.current = true;

      setRun(true);

      setStatus(
        "AI pose tracking active"
      );


      requestAnimationFrame(
        loop
      );

    } catch (error) {

      console.error(error);

      setStatus(
        "Camera error. Allow camera permission and try again."
      );

    }

  }


  function loop() {

    if (!running.current) {
      return;
    }


    if (
      !video.current ||
      video.current.readyState < 2
    ) {

      requestAnimationFrame(loop);

      return;

    }


    const now =
      performance.now();


    if (
      now - last.current < 80
    ) {

      requestAnimationFrame(loop);

      return;

    }


    last.current = now;


    const result =
      land.current.detectForVideo(
        video.current,
        now
      );


    const c =
      canvas.current;


    c.width =
      video.current.videoWidth;

    c.height =
      video.current.videoHeight;


    const ctx =
      c.getContext("2d");


    ctx.clearRect(
      0,
      0,
      c.width,
      c.height
    );


    if (
      result.landmarks &&
      result.landmarks.length
    ) {

      const p =
        result.landmarks[0];


      const left =
        ang(
          p[23],
          p[25],
          p[27]
        );


      const right =
        ang(
          p[24],
          p[26],
          p[28]
        );


      const knee =
        (left + right) / 2;


      setAngleV(
        Math.round(knee)
      );


      const drawing =
        new DrawingUtils(ctx);


      drawing.drawLandmarks(
        p,
        {
          radius: 4
        }
      );


      drawing.drawConnectors(
        p,
        PoseLandmarker.POSE_CONNECTIONS,
        {
          lineWidth: 3
        }
      );


      if (
        knee < 105 &&
        phase.current === "up"
      ) {

        phase.current = "down";

      }


      if (
        knee > 160 &&
        phase.current === "down"
      ) {

        phase.current = "up";


        setReps(
          r => r + 1
        );

      }

    }


    requestAnimationFrame(
      loop
    );

  }


  function stop() {

    running.current = false;


    stream.current
      ?.getTracks()
      .forEach(
        t => t.stop()
      );


    land.current
      ?.close?.();


    setRun(false);

    setStatus(
      "Camera is off"
    );

  }


  useEffect(() => {

    return () => {

      running.current = false;

      stream.current
        ?.getTracks()
        .forEach(
          t => t.stop()
        );

    };

  }, []);


  return (

    <section className="card">

      <small>
        REAL-TIME COMPUTER VISION
      </small>


      <h2>
        AI Squat Verification
      </h2>


      <p>

        ATHLORA uses browser-based
        pose estimation to demonstrate
        real-time activity verification.

      </p>


      <div className="camera">

        <video
          ref={video}
          playsInline
          muted
        />


        <canvas
          ref={canvas}
        />


        {!run && (

          <div className="placeholder">

            📷

            <b>
              Camera ready
            </b>

            <small>
              Allow camera access
            </small>

          </div>

        )}

      </div>


      <div className="stats">

        <Stat
          a="Squat Reps"
          b={`${reps} / 8`}
          c="AI detected"
        />


        <Stat
          a="Knee Angle"
          b={`${angleV}°`}
          c="movement depth"
        />


        <Stat
          a="AI Status"
          b={run ? "ACTIVE" : "OFF"}
          c={status}
        />

      </div>


      <Btn
        onClick={
          run
            ? stop
            : start
        }
      >

        {run
          ? "Stop Camera"
          : "Start Camera + AI"}

      </Btn>


      {reps >= 8 && (

        <Btn
          onClick={() => {

            stop();

            done();

          }}
        >

          Complete Mission ✓

        </Btn>

      )}

    </section>

  );

}


/* =========================================================
   COMPLETE
========================================================= */

function Complete({
  p,
  go
}) {

  return (

    <section className="card center">

      <div className="celebrate">
        🎉
      </div>


      <small>
        VERIFIED ACTIVITY
      </small>


      <h2>
        Mission Complete
      </h2>


      <p>

        Your movement was verified
        through the AI camera detector.

      </p>


      <div className="stats">

        <Stat
          a="Fitness XP"
          b="+80"
          c="earned"
        />


        <Stat
          a="Growth Index"
          b={`+${p.fgi}%`}
          c="personal improvement"
        />


        <Stat
          a="Consistency"
          b={`${p.streak}/7`}
          c="active days"
        />

      </div>


      <div className="callout">

        <b>
          Keep building the habit.
        </b>

        <br />

        ATHLORA rewards improvement
        and returning after inactivity.

      </div>


      <Btn
        onClick={() =>
          go("dashboard")
        }
      >

        Back to Dashboard →

      </Btn>

    </section>

  );

}


/* =========================================================
   CAMPUS
========================================================= */

function Campus() {

  const leaders = [

    [
      "#1 • Hostel A",
      "8,420 XP",
      "+14%"
    ],

    [
      "#2 • Hostel B",
      "7,980 XP",
      "+11%"
    ],

    [
      "#3 • Your Group",
      "7,610 XP",
      "+18%"
    ]

  ];


  return (

    <section className="card">

      <small>
        CAMPUS FITNESS LAYER
      </small>


      <h2>
        Make improvement collective.
      </h2>


      <p>

        Reward participation and
        personal improvement—not
        only raw athletic performance.

      </p>


      <div className="stats">

        <Stat
          a="Campus Fitness Index"
          b="74"
          c="▲ 8% this month"
        />


        <Stat
          a="Active Students"
          b="68%"
          c="participating cohort"
        />


        <Stat
          a="Missions"
          b="1,842"
          c="this week"
        />

      </div>


      <h3>
        🏆 7-Day Movement Challenge
      </h3>


      {leaders.map(x => (

        <div
          className="leader"
          key={x[0]}
        >

          <b>
            {x[0]}
          </b>


          <b>
            {x[1]}
          </b>


          <span>
            {x[2]}
          </span>

        </div>

      ))}


      <div className="callout">

        <b>
          The ATHLORA difference
        </b>


        <p>

          We don't measure who
          is the fittest.

          We measure who is improving.

        </p>

      </div>

    </section>

  );

}


/* =========================================================
   START APPLICATION
========================================================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);
