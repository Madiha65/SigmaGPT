import "dotenv/config";

const getAIResponse = async (message) => {
    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.log("AI API Error:", data);
        throw new Error(
            data.error?.message || "AI API request failed"
        );
    }

    return data.choices[0].message.content;
};

export default getAIResponse;