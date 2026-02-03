import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import confetti from "canvas-confetti";
import "./App.css";

function App() {
  // pages: question | yes | memories | message
  const [page, setPage] = useState("question");

  const [noPosition, setNoPosition] = useState({ top: "60%", left: "55%" });
  const [noMsg, setNoMsg] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // 💌 message states
  const [answer, setAnswer] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const images = Object.values(
    import.meta.glob("./assets/memories/*.{png,jpg,jpeg}", {
      eager: true,
      import: "default",
    })
  );

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (page !== "memories") return;
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const messages = [
    "Nice try 😏",
    "I know you’ll say YES ❤️",
    "No is not allowed 😜",
    "You don’t have the dare to say no 😉",
    "Stop playing 😂",
  ];

  const moveNoButton = () => {
    const top = Math.random() * 70 + "%";
    const left = Math.random() * 70 + "%";
    setNoPosition({ top, left });
    setNoMsg(messages[Math.floor(Math.random() * messages.length)]);
  };

  // 📧 SEND EMAIL + 🎊 CONFETTI
  const sendEmail = () => {
    if (!answer.trim() || sent) return;

    setSending(true);

    emailjs
      .send(
        "service_auzh39d",        // Service ID
        "template_5vn4owe",       // Template ID
        {
          name: "Monu",
          message: answer,
          time: new Date().toLocaleString(),
        },
        "J9RmqQ6v35qOhWctZ"        // Public Key
      )
      .then(() => {
        // 🎊 CONFETTI CELEBRATION
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.6 },
        });

        setSent(true);
        setAnswer("");
        setSending(false);
      })
      .catch(() => {
        setSending(false);
      });
  };

  return (
    <div className="container">

      {/* 💘 QUESTION PAGE */}
      {page === "question" && (
        <div className="modal">
          <h1>💘 Will you be my Valentine? 💘</h1>

          <div className="buttons">
            <button className="yes" onClick={() => setPage("yes")}>
              YES 💖
            </button>

            <button
              className="no"
              style={{ top: noPosition.top, left: noPosition.left }}
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              onTouchStart={moveNoButton}
            >
              NO 🙈
            </button>
          </div>

          {noMsg && <p className="no-msg">{noMsg}</p>}
        </div>
      )}

      {/* 🥰 YES PAGE */}
      {page === "yes" && (
        <div className="yes-screen">
          <h1>🥰 I knew it! 🥰</h1>
          <p>
            Of course you said YES ❤️ <br />
            You were, you are, and you’ll always be my Valentine 💘
          </p>
          <div className="hearts">💖💖💖💖💖</div>

          <button className="memory-btn" onClick={() => setPage("memories")}>
            Let’s explore some beautiful memories 💕
          </button>
        </div>
      )}

      {/* 📸 MEMORIES PAGE */}
      {page === "memories" && (
        <div className="memories-page">
          <h1>📸 Our Beautiful Memories 💕</h1>

          <div className="carousel-frame">
            <button className="nav left" onClick={prevImage}>‹</button>
            <img
              src={images[currentIndex]}
              alt={`memory ${currentIndex + 1}`}
              className="carousel-img"
              onClick={nextImage}
            />
            <button className="nav right" onClick={nextImage}>›</button>
          </div>

          <button
            className="memory-btn"
            onClick={() => setPage("message")}
          >
            One last thing 💕
          </button>

          <button className="back-btn" onClick={() => setPage("yes")}>
            ⬅ Back to Love ❤️
          </button>
        </div>
      )}

      {/* ✉️ MESSAGE PAGE */}
      {page === "message" && (
        <div className="message-page">
          <h1>💌 One last thing</h1>

          {!sent ? (
            <>
              <p className="question-text">
                Valentine Message..? 💕
              </p>

              <textarea
                placeholder="Type from your heart 💖"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button
                className="submit-btn"
                onClick={sendEmail}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send 💌"}
              </button>
            </>
          ) : (
            <p className="thank-you">
              Your message reached me 🥰
            </p>
          )}

          <button className="back-btn" onClick={() => setPage("memories")}>
            ⬅ Back to Memories 📸
          </button>
        </div>
      )}

    </div>
  );
}

export default App;
