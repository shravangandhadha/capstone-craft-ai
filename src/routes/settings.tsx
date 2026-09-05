import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  return <main className="page-wrap narrow-page"><div className="page-intro"><p className="eyebrow">Workspace preferences</p><h1 className="page-title">Settings</h1><p className="page-subtitle">Keep your mentor workspace focused and personal.</p></div><section className="settings-list"><div className="settings-row"><div><strong>Email updates</strong><span>Receive reminders about project milestones.</span></div><button className={emailUpdates ? "toggle on" : "toggle"} onClick={() => setEmailUpdates(!emailUpdates)} aria-label="Toggle email updates"><span /></button></div><div className="settings-row"><div><strong>Default project duration</strong><span>Used when starting a new mentor session.</span></div><select defaultValue="10 weeks"><option>8 weeks</option><option>10 weeks</option><option>12 weeks</option><option>16 weeks</option></select></div><div className="settings-row"><div><strong>AI response style</strong><span>Choose how detailed your mentor feedback feels.</span></div><select defaultValue="Practical"><option>Practical</option><option>Detailed</option><option>Concise</option></select></div></section><button className="button-primary" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2400); }}>{saved ? "Saved" : "Save changes"}</button>{saved && <span className="save-note">Your preferences are saved.</span>}</main>;
}
