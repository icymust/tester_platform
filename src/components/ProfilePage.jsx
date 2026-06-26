import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  UserPlus,
} from "lucide-react";
import React from "react";
import { initials } from "../lib/platform.js";

export function ProfilePage({ onBack, profile }) {
  if (!profile) {
    return (
      <main className="profile-page">
        <section className="profile-shell">
          <ProfileTopbar onBack={onBack} />
          <div className="profile-card">
            <span className="step-pill">Profile</span>
            <h1>Profile not found</h1>
            <p className="muted">This profile is not available in local data.</p>
          </div>
        </section>
      </main>
    );
  }

  if (profile.role !== "tester") {
    return (
      <main className="profile-page">
        <section className="profile-shell">
          <ProfileTopbar onBack={onBack} />
          <article className="profile-card">
            <div className="profile-hero-main">
              <span className="avatar large">{initials(profile.name || "Client")}</span>
              <div>
                <h1>{profile.name || "Client"}</h1>
                <p>{profile.company || "Client account"}</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    );
  }

  const skills = splitList(profile.skills, [
    "Web Testing",
    "Mobile Testing",
    "API Testing",
    "Bug Reporting",
  ]);

  return (
    <main className="profile-page">
      <section className="profile-shell modern-profile">
        <ProfileTopbar onBack={onBack} />

        <article className="profile-modern-card">
          <section className="profile-hero-panel">
            <div className="profile-hero-main">
              <div className="profile-avatar-card">
                <span className="avatar xl">{initials(profile.name || "QA")}</span>
                <span className="online-dot" />
              </div>
              <div>
                <div className="profile-name-row">
                  <h1>{profile.name || "QA Tester"}</h1>
                  <span className="tag">Top rated</span>
                </div>
                <div className="profile-subline">
                  <span><MapPin size={16} /> Dubai, UAE</span>
                  <span>Member since Jun 2026</span>
                </div>
                <div className="profile-tags">
                  {skills.slice(0, 3).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="primary-button" type="button">
                <UserPlus size={18} /> Invite to task
              </button>
              <button className="secondary-button" type="button">
                <MessageSquare size={18} /> Message
              </button>
            </div>
          </section>

          <section className="profile-content-grid">
            <div className="profile-left-column">
              <div className="profile-stats-card">
                <ProfileStat label="Rating" value="4.8" detail="24 reviews" stars />
                <ProfileStat label="Success rate" value="96%" detail="Based on 25 tasks" />
                <ProfileStat label="Tasks completed" value="18" detail="Across all time" />
                <ProfileStat label="Response time" value="2h" detail="Avg. first response" />
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<BriefcaseBusiness size={21} />} title="Experience" />
                <p>{profile.experience || "No experience added yet."}</p>
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<ShieldCheck size={21} />} title="Skills" />
                <div className="skill-chip-list">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<GraduationCap size={21} />} title="Education / Training" />
                <p>{profile.education || "No education or training added yet."}</p>
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<ShieldCheck size={21} />} title="Certificates" />
                <p>{profile.certificates || "No certificates added yet."}</p>
              </div>
            </div>

            <aside className="profile-right-column">
              <div className="profile-side-card">
                <h2>About tester</h2>
                <p>
                  QA engineer focused on clear bug reports, reliable communication,
                  and practical recommendations for product teams.
                </p>
                <div className="profile-languages">
                  <strong>Languages</strong>
                  <span>English</span>
                  <span>Russian</span>
                </div>
              </div>

              <div className="profile-side-card">
                <h2>Recent activity</h2>
                <ActivityItem date="26 Jun 2026" text="Submitted report for API" status="Approved" />
                <ActivityItem date="25 Jun 2026" text="Submitted report for Web App" status="Approved" />
                <ActivityItem date="23 Jun 2026" text="Submitted report for Mobile App" status="Pending" />
              </div>

              <div className="profile-side-card">
                <h2>Reviews (24)</h2>
                <div className="reviews-score">
                  <strong>4.8</strong>
                  <span><Star size={16} fill="currentColor" /> 24 reviews</span>
                </div>
                <ReviewBar label="5" value="82%" count="19" />
                <ReviewBar label="4" value="34%" count="4" />
                <ReviewBar label="3" value="12%" count="1" />
              </div>
            </aside>
          </section>

          <footer className="profile-bottom-stats">
            <ProfileStat label="Tasks completed" value="18" />
            <ProfileStat label="Success rate" value="96%" />
            <ProfileStat label="On-time delivery" value="94%" />
            <ProfileStat label="Repeat clients" value="12" />
            <ProfileStat label="Last active" value="Today" />
          </footer>
        </article>
      </section>
    </main>
  );
}

function ProfileTopbar({ onBack }) {
  return (
    <div className="profile-topbar">
      <div className="brand compact">
        <ShieldCheck size={28} />
        <span>BetaHub</span>
      </div>
      <button className="secondary-button small" onClick={onBack} type="button">
        <ArrowLeft size={17} /> Back to applications
      </button>
    </div>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <div className="profile-section-heading">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function ProfileStat({ detail, label, stars, value }) {
  return (
    <div className="profile-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {stars && <em>★★★★★</em>}
      {detail && <small>{detail}</small>}
    </div>
  );
}

function ActivityItem({ date, status, text }) {
  return (
    <div className="activity-item">
      <div>
        <strong>{date}</strong>
        <span>{text}</span>
      </div>
      <em className={status === "Approved" ? "approved" : ""}>{status}</em>
    </div>
  );
}

function ReviewBar({ count, label, value }) {
  return (
    <div className="review-bar">
      <span>{label}★</span>
      <div><i style={{ width: value }} /></div>
      <strong>{count}</strong>
    </div>
  );
}

function splitList(value, fallback) {
  if (!value) return fallback;
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
