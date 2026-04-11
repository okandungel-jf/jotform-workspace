export function SettingsPage() {
  return (
    <div className="settings-page">
      <aside className="settings-page__nav">
        <ul>
          <li className="active">APP SETTINGS</li>
          <li>APP NAME &amp; ICON</li>
          <li>SPLASH SCREEN</li>
          <li>PUSH NOTIFICATIONS</li>
          <li>AI CHATBOT</li>
        </ul>
      </aside>
      <main className="settings-page__content">
        <h1>App Settings</h1>
        <p>App status and properties.</p>
      </main>
    </div>
  )
}
