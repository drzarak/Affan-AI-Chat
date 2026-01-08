import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Menu, X, Phone, MapPin, MessageCircle, Calendar, CreditCard, Clock, Shield, Award, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import doctorAvatar from "@assets/generated_images/dr._affan_qaiser_avatar_portrait.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: `Assalam o Alaikum! I'm Dr. Muhammad Affan Qaiser's AI assistant. Welcome to Liver Tower Lahore – Pakistan's state-of-the-art gastroenterology and hepatology center.

I'm here to help you with general health and wellness questions, guide you through our services, and assist you in booking an appointment with Dr. Affan Qaiser.

How can I assist you today? Feel free to ask about liver health, digestive wellness, or our consultation services.`,
    timestamp: new Date(),
  },
];

const mockResponses: Record<string, string> = {
  default: `Thank you for your question. While I can provide general health information, for a proper medical evaluation and personalized advice, I strongly recommend scheduling a consultation with Dr. Affan Qaiser at Liver Tower Lahore.

Would you like me to guide you through our appointment booking process?`,
  
  appointment: `I'd be happy to help you book an appointment! Here's our simple process:

**📅 Booking Steps:**
1. Contact us via WhatsApp at **+92 300 1234567**
2. Share your preferred date and time
3. Complete payment via bank transfer
4. Receive your confirmed appointment details

**🏦 Bank Details:**
Bank: HBL (Habib Bank Limited)
Account Title: Liver Tower Medical Center
Account Number: 1234-5678-9012-3456

**📍 Clinic Location:**
Liver Tower, 45 Main Boulevard
Gulberg III, Lahore, Pakistan

Our team responds within 2-4 hours during business hours (9 AM - 6 PM PKT).`,

  services: `At Liver Tower Lahore, we offer comprehensive care in:

**🔬 Gastroenterology:**
• Endoscopy & colonoscopy
• GERD & acid reflux treatment
• IBS & digestive disorders
• Chronic abdominal pain evaluation

**🏥 Hepatology:**
• Hepatitis B & C management
• Fatty liver disease treatment
• Cirrhosis care
• Liver transplant evaluation & follow-up

**💻 Online Consultations:**
Dr. Affan Qaiser offers video consultations for patients across Pakistan and internationally.

Would you like to schedule an appointment?`,

  doctor: `**Dr. Muhammad Affan Qaiser** is a distinguished gastroenterologist and hepatologist with extensive expertise in liver diseases and digestive health.

**Qualifications:**
• MBBS – King Edward Medical University
• FCPS (Medicine) – College of Physicians & Surgeons Pakistan
• Fellowship in Hepatology – International Training

**Expertise:**
• Liver transplant care
• Chronic hepatitis management
• Complex GI disorders
• Preventive liver health

Dr. Affan is known for his compassionate approach and has helped thousands of patients across Pakistan. He regularly appears in media to raise awareness about liver health.

Ready to consult with Dr. Affan? I can guide you through the booking process.`,

  liver: `Liver health is crucial for your overall wellbeing. Here are some general tips:

**🥗 Healthy Lifestyle:**
• Maintain a balanced diet low in processed foods
• Limit alcohol consumption
• Stay physically active
• Maintain a healthy weight

**⚠️ Warning Signs to Watch:**
• Persistent fatigue
• Yellowing of skin or eyes
• Abdominal swelling
• Dark urine or pale stools

**Important:** These are general guidelines only. If you're experiencing any symptoms or have concerns about your liver health, please schedule a consultation with Dr. Affan Qaiser for proper evaluation.

Shall I help you book an appointment?`,

  hepatitis: `Hepatitis is inflammation of the liver, often caused by viral infections. Here's general information:

**Types:**
• Hepatitis A – Usually from contaminated food/water
• Hepatitis B & C – Blood-borne, can become chronic
• Hepatitis D & E – Less common variants

**General Prevention:**
• Vaccination (available for Hep A & B)
• Safe practices for blood exposure
• Clean water and food hygiene

**⚕️ Important Medical Note:**
I cannot provide diagnosis or treatment advice. Hepatitis management requires proper medical evaluation, blood tests, and personalized treatment plans.

Dr. Affan Qaiser specializes in hepatitis treatment with excellent outcomes. Would you like to schedule a consultation?`,

  location: `**📍 Liver Tower Lahore**
45 Main Boulevard, Gulberg III
Lahore, Punjab, Pakistan

**📞 Contact:**
• Phone: +92 42 3571 2345
• WhatsApp: +92 300 1234567
• Email: info@livertowerlahore.pk

**🕐 Clinic Hours:**
Monday - Saturday: 9:00 AM - 6:00 PM
Sunday: Closed (Emergency consultations available)

**🚗 Directions:**
Located on Main Boulevard near Hussain Chowk, easily accessible from all parts of Lahore. Parking available.

Need help booking an appointment?`,

  cost: `**Consultation Fees:**

**In-Person Consultation:**
• First Visit: PKR 3,000
• Follow-up (within 2 weeks): PKR 2,000

**Online Video Consultation:**
• Standard Session: PKR 2,500
• International Patients: $50 USD

**Payment Methods:**
• Bank Transfer (HBL)
• JazzCash / Easypaisa
• Cash (in-person only)

