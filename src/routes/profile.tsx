import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const [name, setName] = useState("Shravan Kumar");
  const [saved, setSaved] = useState(false);
  return <main className="page-wrap narrow-page"><div className="page-intro"><p className="eyebrow">Your account</p><h1 className="page-title">Profile</h1><p className="page-subtitle">This helps the mentor tailor advice to your goals.</p></div><section className="profile-card surface-panel"><div className="profile-avatar">S</div><div><h2>{name}</h2><p>Student account · B.Tech Computer Science</p></div></section><section className="form-panel surface-panel"><label>Full name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Degree program<select defaultValue="B.Tech CSE"><option>B.Tech CSE</option><option>B.Tech IT</option><option>BCA</option><option>MCA</option></select></label><label>Career goal<select defaultValue="Full-Stack Developer"><option>Full-Stack Developer</option><option>ML Engineer</option><option>Data Scientist</option><option>Frontend Developer</option></select></label></section><button className="button-primary" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2400); }}>{saved ? "Profile updated" : "Update profile"}</button></main>;
}
