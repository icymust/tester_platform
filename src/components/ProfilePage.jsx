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

export function ProfilePage({ currentUser, onBack, onOpenMessage, profile, t }) {
  const p = t.platform.profile;
  if (!profile) {
    return (
      <main className="profile-page">
        <section className="profile-shell">
          <ProfileTopbar onBack={onBack} t={t} />
          <div className="profile-card">
            <span className="step-pill">{p.profile}</span>
            <h1>{p.notFound}</h1>
            <p className="muted">{p.notAvailable}</p>
          </div>
        </section>
      </main>
    );
  }

  if (profile.role !== "tester") {
    const isOwnProfile = currentUser?.id === profile.id;

    return (
      <main className="profile-page">
        <section className="profile-shell">
          <ProfileTopbar onBack={onBack} t={t} />
          <article className="profile-card">
            <div className="profile-hero-main">
              <span className="avatar large">{initials(profile.name || t.common.client)}</span>
              <div>
                <h1>{profile.name || t.common.client}</h1>
                <p>{profile.company || p.clientAccount}</p>
              </div>
            </div>
            {!isOwnProfile && (
              <div className="profile-actions">
                <button
                  className="secondary-button"
                  onClick={() => onOpenMessage(profile.id)}
                  type="button"
                >
                  <MessageSquare size={18} /> {p.message}
                </button>
              </div>
            )}
          </article>
        </section>
      </main>
    );
  }

  const skills = splitList(profile.skills, p.defaultSkills);
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <main className="profile-page">
      <section className="profile-shell modern-profile">
        <ProfileTopbar onBack={onBack} t={t} />

        <article className="profile-modern-card">
          <section className="profile-hero-panel">
            <div className="profile-hero-main">
              <div className="profile-avatar-card">
                <span className="avatar xl">{initials(profile.name || "QA")}</span>
                <span className="online-dot" />
              </div>
              <div>
                <div className="profile-name-row">
                  <h1>{profile.name || p.qaTester}</h1>
                  <span className="tag">{p.topRated}</span>
                </div>
                <div className="profile-subline">
                  <span><MapPin size={16} /> Dubai, UAE</span>
                  <span>{p.memberSince}</span>
                </div>
                <div className="profile-tags">
                  {skills.slice(0, 3).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="profile-actions">
                <button className="primary-button" type="button">
                  <UserPlus size={18} /> {p.invite}
                </button>
                <button
                  className="secondary-button"
                  onClick={() => onOpenMessage(profile.id)}
                  type="button"
                >
                  <MessageSquare size={18} /> {p.message}
                </button>
              </div>
            )}
          </section>

          <section className="profile-content-grid">
            <div className="profile-left-column">
              <div className="profile-stats-card">
                <ProfileStat label={p.rating} value="4.8" detail={`24 ${p.reviews}`} stars />
                <ProfileStat label={p.successRate} value="96%" detail={p.basedOnTasks} />
                <ProfileStat label={p.tasksCompleted} value="18" detail={p.acrossAllTime} />
                <ProfileStat label={p.responseTime} value="2h" detail={p.avgResponse} />
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<BriefcaseBusiness size={21} />} title={p.experience} />
                <p>{profile.experience || p.noExperience}</p>
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<ShieldCheck size={21} />} title={p.skills} />
                <div className="skill-chip-list">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<GraduationCap size={21} />} title={p.education} />
                <p>{profile.education || p.noEducation}</p>
              </div>

              <div className="profile-section-card">
                <SectionHeading icon={<ShieldCheck size={21} />} title={p.certificates} />
                <p>{profile.certificates || p.noCertificates}</p>
              </div>
            </div>

            <aside className="profile-right-column">
              <div className="profile-side-card">
                <h2>{p.about}</h2>
                <p>{p.aboutText}</p>
                <div className="profile-languages">
                  <strong>{p.languages}</strong>
                  <span>{p.english}</span>
                  <span>{p.russian}</span>
                </div>
              </div>

              <div className="profile-side-card">
                <h2>{p.recentActivity}</h2>
                <ActivityItem date="26 Jun 2026" text={`${p.submittedReportFor} API`} status={p.approved} approved />
                <ActivityItem date="25 Jun 2026" text={`${p.submittedReportFor} Web App`} status={p.approved} approved />
                <ActivityItem date="23 Jun 2026" text={`${p.submittedReportFor} Mobile App`} status={p.pending} />
              </div>

              <div className="profile-side-card">
                <h2>{p.reviews} (24)</h2>
                <div className="reviews-score">
                  <strong>4.8</strong>
                  <span><Star size={16} fill="currentColor" /> 24 {p.reviews}</span>
                </div>
                <ReviewBar label="5" value="82%" count="19" />
                <ReviewBar label="4" value="34%" count="4" />
                <ReviewBar label="3" value="12%" count="1" />
              </div>
            </aside>
          </section>

          <footer className="profile-bottom-stats">
            <ProfileStat label={p.tasksCompleted} value="18" />
            <ProfileStat label={p.successRate} value="96%" />
            <ProfileStat label={p.onTime} value="94%" />
            <ProfileStat label={p.repeatClients} value="12" />
            <ProfileStat label={p.lastActive} value={p.today} />
          </footer>
        </article>
      </section>
    </main>
  );
}

function ProfileTopbar({ onBack, t }) {
  return (
    <div className="profile-topbar">
      <div className="brand compact">
        <ShieldCheck size={28} />
        <span>{t.common.betaHub}</span>
      </div>
      <button className="secondary-button small" onClick={onBack} type="button">
        <ArrowLeft size={17} /> {t.platform.profile.back}
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

function ActivityItem({ approved = false, date, status, text }) {
  return (
    <div className="activity-item">
      <div>
        <strong>{date}</strong>
        <span>{text}</span>
      </div>
      <em className={approved ? "approved" : ""}>{status}</em>
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
