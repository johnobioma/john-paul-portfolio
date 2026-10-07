import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  RoundedBox,
  Sparkles,
  Torus,
} from "@react-three/drei";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./index.css";

/* =========================================================
   3D ROBOT
========================================================= */

function Robot({ mood = "idle" }) {
  const group = useRef();
  const leftArm = useRef();
  const rightArm = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!group.current) return;

    group.current.position.y = Math.sin(t * 1.5) * 0.08;

    group.current.rotation.y =
      Math.sin(t * 0.45) * 0.12;

    if (leftArm.current && rightArm.current) {
      if (mood === "wave") {
        leftArm.current.rotation.z =
          Math.sin(t * 6) * 0.5 - 0.8;

        rightArm.current.rotation.z = -0.25;
      } else if (mood === "point") {
        leftArm.current.rotation.z = -1.15;
        rightArm.current.rotation.z = 0.25;
      } else if (mood === "excited") {
        leftArm.current.rotation.z =
          Math.sin(t * 5) * 0.35 - 0.6;

        rightArm.current.rotation.z =
          Math.sin(t * 5) * 0.35 + 0.6;
      } else {
        leftArm.current.rotation.z =
          Math.sin(t * 1.5) * 0.08 - 0.2;

        rightArm.current.rotation.z =
          Math.sin(t * 1.5) * 0.08 + 0.2;
      }
    }
  });

  return (
    <group ref={group}>
      {/* energy ring */}
      <Torus
        args={[1.35, 0.025, 16, 80]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#37e8ff"
          emissive="#37e8ff"
          emissiveIntensity={4}
        />
      </Torus>

      {/* body */}
      <RoundedBox
        args={[1.35, 1.55, 0.85]}
        radius={0.22}
        smoothness={5}
        position={[0, -0.35, 0]}
      >
        <meshStandardMaterial
          color="#edf6ff"
          metalness={0.5}
          roughness={0.2}
        />
      </RoundedBox>

      {/* chest */}
      <mesh position={[0, -0.25, 0.45]}>
        <circleGeometry args={[0.23, 32]} />
        <meshStandardMaterial
          color="#42eaff"
          emissive="#42eaff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* head */}
      <RoundedBox
        args={[1.55, 1.2, 1.05]}
        radius={0.25}
        smoothness={5}
        position={[0, 0.9, 0]}
      >
        <meshStandardMaterial
          color="#f8fbff"
          metalness={0.45}
          roughness={0.18}
        />
      </RoundedBox>

      {/* face screen */}
      <RoundedBox
        args={[1.15, 0.62, 0.08]}
        radius={0.12}
        smoothness={4}
        position={[0, 0.9, 0.54]}
      >
        <meshStandardMaterial
          color="#07183f"
          emissive="#07183f"
          emissiveIntensity={1}
        />
      </RoundedBox>

      {/* eyes */}
      <mesh position={[-0.28, 0.92, 0.59]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#43efff"
          emissive="#43efff"
          emissiveIntensity={7}
        />
      </mesh>

      <mesh position={[0.28, 0.92, 0.59]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#43efff"
          emissive="#43efff"
          emissiveIntensity={7}
        />
      </mesh>

      {/* antenna */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.35, 12]} />
        <meshStandardMaterial color="#b7d5ff" />
      </mesh>

      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#7b61ff"
          emissive="#7b61ff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* arms */}
      <group ref={leftArm} position={[-0.9, -0.3, 0]}>
        <RoundedBox
          args={[0.35, 1.15, 0.35]}
          radius={0.15}
          position={[0, -0.25, 0]}
        >
          <meshStandardMaterial
            color="#dcecff"
            metalness={0.4}
          />
        </RoundedBox>
      </group>

      <group ref={rightArm} position={[0.9, -0.3, 0]}>
        <RoundedBox
          args={[0.35, 1.15, 0.35]}
          radius={0.15}
          position={[0, -0.25, 0]}
        >
          <meshStandardMaterial
            color="#dcecff"
            metalness={0.4}
          />
        </RoundedBox>
      </group>
    </group>
  );
}


/* =========================================================
   ROBOT GUIDE
========================================================= */

function RobotGuide({ message, mood }) {
  return (
    <motion.div
      className="robot-guide"
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          className="robot-message"
          initial={{ opacity: 0, y: 15, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {message}
        </motion.div>
      </AnimatePresence>

      <div className="robot-canvas">
        <Canvas camera={{ position: [0, 0, 5], fov: 38 }}>
          <ambientLight intensity={1.7} />
          <directionalLight position={[3, 5, 4]} intensity={3} />
          <pointLight
            position={[0, 2, 3]}
            intensity={15}
            color="#36eaff"
          />

          <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.6}
          >
            <Robot mood={mood} />
          </Float>

          <Sparkles
            count={35}
            scale={4}
            size={2}
            speed={0.4}
          />

          <Environment preset="city" />
        </Canvas>
      </div>
    </motion.div>
  );
}


/* =========================================================
   BACKGROUND
========================================================= */

function AIBackground() {
  return (
    <div className="ai-background">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <div className="background-orb orb-three" />

      <div className="network-lines">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="network-node"
            style={{
              "--i": i,
            }}
          />
        ))}
      </div>
    </div>
  );
}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 70,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}


