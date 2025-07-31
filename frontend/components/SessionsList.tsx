'use client';
import { useEffect, useState } from "react";
//test comment test test again
type Message={
    sender: string;
    text: string;
};

type Session={
    id:string;
    persona: string;
    scenario: string;
    messages: Message[];
};

export default function SessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
  fetch('http://localhost:8000/sessions')
    .then((res) => res.json())
    .then((data) => {
      console.log('Fetched sessions:', data);
      setSessions(data);
    });
}, []);


  return (
    <div className="p-4 border rounded shadow max-h-[30rem] overflow-y-auto bg-white">
      <h2 className="text-lg font-bold mb-2">Saved Sessions</h2>
      {sessions.map((session) => (
        <div key={session.id} className="mb-4 p-2 border rounded">
          <div className="text-sm font-medium text-gray-700">
            {session.persona} | {session.scenario}
          </div>
          <div className="text-xs text-gray-500">ID: {session.id.slice(0, 8)}...</div>
          <div className="mt-1 text-sm text-gray-700">
            {session.messages.length} messages
          </div>
        </div>
      ))}
    </div>
  );
}