**Note:** Diagnostic tests and procedures are charged separately. Our team will provide a detailed cost estimate during booking.

Would you like to proceed with booking?`,
};

function getAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes("appointment") || message.includes("book") || message.includes("schedule") || message.includes("visit")) {
    return mockResponses.appointment;
  }
  if (message.includes("service") || message.includes("treatment") || message.includes("offer") || message.includes("provide")) {
    return mockResponses.services;
  }
  if (message.includes("doctor") || message.includes("dr.") || message.includes("affan") || message.includes("qaiser") || message.includes("qualification") || message.includes("experience")) {
    return mockResponses.doctor;
  }
  if (message.includes("liver") || message.includes("fatty") || message.includes("cirrhosis")) {
    return mockResponses.liver;
  }
  if (message.includes("hepatitis") || message.includes("hep b") || message.includes("hep c") || message.includes("jaundice")) {
    return mockResponses.hepatitis;
  }
  if (message.includes("location") || message.includes("address") || message.includes("where") || message.includes("direction") || message.includes("find")) {
    return mockResponses.location;
  }
  if (message.includes("cost") || message.includes("fee") || message.includes("price") || message.includes("charge") || message.includes("payment")) {
    return mockResponses.cost;
  }
  
  return mockResponses.default;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    "How do I book an appointment?",
    "What services do you offer?",
    "Tell me about Dr. Affan Qaiser",
    "What are consultation fees?",
  ];

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50 md:hidden"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden md:flex w-80 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={doctorAvatar} alt="Dr. Muhammad Affan Qaiser" />
            <AvatarFallback className="bg-primary text-primary-foreground">AQ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate" data-testid="text-doctor-name">
              Dr. Affan Qaiser AI
            </h1>
            <p className="text-xs text-muted-foreground">Liver Tower Lahore</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </header>

        <ScrollArea className="flex-1 chat-gradient">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3 message-fade-in">
                <Avatar className="h-8 w-8 border border-primary/20 flex-shrink-0">
                  <AvatarImage src={doctorAvatar} alt="Dr. Affan" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">AQ</AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-border">
                  <div className="typing-indicator flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(question)}
                    className="px-3 py-2 text-sm bg-white border border-border rounded-full hover:bg-accent hover:border-primary/30 transition-colors"
                    data-testid={`button-suggestion-${i}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-border bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-muted/50 rounded-2xl border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your health question..."
                rows={1}
                className="flex-1 bg-transparent px-4 py-3 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground min-h-[48px] max-h-32"
                style={{ height: "48px" }}
                data-testid="input-message"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="m-1.5 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              This AI provides general information only. For medical diagnosis and treatment, please consult Dr. Affan Qaiser directly.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-primary/20 flex-shrink-0">
          <AvatarImage src={doctorAvatar} alt="Dr. Affan" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">AQ</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
            : "bg-white border border-border rounded-2xl rounded-tl-sm shadow-sm"
        } px-4 py-3`}
      >
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "" : "prose prose-sm max-w-none"}`}>
          {message.content.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p key={i} className="font-semibold mt-2 first:mt-0">
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            }
            if (line.startsWith("• ")) {
              return (
                <p key={i} className="ml-2">
                  {line}
                </p>
              );
            }
            return <p key={i} className={line === "" ? "h-2" : ""}>{line}</p>;
          })}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-secondary-foreground">You</span>
        </div>
      )}
    </motion.div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">Liver Tower</h2>
              <p className="text-xs text-muted-foreground">Lahore, Pakistan</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-4 space-y-6">
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto border-4 border-primary/20 shadow-lg">
              <AvatarImage src={doctorAvatar} alt="Dr. Muhammad Affan Qaiser" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">AQ</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mt-3 text-sidebar-foreground">Dr. Muhammad Affan Qaiser</h3>
            <p className="text-sm text-muted-foreground">Gastroenterologist & Hepatologist</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-xs text-primary font-medium">FCPS, Fellowship Hepatology</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </h4>
            
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 transition-colors group"
              data-testid="link-whatsapp"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">WhatsApp</p>
                <p className="text-xs text-green-600">+92 300 1234567</p>
              </div>
            </a>

            <a
              href="tel:+924235712345"
              className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent hover:bg-accent transition-colors"
              data-testid="link-phone"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Clinic Phone</p>
                <p className="text-xs text-muted-foreground">+92 42 3571 2345</p>
              </div>
            </a>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sidebar-accent">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Location</p>
                <p className="text-xs text-muted-foreground">45 Main Boulevard, Gulberg III, Lahore</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sidebar-accent">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Clinic Hours</p>
                <p className="text-xs text-muted-foreground">Mon - Sat: 9 AM - 6 PM</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Book Appointment
            </h4>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">How to Book</span>
              </div>
              <ol className="text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>Contact via WhatsApp with preferred date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Complete payment via bank transfer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Receive confirmation & appointment details</span>
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-sidebar-accent border border-sidebar-border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Bank Details</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Bank:</span> HBL</p>
                <p><span className="font-medium">Title:</span> Liver Tower Medical</p>
                <p><span className="font-medium">Account:</span> 1234-5678-9012-3456</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Your privacy is protected</span>
        </div>
      </div>
    </div>
  );
}