/* =========================================================
   FLOATING SCREENSHOT
========================================================= */

function FloatingImage({
  src,
  alt,
  className = "",
}) {
  return (
    <motion.div
      className={`floating-image ${className}`}
      whileHover={{
        y: -10,
        rotateX: 3,
        rotateY: -3,
        scale: 1.025,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 15,
      }}
    >
      <img src={src} alt={alt} />
      <div className="image-glow" />
    </motion.div>
  );
}


/* =========================================================
   SUPPLY CHAIN NETWORK
========================================================= */

function SupplyNetwork() {
  const nodes = [
    { x: 12, y: 45 },
    { x: 30, y: 22 },
    { x: 48, y: 55 },
    { x: 68, y: 25 },
    { x: 85, y: 48 },
    { x: 72, y: 78 },
    { x: 40, y: 82 },
    { x: 20, y: 72 },
  ];

  const lines = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [2, 6],
    [6, 5],
    [6, 7],
    [7, 0],
    [4, 5],
  ];

  return (
    <div className="supply-network">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            className="network-edge"
          />
        ))}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="supply-node"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              "0 0 10px rgba(50,230,255,.4)",
              "0 0 30px rgba(50,230,255,.9)",
              "0 0 10px rgba(50,230,255,.4)",
            ],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [activeSection, setActiveSection] =
    useState("hero");

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0, -100]
  );

  const sections = {
    hero: {
      message:
        "Hey, welcome! I'm your AI guide. Let me show you what Obioma has been building.",
      mood: "wave",
    },

    intro: {
      message:
        "This isn't just a portfolio. It's a look inside an AI engineer's workshop.",
      mood: "idle",
    },

    whatsapp: {
      message:
        "A business needed smarter customer handling on WhatsApp. Obioma turned that problem into an AI-powered customer service system.",
      mood: "point",
    },

    supply: {
      message:
        "Here the AI studies supply networks, finds risks, simulates disruption and recommends what to do next.",
      mood: "excited",
    },

    about: {
      message:
        "Behind the projects is a developer who enjoys turning complex problems into practical software.",
      mood: "idle",
    },

    skills: {
      message:
        "Python, FastAPI, React, AI agents, RAG, APIs and automation — these are some of the tools in the workshop.",
      mood: "excited",
    },

    contact: {
      message:
        "Found something interesting? Let's build something useful.",
      mood: "wave",
    },
  };

  useEffect(() => {
    const elements =
      document.querySelectorAll("[data-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visible[0]) {
          setActiveSection(
            visible[0].target.dataset.section
          );
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const guide =
    sections[activeSection] || sections.hero;

  return (
    <main>
      <AIBackground />

      {/* NAVIGATION */}

      <nav className="navbar">
        <a href="#hero" className="logo">
          O<span>.</span>J<span>.</span>U
        </a>

        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>

        <a
          href="mailto:kingjobioma@gmail.com"
          className="nav-button"
        >
          Let's talk
        </a>
      </nav>

      {/* ROBOT */}

      <RobotGuide
        message={guide.message}
        mood={guide.mood}
      />

      {/* HERO */}

      <section
        id="hero"
        data-section="hero"
        className="hero section"
      >
        <motion.div
          className="hero-content"
          style={{ y: heroY }}
        >
          <div className="eyebrow">
            AI SOFTWARE ENGINEER
          </div>

          <h1>
            I build software
            <br />
            <span>that thinks.</span>
          </h1>

          <p className="hero-description">
            I create practical AI-powered applications,
            intelligent automation systems and software
            that solve real-world problems.
          </p>

          <div className="hero-actions">
            <motion.a
              href="#projects"
              className="primary-button"
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{ scale: 0.97 }}
            >
              Explore my work
              <span>→</span>
            </motion.a>

            <motion.a
              href="mailto:kingjobioma@gmail.com"
              className="secondary-button"
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{ scale: 0.97 }}
            >
              Start a conversation
            </motion.a>
          </div>

          <div className="hero-tech">
            <span>Python</span>
            <span>AI Agents</span>
            <span>FastAPI</span>
            <span>React</span>
            <span>RAG</span>
          </div>
        </motion.div>

        <div className="hero-orbit">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="orbit-core">
            <span>AI</span>
          </div>
        </div>
      </section>

      {/* INTRO */}

      <section
        data-section="intro"
        className="intro section"
      >
        <Reveal>
          <div className="section-label">
            THE WORKSHOP
          </div>

          <h2>
            Where ideas become
            <span> intelligent systems.</span>
          </h2>

          <p>
            I don't build software just to demonstrate
            technology. I build systems around problems:
            customer communication, business automation,
            information retrieval, security and
            decision-making.
          </p>
        </Reveal>
      </section>

      {/* PROJECTS */}

      <section
        id="projects"
        className="projects"
      >
        {/* WHATSAPP */}

        <section
          data-section="whatsapp"
          className="case-study whatsapp-case section"
        >
          <div className="case-grid">
            <Reveal>
              <div className="case-copy">
                <div className="project-number">
                  01 / AI BUSINESS AUTOMATION
                </div>

                <h2>
                  A WhatsApp
                  <span> digital worker.</span>
                </h2>

                <p className="lead">
                  What if a business could have an AI
                  employee handling customer conversations
                  around the clock?
                </p>

                <p>
                  I built a reusable WhatsApp AI
                  customer-service and ordering system
                  using Python, FastAPI, Meta's WhatsApp
                  API and AI agents.
                </p>

                <div className="story-points">
                  <div>
                    <strong>01</strong>
                    <span>
                      Understand customer requests
                    </span>
                  </div>

                  <div>
                    <strong>02</strong>
                    <span>
                      Handle orders and customer memory
                    </span>
                  </div>

                  <div>
                    <strong>03</strong>
                    <span>
                      Keep managers informed
                    </span>
                  </div>
                </div>

                <div className="tag-row">
                  <span>Python</span>
                  <span>FastAPI</span>
                  <span>Meta API</span>
                  <span>AI Agents</span>
                  <span>Webhooks</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="project-visual">
              <FloatingImage
                src="/projects/whatsapp-bot/chat.png"
                alt="WhatsApp AI customer conversation"
                className="image-main"
              />

              <FloatingImage
                src="/projects/whatsapp-bot/order.png"
                alt="WhatsApp AI ordering"
                className="image-small image-small-one"
              />

              <FloatingImage
                src="/projects/whatsapp-bot/manager.png"
                alt="WhatsApp manager notification"
                className="image-small image-small-two"
              />
            </Reveal>
          </div>
        </section>

        {/* SUPPLY CHAIN */}

        <section
          data-section="supply"
          className="case-study supply-case section"
        >
          <div className="case-grid reverse">
            <Reveal>
              <div className="case-copy">
                <div className="project-number">
                  02 / AI INTELLIGENCE
                </div>

                <h2>
                  Making supply chains
                  <span> think ahead.</span>
                </h2>

                <p className="lead">
                  A visual intelligence platform for
                  understanding supplier risk,
                  disruptions and network dependencies.
                </p>

                <p>
                  The platform combines network analysis,
                  data visualization and AI recommendations
                  to help users understand what could go
                  wrong and what they can do about it.
                </p>

                <div className="tag-row">
                  <span>Python</span>
                  <span>Streamlit</span>
                  <span>NetworkX</span>
                  <span>Groq</span>
                  <span>Pandas</span>
                  <span>Plotly</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="supply-visual">
              <SupplyNetwork />

              <FloatingImage
                src="/projects/supply-chain/dashboard.png"
                alt="Supply chain dashboard"
                className="dashboard-image"
              />
            </Reveal>
          </div>

          <Reveal>
            <div className="feature-gallery">
              <FloatingImage
                src="/projects/supply-chain/ai-assistant.png"
                alt="AI Assistant"
              />

              <FloatingImage
                src="/projects/supply-chain/ai-recommendations.png"
                alt="AI Recommendations"
              />

              <FloatingImage
                src="/projects/supply-chain/network.png"
                alt="Supply network"
              />

              <FloatingImage
                src="/projects/supply-chain/risk-analysis.png"
                alt="Risk analysis"
              />

              <FloatingImage
                src="/projects/supply-chain/simulation.png"
                alt="Simulation"
              />

              <FloatingImage
                src="/projects/supply-chain/reports.png"
                alt="Reports"
              />
            </div>
          </Reveal>
        </section>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        data-section="about"
        className="about section"
      >
        <Reveal>
          <div className="section-label">
            BEHIND THE BUILDER
          </div>

          <div className="about-grid">
            <div>
              <h2>
                I'm interested in the space where
                <span> software meets intelligence.</span>
              </h2>
            </div>

            <div className="about-text">
              <p>
                I'm Obioma John Uzodinma, a Computer
                Science student at the Federal University
                of Technology and an AI Software Engineer
                focused on building practical systems.
              </p>

              <p>
                My work sits around AI applications,
                automation, backend engineering, agents,
                RAG and software systems that turn complex
                problems into useful tools.
              </p>

              <p>
                I enjoy learning by building — taking an
                idea, figuring out how the pieces connect,
                and turning it into something people can
                actually use.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SKILLS */}

      <section
        id="skills"
        data-section="skills"
        className="skills section"
      >
        <Reveal>
          <div className="section-label">
            THE TOOLBOX
          </div>

          <h2>
            Tools I use to
            <span> make ideas real.</span>
          </h2>
        </Reveal>

        <div className="skills-grid">
          {[
            [
              "AI Engineering",
              "AI Agents",
              "RAG",
              "LLM Applications",
              "AI Automation",
              "Prompt Engineering",
            ],
            [
              "Backend",
              "Python",
              "FastAPI",
              "REST APIs",
              "Webhooks",
              "PostgreSQL",
            ],
            [
              "Frontend",
              "React",
              "JavaScript",
              "Streamlit",
              "Data Visualization",
            ],
            [
              "Engineering",
              "Git & GitHub",
              "System Design",
              "APIs",
              "Cybersecurity",
            ],
          ].map(([title, ...items], index) => (
            <motion.div
              key={title}
              className="skill-card"
              whileHover={{
                y: -10,
                rotateX: 3,
                rotateY: index % 2 ? -3 : 3,
              }}
            >
              <span className="skill-index">
                0{index + 1}
              </span>

              <h3>{title}</h3>

              <div>
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OTHER WORK */}

      <section className="experiments section">
        <Reveal>
          <div className="section-label">
            MORE FROM THE WORKSHOP
          </div>

          <h2>
            Still building.
            <span> Still experimenting.</span>
          </h2>
        </Reveal>

        <div className="experiment-grid">
          <motion.div
            className="experiment-card"
            whileHover={{ y: -8 }}
          >
            <span>AI / RAG</span>
            <h3>Document Intelligence</h3>
            <p>
              An AI assistant designed to retrieve and
              answer questions from private documents.
            </p>
          </motion.div>

          <motion.div
            className="experiment-card"
            whileHover={{ y: -8 }}
          >
            <span>AI SECURITY</span>
            <h3>Secure AI Chatbot</h3>
            <p>
              Exploring prompt injection detection and
              safer AI interactions.
            </p>
          </motion.div>

          <motion.div
            className="experiment-card"
            whileHover={{ y: -8 }}
          >
            <span>AUTOMATION</span>
            <h3>AI Business Tools</h3>
            <p>
              Practical AI systems designed to automate
              repetitive business workflows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}

      <section
        id="contact"
        data-section="contact"
        className="contact section"
      >
        <Reveal>
          <div className="contact-box">
            <div className="section-label">
              LET'S BUILD
            </div>

            <h2>
              Have a problem worth
              <span> solving?</span>
            </h2>

            <p>
              Whether it's an AI product, automation
              system, backend application or something
              completely new — I'm interested.
            </p>

            <div className="contact-actions">
              <a
                href="mailto:kingjobioma@gmail.com"
                className="primary-button"
              >
                Email me →
              </a>

              <a
                href="https://wa.me/2349075198921"
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                WhatsApp
              </a>

              <a
                href="https://github.com/johnobioma"
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                GitHub
              </a>
            </div>

            <div className="contact-details">
              <span>
                kingjobioma@gmail.com
              </span>

              <span>
                +234 816 736 2242
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <footer>
        <strong>
          Obioma John Uzodinma
        </strong>

        <span>
          AI Software Engineer
        </span>

        <span>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}

export default App;