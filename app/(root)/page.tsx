import Hero from '@/shared/components/atoms/hero';

export default function Home() {
  return (
    <>
      <Hero 
        title="DBDiagram Next"
        subtitle="Create collaborative database diagrams with real-time collaboration, powered by Mermaid and Socket.io"
        ctaText="Start Modeling"
        ctaHref="/projects"
      />
    </>
  );
}
