'use client';
import { useState } from 'react';

type Message = {
  sender: 'user' | 'ai';
  text: string;
  feedback?: 'up' | 'down';
  scores?:{
    empathy: number;
    clarity: number;
    helpfulness: number;
  };
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  //default on screen start
const [persona, setPersona] = useState('empathetic');
const [scenario, setScenario]= useState('login issue');
const [sessionId, setSessionId] = useState<string|null>(null);


const personaOptions=['Empathetic', 'Concise', 'Witty'];
const scenariooptions= ['Login Issue', 'Billing Problem', 'Technical Error', 'Advice'];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          persona: persona,
          scenario: scenario,
          sessionId: sessionId
        }),
      });

      const data = await res.json();
      if(!sessionId &&data.session_id)
      {
        setSessionId(data.session_id);
      }
      const aiMessage: Message = { sender: 'ai', text: data.reply, scores: data.scores };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error:', err);
    }

    

    setInput('');
  };

  const rateFeedback= async(index: number, feedback: 'up' | 'down')=>{
    if (!sessionId) return;

    try{
      await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          session_id: sessionId,
          message_index: index,
          feedback: feedback,
        })
      });
      setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, feedback } : msg
      )
    );
  } catch(err){
    console.error('Feedback failed ', err);
  }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded shadow mt-10">
      <div> 
      <label className='block text-sm font-medium mb-1'>Persona</label>
      <select 
      value={persona}
      onChange={(e)=> setPersona(e.target.value)}
      className='border rounded px-2 py-1 mb-1'>{personaOptions.map((p)=>(
        <option key={p} value={p}>{p}</option>))}</select>
      </div>
      <div>
        <label className="block text-sm font medium mb-1">Scenario</label>
        <select
        value={scenario}
        onChange={(e)=> setScenario(e.target.value)}
        className='border rounded px-2 py-1'>
          {scenariooptions.map((s)=>(
            <option key={s} value= {s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 space-y-2">
        {messages.map((msg, i) => (
  <div
    key={i}
    className={`p-2 rounded-md w-fit max-w-xs ${
      msg.sender === 'user'
        ? 'bg-blue-100 self-end ml-auto'
        : 'bg-gray-200 self-start mr-auto'
    }`}
  >
    <span className="text-sm block mb-1">{msg.text}</span>

    {/* Scores */}
    {msg.sender === 'ai' && msg.scores && (
      <div className="felx flex-wrap mt-2 -m-1">
        {Object.entries(msg.scores).map(([trait, score]) => (
          <span key={trait}
            className="m-1 text-xs rounded-full px-2 py-1 bg-green-100 text-black-800 font-semibold">
              {trait.charAt(0).toUpperCase() + trait.slice(1)}: {score}/5</span>
        ))}
      </div>
    )}

    {/* Feedback */}
    {msg.sender === 'ai' && (
      <div className="mt-2 flex gap-2 text-sm">
        <button
          className={`${
            msg.feedback === 'up'
              ? 'text-green-600 underline'
              : 'text-gray-500 hover:underline'
          }`}
          onClick={() => rateFeedback(i, 'up')}
          disabled={!!msg.feedback}
        >
          👍
        </button>
        <button
          className={`${
            msg.feedback === 'down'
              ? 'text-red-600 underline'
              : 'text-gray-500 hover:underline'
          }`}
          onClick={() => rateFeedback(i, 'down')}
          disabled={!!msg.feedback}
        >
          👎
        </button>
      </div>
    )}
  </div>
))}
      </div>

      <div className="flex mt-4">
        <input
          className="flex-1 border border-gray-300 rounded-l px-4 py-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
