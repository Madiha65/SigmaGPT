import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import ThemeContext from "./context/ThemeContext";


function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;
    const { theme, toggleTheme } = useContext(ThemeContext);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onstart = () => {
            console.log("Listening...");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            console.log("You said:", transcript);

            setPrompt(transcript);

            // Send after state updates
            setTimeout(() => {
                getReply(transcript);
            }, 200);
        };

        recognition.onerror = (event) => {
            console.log(event.error);
        };
    };
    // ===========================
    // Text to Speech
    // ===========================
    const speak = (text) => {
        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
    };

    // ===========================
    // Send Message
    // ===========================
    const getReply = async (voiceMessage = null) => {

        const message = voiceMessage || prompt;

        if (!message.trim()) return;

        setLoading(true);
        setNewChat(false);

        try {

            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message,
                    threadId: currThreadId
                })
            });

            const res = await response.json();

            setReply(res.reply);

            // AI speaks reply
            speak(res.reply);

            // Save chat
            setPrevChats(prev => [
                ...prev,
                {
                    role: "user",
                    content: message
                },
                {
                    role: "assistant",
                    content: res.reply
                }
            ]);

            setPrompt("");

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };



    // ===========================
    // Save Chat History
    // ===========================
    useEffect(() => {

        if (prompt && reply) {

            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

        setPrompt("");

    }, [reply]);

    // ===========================
    // Profile Dropdown
    // ===========================
    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    return (
        <div className="chatWindow">

            <div className="navbar">
                <span>
                    SigmaGPT <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div
                    className="userIconDiv"
                    onClick={handleProfileClick}
                >
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown">

                    <div
                        className="dropDownItem"
                        onClick={toggleTheme}
                    >
                        <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"
                            }`}></i>

                        &nbsp;

                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>
                        &nbsp; Settings
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        &nbsp; Upgrade Plan
                    </div>

                    <div
                        className="dropDownItem"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        &nbsp; Logout
                    </div>


                </div>
            )}

            <Chat />

            <ScaleLoader color="#ffffff" loading={loading} />

            <div className="chatInput">

                <div className="inputBox">

                    <input
                        placeholder="Ask anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                getReply();
                            }
                        }}
                    />

                    <div id="voice" onClick={startListening}>
                        <i className="fa-solid fa-microphone"></i>
                    </div>

                    <div id="submit" onClick={() => getReply()}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>

                </div>



                <p className="info">
                    SigmaGPT can make mistakes. Check important information before relying on it.
                </p>

            </div>

        </div>
    );
}

export default ChatWindow;