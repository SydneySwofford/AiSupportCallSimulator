'use client';
import ChatBox from '../components/ChatBox';
import SessionList from '@/components/SessionsList';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 flex gap-8 p-8">
      <div className="flex-1">
        <ChatBox />
      </div>
      <div className="w-1/3">
        <SessionList />
      </div>
    </main>
  );
}
