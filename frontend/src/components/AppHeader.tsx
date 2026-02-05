interface AppHeaderProps {
  connected: boolean;
}

export default function AppHeader({ connected }: AppHeaderProps) {
  return (
    <header className="app-header">
      <h1>Voice Translator</h1>
      <h3>Speak once. Understand instantly.</h3>

      <div className={`connection ${connected ? 'ok' : 'bad'}`}>
        <span />
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </header>
  );
}
