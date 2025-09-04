import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, 
  FaSmile, FaPaperclip, FaEllipsisH, FaCheckDouble,
  FaClock, FaPhone, FaEnvelope, FaCalendarAlt
} from 'react-icons/fa';
import './LiveChat.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
  type?: 'text' | 'quick-reply' | 'action';
  options?: string[];
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
  icon?: string;
}

const quickReplies: QuickReply[] = [
  { id: 'pricing', text: 'Pricing Info', action: 'pricing', icon: 'money' },
  { id: 'services', text: 'Our Services', action: 'services', icon: 'rocket' },
  { id: 'contact', text: '📞 Contact Sales', action: 'contact' },
  { id: 'support', text: '🛠️ Get Support', action: 'support' },
  { id: 'demo', text: '📅 Schedule Demo', action: 'demo' }
];

const botResponses: { [key: string]: string } = {
  greeting: "Hello! 👋 Welcome to Panchroma! I'm your AI assistant. How can I help you today?",
  pricing: "Our packages start at $2,500 for small businesses. We offer three main packages:\n\n• Starter ($2,500): Perfect for small businesses\n• Professional ($4,500): Ideal for growing companies\n• Enterprise ($7,500): Complete solution for large organizations\n\nWould you like to use our pricing calculator for a custom quote?",
  services: "We offer comprehensive web development services:\n\n• Custom Design & UI/UX\n• Full-Stack Development\n• Responsive Web Apps\n• E-Commerce Solutions\n• SEO Optimization\n• Analytics Integration\n\nWhich service interests you most?",
  contact: "Great! You can reach our sales team:\n\n📧 Email: sales@panchroma.com\n📞 Phone: 1-800-PANCHROMA\n💬 Or continue chatting here!\n\nWould you prefer to schedule a call?",
  support: "I'm here to help! For immediate support:\n\n• Type your question here\n• Email: support@panchroma.com\n• Check our FAQ section\n• Schedule a support call\n\nWhat issue can I help you with?",
  demo: "Excellent choice! I can help you schedule a demo.\n\nOur demos typically last 30 minutes and cover:\n• Your specific needs\n• Our solutions\n• Live examples\n• Q&A session\n\nWhen would work best for you?",
  default: "I understand you're interested in learning more. Let me connect you with the right information. You can also choose from the quick options below or type your specific question."
};

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: botResponses.greeting,
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const unread = messages.filter(m => m.sender === 'bot' && m.status !== 'read').length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
        status: 'sending'
      };

      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      // Update message status
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
      }, 500);

      // Bot typing indicator
      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      // Bot response
      setTimeout(() => {
        setIsTyping(false);
        const response = generateBotResponse(inputValue);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: response,
          sender: 'bot',
          timestamp: new Date(),
          status: isOpen ? 'read' : 'sent'
        }]);
      }, 2500);
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
      return botResponses.pricing;
    }
    if (input.includes('service') || input.includes('what do you do')) {
      return botResponses.services;
    }
    if (input.includes('contact') || input.includes('call') || input.includes('email')) {
      return botResponses.contact;
    }
    if (input.includes('support') || input.includes('help') || input.includes('issue')) {
      return botResponses.support;
    }
    if (input.includes('demo') || input.includes('schedule') || input.includes('meeting')) {
      return botResponses.demo;
    }
    if (input.includes('thank')) {
      return "You're welcome! 😊 Is there anything else I can help you with today?";
    }
    
    return botResponses.default;
  };

  const handleQuickReply = (action: string) => {
    const quickReplyText = quickReplies.find(qr => qr.action === action)?.text || action;
    setInputValue(quickReplyText);
    
    // Auto-send the quick reply
    const newMessage: Message = {
      id: messages.length + 1,
      text: quickReplyText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      setIsTyping(true);
    }, 500);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botResponses[action] || botResponses.default,
        sender: 'bot',
        timestamp: new Date(),
        status: 'read'
      }]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmoji(false);
  };

  const reactions = ['smile', 'thumbs-up', 'heart', 'party', 'rocket', 'lightbulb', 'star', 'pray', 'cool', 'handshake'];
  
  const emojis = ['😊', '👍', '❤️', '🎉', '🚀', '💡', '⭐', '🙏', '😎', '🤝', '👋', '💯', '🔥', '✨', '💰', '📞', '📧', '📅'];

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className={`chat-widget ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <FaRobot />
                  <span className="status-dot online"></span>
                </div>
                <div className="chat-header-text">
                  <h4>Panchroma Assistant</h4>
                  <span className="chat-status">
                    <span className="status-indicator"></span>
                    Online - Typically replies instantly
                  </span>
                </div>
              </div>
              <div className="chat-header-actions">
                <button 
                  className="chat-action-btn"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? '▲' : '▼'}
                </button>
                <button 
                  className="chat-action-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="chat-messages">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      className={`message ${message.sender}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="message-avatar">
                        {message.sender === 'bot' ? <FaRobot /> : <FaUser />}
                      </div>
                      <div className="message-content">
                        <div className="message-bubble">
                          {message.text}
                        </div>
                        <div className="message-meta">
                          <span className="message-time">{formatTime(message.timestamp)}</span>
                          {message.sender === 'user' && message.status && (
                            <span className="message-status">
                              {message.status === 'sent' && <FaCheckDouble />}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="message bot">
                      <div className="message-avatar">
                        <FaRobot />
                      </div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                <div className="quick-replies">
                  {quickReplies.map(reply => (
                    <button
                      key={reply.id}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(reply.action)}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>

                <div className="chat-input-container">
                  <div className="chat-input-wrapper">
                    <button 
                      className="input-action-btn"
                      onClick={() => setShowEmoji(!showEmoji)}
                    >
                      <FaSmile />
                    </button>
                    
                    <input
                      type="text"
                      className="chat-input"
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    
                    <button 
                      className="input-action-btn"
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                  
                  {showEmoji && (
                    <div className="emoji-picker">
                      {emojis.map(emoji => (
                        <button
                          key={emoji}
                          className="emoji-btn"
                          onClick={() => addEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`chat-trigger ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaComments />
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
        <div className="chat-trigger-pulse"></div>
      </motion.button>

      {!isOpen && (
        <motion.div 
          className="chat-prompt"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <button 
            className="prompt-close"
            onClick={() => {
              const prompt = document.querySelector('.chat-prompt');
              if (prompt) prompt.classList.add('hidden');
            }}
          >
            ×
          </button>
          <p>👋 Hi! Need help with your project?</p>
          <button 
            className="prompt-cta"
            onClick={() => setIsOpen(true)}
          >
            Chat with us
          </button>
        </motion.div>
      )}
    </>
  );
};

export default LiveChat;