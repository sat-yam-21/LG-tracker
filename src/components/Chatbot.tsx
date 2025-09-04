import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { MessageCircle } from "lucide-react";

// --- Simulated Product Database ---
// In a real application, this data would be sourced from a dedicated database or API.
const productDatabase = {
  refrigerators: [
    { id: 1, name: "LG 190L Single Door Refrigerator", price: 17000, warranty: "1 year comprehensive, 10 years on compressor" },
    { id: 2, name: "LG 260L Double Door Refrigerator", price: 28000, warranty: "1 year comprehensive, 10 years on compressor" },
    { id: 3, name: "LG 360L Double Door Refrigerator", price: 45000, warranty: "1 year comprehensive, 10 years on compressor" },
    { id: 4, name: "LG 687L Side-by-Side Refrigerator", price: 85000, warranty: "1 year comprehensive, 10 years on compressor" },
  ],
  tvs: [
    { id: 5, name: "LG 32-inch HD LED TV", price: 16000, warranty: "1 year comprehensive" },
    { id: 6, name: "LG 43-inch 4K UHD NanoCell TV", price: 42000, warranty: "1 year comprehensive" },
    { id: 7, name: "LG 55-inch 4K OLED TV", price: 120000, warranty: "1 year comprehensive, 3 years on panel" },
  ],
  // ... other product categories would be here
};


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = { role: "user" as const, content: message };
    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");

    // Show a typing indicator
    setChatHistory(prev => [...prev, { role: "bot", content: "Thinking..." }]);

    const botResponse = await getBotResponse(currentMessage);

    // Replace "Thinking..." with the actual response
    setChatHistory(prev => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = botResponse;
      return newHistory;
    });
  };

  // --- AI-Powered Response Generation ---
  // This function simulates a call to a generative AI model like Gemini or Vertex AI.
  const getBotResponse = async (userMessage: string): Promise<{ role: "bot"; content: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI thinking time
    const lowerCaseMessage = userMessage.toLowerCase();

    // --- Simulated Intent & Entity Recognition ---
    // A real AI would perform Natural Language Understanding (NLU) here.
    const entities = {
        product: lowerCaseMessage.includes("refrigerator") ? "refrigerators" : lowerCaseMessage.includes("tv") ? "tvs" : null,
        price_max: parseInt((lowerCaseMessage.match(/under (\d+)/) || [])[1] || '0', 10),
        isAskingForWebsite: lowerCaseMessage.includes("website") || lowerCaseMessage.includes("link"),
        isGreeting: ["hi", "hello", "hey"].includes(lowerCaseMessage)
    };

    // --- Response Logic based on Critical Thinking ---

    if (entities.isGreeting) {
        return { role: "bot", content: "Hello! How can I help you with LG products today?" };
    }

    if (entities.isAskingForWebsite) {
        return { role: "bot", content: "The official LG website is at www.lg.com. For support, you can visit www.lg.com/support." };
    }

    if (entities.product && entities.price_max) {
        const results = (productDatabase[entities.product] || []).filter(p => p.price < entities.price_max);
        if (results.length > 0) {
            let response = `I found ${results.length} ${entities.product} under ₹${entities.price_max}:\n`;
            response += results.map(p => `• ${p.name} (Price: ₹${p.price})`).join('\n');
            return { role: "bot", content: response };
        }
        return { role: "bot", content: `I couldn't find any ${entities.product} under ₹${entities.price_max}. Would you like to see models in a different price range?` };
    }

    if (entities.product) {
        const results = productDatabase[entities.product] || [];
        let response = `Here is some information on LG ${entities.product}:\n`;
        response += results.map(p => `• ${p.name} (Warranty: ${p.warranty})`).join('\n');
        return { role: "bot", content: response };
    }

    return { role: "bot", content: "I'm an AI assistant for LG products. You can ask me about our product ranges, prices, and warranties. How can I help?" };
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-96 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>LG Support Chat</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <span className="sr-only">Close</span>X
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col h-96">
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 bg-gray-100 rounded-md space-y-3 whitespace-pre-wrap">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex items-end ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs shadow-md ${
                      chat.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : chat.content === "Thinking..." ? "bg-muted animate-pulse" : "bg-muted"
                    }`}
                  >
                    {chat.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about LG products..."
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} className="ml-2">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="shadow-lg">
          <MessageCircle className="mr-2 h-5 w-5" />
          Start Chat
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
