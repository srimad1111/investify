import { AnimatedAIChat } from '../components/ui/animated-ai-chat';

export function AIChatPage() {
  return (
    <div className="flex-1 w-full bg-background overflow-hidden relative" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <AnimatedAIChat />
    </div>
  );
}
