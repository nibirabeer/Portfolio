import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './BookingCalendar.css';

const EMAIL = 'abirnibir10@gmail.com';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdyynog';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const OWNER_TIMEZONE = 'Europe/London';
const BUSINESS_START = 9;   // 09:00 owner-local
const BUSINESS_END = 17;    // slots stop before 17:00 owner-local
const LUNCH_HOUR = 12;      // 12:00–13:00 owner-local kept free
const WINDOW_DAYS = 60;     // how far out slots are generated

const DURATION_MIN = 5;
const DURATION_MAX = 120;
const DURATION_STEP = 5;
const DURATION_DEFAULT = 30;

const CALL_TYPES = [
  { key: 'video', label: 'Video call' },
  { key: 'audio', label: 'Audio call' },
];

const GOOGLE_MEET_ICON = (
  <svg width="24" height="24" viewBox="0 0 36 36" aria-hidden="true">
    <defs>
      <linearGradient id="meetBodyGrad" x1="4" y1="6" x2="26" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE177" />
        <stop offset="100%" stopColor="#FFC633" />
      </linearGradient>
    </defs>
    <rect x="4" y="7" width="20" height="20" rx="6" fill="url(#meetBodyGrad)" />
    <circle cx="10.5" cy="22.5" r="2.4" fill="#fff" />
    <path d="M24 15.5l8.5-5.6a1.8 1.8 0 012.8 1.5v14.2a1.8 1.8 0 01-2.8 1.5L24 21.5v-6z" fill="#FF9166" />
  </svg>
);

const ZOOM_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="5" fill="#2D8CFF" />
    <rect x="5" y="7" width="10" height="10" rx="2" fill="#fff" />
    <path d="M16 10.2l3.3-1.9a.6.6 0 01.9.52v6.34a.6.6 0 01-.9.52L16 13.7v-3.5z" fill="#fff" />
  </svg>
);

const PLATFORMS = [
  { key: 'google-meet', label: 'Google Meet', icon: GOOGLE_MEET_ICON },
  { key: 'zoom', label: 'Zoom', icon: ZOOM_ICON },
];

// A compact west-to-east spread of common zones for the manual picker —
// GMT labels are computed live (see formatGmtLabel) so they stay correct
// across DST rather than being hardcoded.
const TIMEZONE_OPTIONS = [
  { tz: 'Pacific/Honolulu', city: 'Honolulu' },
  { tz: 'America/Anchorage', city: 'Anchorage' },
  { tz: 'America/Los_Angeles', city: 'Los Angeles' },
  { tz: 'America/Denver', city: 'Denver' },
  { tz: 'America/Chicago', city: 'Chicago' },
  { tz: 'America/New_York', city: 'New York' },
  { tz: 'America/Sao_Paulo', city: 'São Paulo' },
  { tz: 'Europe/London', city: 'London' },
  { tz: 'Europe/Berlin', city: 'Berlin' },
  { tz: 'Europe/Athens', city: 'Athens' },
  { tz: 'Europe/Moscow', city: 'Moscow' },
  { tz: 'Asia/Dubai', city: 'Dubai' },
  { tz: 'Asia/Karachi', city: 'Karachi' },
  { tz: 'Asia/Dhaka', city: 'Dhaka' },
  { tz: 'Asia/Bangkok', city: 'Bangkok' },
  { tz: 'Asia/Singapore', city: 'Singapore' },
  { tz: 'Asia/Tokyo', city: 'Tokyo' },
  { tz: 'Australia/Sydney', city: 'Sydney' },
  { tz: 'Pacific/Auckland', city: 'Auckland' },
];

const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function pad(n) { return String(n).padStart(2, '0'); }

// Reusable formatter → {y, mo, d, weekday, key} for a given instant in a zone.
function makeDayKeyFormatter(timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
  });
}

function partsToDayKey(parts) {
  const map = {};
  parts.forEach((p) => { map[p.type] = p.value; });
  return {
    y: parseInt(map.year, 10),
    mo: parseInt(map.month, 10) - 1,
    d: parseInt(map.day, 10),
    weekday: WEEKDAY_MAP[map.weekday],
    key: `${map.year}-${map.month}-${map.day}`,
  };
}

// GMT offset (minutes) for a zone at a given instant — used to convert an
// owner-local wall-clock time into a real UTC instant without a date library.
function offsetMinutesAt(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(date);
  const tzName = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT+0';
  const m = tzName.match(/GMT([+-]\d+)(?::(\d{2}))?/);
  if (!m) return 0;
  const h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  return h * 60 + (h < 0 ? -min : min);
}

function formatGmtLabel(timeZone) {
  const offsetMin = offsetMinutesAt(new Date(), timeZone);
  const sign = offsetMin < 0 ? '-' : '+';
  const abs = Math.abs(offsetMin);
  return `GMT${sign}${Math.floor(abs / 60)}:${pad(abs % 60)}`;
}

function formatDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(date, timeZone, use24h) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone, hour: use24h ? '2-digit' : 'numeric', minute: '2-digit', hour12: !use24h,
  }).format(date);
}

// Add `days` to a pure calendar date (y, mo, d) — anchored at UTC noon so
// DST never shifts the calendar date itself.
function addCalendarDays(y, mo, d, days) {
  const anchor = new Date(Date.UTC(y, mo, d, 12));
  anchor.setUTCDate(anchor.getUTCDate() + days);
  return { y: anchor.getUTCFullYear(), mo: anchor.getUTCMonth(), d: anchor.getUTCDate(), weekday: anchor.getUTCDay() };
}

function dateKeyToLabel(key) {
  const [y, mo, d] = key.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function buildGrid(y, mo) {
  const firstWeekday = new Date(y, mo, 1).getDay();
  const daysInMonth = new Date(y, mo + 1, 0).getDate();
  const cells = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ y, mo, d, key: `${y}-${pad(mo + 1)}-${pad(d)}` });
  }
  return cells;
}

// Generates every owner-business-hour slot (on a `durationMin`-minute grid)
// over the coming window, converts each to the visitor's local time, and
// groups them by the VISITOR's local calendar date (a slot can land on a
// different date for the visitor than for the owner, exactly like Cal.com).
function generateSlotsByVisitorDate(visitorTimeZone, durationMin) {
  const now = new Date();
  const ownerDayFmt = makeDayKeyFormatter(OWNER_TIMEZONE);
  const visitorDayFmt = makeDayKeyFormatter(visitorTimeZone);

  const ownerToday = partsToDayKey(ownerDayFmt.formatToParts(now));
  const byDate = new Map();

  const dayStartMin = BUSINESS_START * 60;
  const dayEndMin = BUSINESS_END * 60;
  const lunchStartMin = LUNCH_HOUR * 60;
  const lunchEndMin = (LUNCH_HOUR + 1) * 60;

  for (let i = 0; i <= WINDOW_DAYS; i += 1) {
    const { y, mo, d, weekday } = addCalendarDays(ownerToday.y, ownerToday.mo, ownerToday.d, i);
    if (weekday === 0 || weekday === 6) continue; // owner's weekend

    // Offset is effectively constant across a single business day — one
    // lookup per owner-day instead of one per slot keeps this fast.
    const offsetMin = offsetMinutesAt(new Date(Date.UTC(y, mo, d, 12)), OWNER_TIMEZONE);

    for (let startMin = dayStartMin; startMin + durationMin <= dayEndMin; startMin += durationMin) {
      const endMin = startMin + durationMin;
      if (startMin < lunchEndMin && endMin > lunchStartMin) continue; // overlaps lunch

      const utc = new Date(Date.UTC(y, mo, d, Math.floor(startMin / 60), startMin % 60) - offsetMin * 60000);
      if (utc.getTime() <= now.getTime()) continue;

      const vKey = partsToDayKey(visitorDayFmt.formatToParts(utc)).key;
      const arr = byDate.get(vKey);
      if (arr) arr.push(utc); else byDate.set(vKey, [utc]);
    }
  }

  byDate.forEach((arr) => arr.sort((a, b) => a - b));
  return byDate;
}

export default function BookingCalendar() {
  const visitorTimeZone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return 'UTC'; }
  }, []);

  const [locationLabel, setLocationLabel] = useState(null);

  // Best-effort IP geolocation, purely for the friendly "detected near…"
  // label — the actual slot math always trusts whichever timezone is
  // active (browser-detected by default, or the visitor's manual override),
  // since that's what genuinely matches a clock, not an IP guess.
  useEffect(() => {
    let cancelled = false;
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const label = [data.city, data.country].filter(Boolean).join(', ');
        if (label) setLocationLabel(label);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const [tzOverride, setTzOverride] = useState(null);
  const effectiveTimeZone = tzOverride || visitorTimeZone;

  // `duration` is the committed value that drives slot generation; `sliderValue`
  // is the live value the thumb/fill/bubble track while dragging. Splitting
  // them means dragging feels instant (no recomputing the slot map on every
  // pixel) while the expensive regeneration only fires once, on release.
  const [duration, setDuration] = useState(DURATION_DEFAULT);
  const [sliderValue, setSliderValue] = useState(DURATION_DEFAULT);
  const [isDragging, setIsDragging] = useState(false);
  const durationFillRef = useRef(null);
  const durationThumbRef = useRef(null);
  const durationBubbleRef = useRef(null);

  const commitDuration = () => setDuration(sliderValue);

  useEffect(() => {
    if (!durationFillRef.current || !durationThumbRef.current || !durationBubbleRef.current) return;
    const pct = ((sliderValue - DURATION_MIN) / (DURATION_MAX - DURATION_MIN)) * 100;
    // While actively dragging, track the pointer 1:1 (no easing lag). Once
    // released — or moved via keyboard/click — ease into place instead.
    const tween = isDragging ? gsap.set : gsap.to;
    tween(durationFillRef.current, { width: `${pct}%`, duration: 0.3, ease: 'power3.out' });
    tween(durationThumbRef.current, { left: `${pct}%`, duration: 0.3, ease: 'power3.out' });
    tween(durationBubbleRef.current, { left: `${pct}%`, duration: 0.3, ease: 'power3.out' });
  }, [sliderValue, isDragging]);

  useEffect(() => {
    if (!durationBubbleRef.current || !durationThumbRef.current) return;
    if (isDragging) {
      gsap.to(durationBubbleRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'back.out(2.5)' });
      gsap.to(durationThumbRef.current, { scale: 1.3, duration: 0.18, ease: 'power2.out' });
    } else {
      gsap.to(durationBubbleRef.current, { opacity: 0, y: 6, scale: 0.8, duration: 0.18, ease: 'power2.in' });
      gsap.to(durationThumbRef.current, { scale: 1, duration: 0.18, ease: 'power2.out' });
    }
  }, [isDragging]);

  const [callType, setCallType] = useState('video');
  const [platform, setPlatform] = useState('google-meet');
  const [phone, setPhone] = useState('');
  const [use24h, setUse24h] = useState(true);

  // Sliding background indicators for the two-way pickers, GSAP-animated
  // between segments instead of hard-swapping each button's background.
  const callTypeIndicatorRef = useRef(null);
  const platformIndicatorRef = useRef(null);
  const callTypeSwapRef = useRef(null);

  useEffect(() => {
    if (!callTypeIndicatorRef.current) return;
    const idx = CALL_TYPES.findIndex((c) => c.key === callType);
    gsap.to(callTypeIndicatorRef.current, { xPercent: idx * 100, duration: 0.35, ease: 'power3.out' });
  }, [callType]);

  useEffect(() => {
    if (!platformIndicatorRef.current) return;
    const idx = PLATFORMS.findIndex((p) => p.key === platform);
    gsap.to(platformIndicatorRef.current, { xPercent: idx * 100, duration: 0.35, ease: 'power3.out' });
  }, [platform]);

  // The Platform picker / phone-number field swap when call type changes —
  // give the incoming block a small settle-in instead of an abrupt jump cut.
  useEffect(() => {
    if (callTypeSwapRef.current) {
      gsap.fromTo(callTypeSwapRef.current, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [callType]);

  const setPlatformIndicatorRef = (el) => {
    platformIndicatorRef.current = el;
    if (el) {
      const idx = PLATFORMS.findIndex((p) => p.key === platform);
      gsap.set(el, { xPercent: idx * 100 });
    }
  };

  const slotsByDate = useMemo(
    () => generateSlotsByVisitorDate(effectiveTimeZone, duration),
    [effectiveTimeZone, duration],
  );

  const effectiveToday = useMemo(
    () => partsToDayKey(makeDayKeyFormatter(effectiveTimeZone).formatToParts(new Date())),
    [effectiveTimeZone],
  );
  const maxCursor = useMemo(
    () => addCalendarDays(effectiveToday.y, effectiveToday.mo, effectiveToday.d, WINDOW_DAYS),
    [effectiveToday],
  );

  const [cursor, setCursor] = useState(() => ({ y: effectiveToday.y, mo: effectiveToday.mo }));
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', note: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Changing the timezone or duration reshuffles which dates/slots are even
  // valid, so any prior selection could point at a slot that no longer exists.
  useEffect(() => {
    setCursor({ y: effectiveToday.y, mo: effectiveToday.mo });
    setSelectedDateKey(null);
    setSelectedSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveTimeZone, duration]);

  const cells = useMemo(() => buildGrid(cursor.y, cursor.mo), [cursor]);
  const monthLabel = new Date(cursor.y, cursor.mo, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const isCurrentMonth = cursor.y === effectiveToday.y && cursor.mo === effectiveToday.mo;
  const isMaxMonth = cursor.y === maxCursor.y && cursor.mo === maxCursor.mo;

  const changeMonth = (delta) => {
    setCursor((c) => {
      const d = new Date(c.y, c.mo + delta, 1);
      return { y: d.getFullYear(), mo: d.getMonth() };
    });
  };

  const pickDate = (cell) => {
    setSelectedDateKey(cell.key);
    setSelectedSlot(null);
    setError('');
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const selectedDateLabel = selectedDateKey ? dateKeyToLabel(selectedDateKey) : null;
  const selectedSlotLabel = selectedSlot ? formatTime(selectedSlot, effectiveTimeZone, use24h) : null;
  const timeSlots = selectedDateKey ? (slotsByDate.get(selectedDateKey) || []) : [];

  const resetAll = () => {
    setSelectedDateKey(null);
    setSelectedSlot(null);
    setForm({ name: '', email: '', note: '' });
    setPhone('');
    setSent(false);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!selectedDateKey || !selectedSlot) {
      setError('Pick an available date and time slot first.');
      return;
    }
    if (!form.name || !form.email) {
      setError('Please add your name and email.');
      return;
    }
    setLoading(true);
    try {
      const ownerLabel = formatTime(selectedSlot, OWNER_TIMEZONE, true);
      const callLine = callType === 'video'
        ? `Call type: Video call via ${platform === 'google-meet' ? 'Google Meet' : 'Zoom'}`
        : `Call type: Audio call${phone ? ` — reach me at ${phone}` : ' (no number given, please email to arrange)'}`;

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Booking request — ${selectedDateLabel} at ${selectedSlotLabel} (${effectiveTimeZone})`,
          message: `Requested slot: ${selectedDateLabel} at ${selectedSlotLabel} — visitor's time (${effectiveTimeZone}${locationLabel ? `, near ${locationLabel}` : ''})\nThat's ${ownerLabel} for you (${OWNER_TIMEZONE}).\nDuration: ${duration} minutes\n${callLine}\n\nNote: ${form.note || '(none)'}`,
        }),
      });
      if (res.ok) {
        setLoading(false);
        setSent(true);
      } else {
        throw new Error('failed');
      }
    } catch {
      setLoading(false);
      setError(`Something went wrong. Email me directly at ${EMAIL}`);
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-grid">

        {/* Profile panel */}
        <div className="booking-panel booking-profile">
          <div className="booking-avatar-wrap">
            <div className="booking-avatar">NA</div>
            <span className="booking-avatar-status" />
          </div>
          <p className="booking-name">Nibir Abeer</p>
          <p className="booking-role">Frontend &amp; Full-Stack Developer</p>
          <p className="booking-blurb">
            If you're building a <strong>web app, AI feature, or need a developer</strong> who
            thinks in outcomes, not just code — let's talk it through.
          </p>

          <div className="booking-profile-divider" />

          <div className="booking-picker-group">
            <p className="booking-picker-label">Duration</p>
            <div className="booking-duration-slider">
              <div ref={durationBubbleRef} className="booking-duration-bubble">{formatDuration(sliderValue)}</div>
              <div className="booking-duration-track-wrap">
                <div className="booking-duration-track-bg" />
                <div ref={durationFillRef} className="booking-duration-track-fill" />
                <div ref={durationThumbRef} className="booking-duration-thumb" />
                <input
                  type="range"
                  className="booking-duration-input"
                  min={DURATION_MIN}
                  max={DURATION_MAX}
                  step={DURATION_STEP}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  onPointerDown={() => setIsDragging(true)}
                  onPointerUp={() => { setIsDragging(false); commitDuration(); }}
                  onKeyUp={() => { setIsDragging(false); commitDuration(); }}
                  onFocus={() => setIsDragging(true)}
                  onBlur={() => { setIsDragging(false); commitDuration(); }}
                  aria-label="Call duration in minutes"
                />
              </div>
              <div className="booking-duration-endlabels">
                <span>5m</span>
                <span>2h</span>
              </div>
            </div>
          </div>

          <div className="booking-picker-group">
            <p className="booking-picker-label">Call type</p>
            <div className="booking-segmented booking-segmented--2">
              <div ref={callTypeIndicatorRef} className="booking-segment-indicator" />
              {CALL_TYPES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`booking-segment-btn ${callType === c.key ? 'is-active' : ''}`}
                  onClick={() => setCallType(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {callType === 'video' ? (
            <div className="booking-picker-group" ref={callTypeSwapRef}>
              <p className="booking-picker-label">Platform</p>
              <div className="booking-segmented booking-segmented--2">
                <div ref={setPlatformIndicatorRef} className="booking-segment-indicator" />
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={`booking-segment-btn booking-segment-btn--platform ${platform === p.key ? 'is-active' : ''}`}
                    onClick={() => setPlatform(p.key)}
                    aria-label={p.label}
                  >
                    {p.icon}
                    <span className="booking-platform-tooltip">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="booking-picker-group" ref={callTypeSwapRef}>
              <p className="booking-picker-label">Phone number</p>
              <input
                className="booking-phone-input"
                type="tel"
                placeholder="For the call (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <div className="booking-picker-group">
            <p className="booking-picker-label">Timezone</p>
            <div className="booking-tz-select-wrap">
              <svg className="booking-tz-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z"/>
              </svg>
              <select
                className="booking-tz-select"
                title={locationLabel || undefined}
                value={tzOverride || 'auto'}
                onChange={(e) => setTzOverride(e.target.value === 'auto' ? null : e.target.value)}
              >
                <option value="auto">{locationLabel || 'Detecting location…'}</option>
                {TIMEZONE_OPTIONS.map((o) => (
                  <option key={o.tz} value={o.tz}>{formatGmtLabel(o.tz)} {o.city}</option>
                ))}
              </select>
              <svg className="booking-tz-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Calendar panel */}
        <div className="booking-panel booking-calendar">
          <div className="booking-cal-header">
            <p className="booking-cal-month">{monthLabel}</p>
            <div className="booking-cal-nav">
              <button
                type="button"
                className="booking-cal-nav-btn"
                onClick={() => changeMonth(-1)}
                disabled={isCurrentMonth}
                aria-label="Previous month"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                className="booking-cal-nav-btn"
                onClick={() => changeMonth(1)}
                disabled={isMaxMonth}
                aria-label="Next month"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div className="booking-cal-weekdays">
            {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
          </div>

          <div className="booking-cal-grid">
            {cells.map((cell, i) => {
              if (!cell) return <span key={`empty-${i}`} className="booking-cal-day booking-cal-day--empty" />;
              const available = slotsByDate.has(cell.key);
              const isToday = cell.key === effectiveToday.key;
              return (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    'booking-cal-day',
                    available ? 'is-available' : 'is-disabled',
                    cell.key === selectedDateKey ? 'is-selected' : '',
                    isToday ? 'is-today' : '',
                  ].join(' ').trim()}
                  disabled={!available}
                  onClick={() => pickDate(cell)}
                >
                  {cell.d}
                  {isToday && <span className="booking-cal-day-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots panel */}
        <div className="booking-panel booking-slots">
          <div className="booking-slots-header">
            <p className="booking-slots-title">{selectedDateLabel || 'Pick a date'}</p>
            {selectedDateKey && (
              <div className="booking-hour-toggle">
                <button type="button" className={!use24h ? 'is-active' : ''} onClick={() => setUse24h(false)}>12h</button>
                <button type="button" className={use24h ? 'is-active' : ''} onClick={() => setUse24h(true)}>24h</button>
              </div>
            )}
          </div>
          <div className="booking-slots-list">
            {selectedDateKey ? timeSlots.map((utc) => (
              <button
                key={utc.toISOString()}
                type="button"
                className={`booking-slot ${selectedSlot?.getTime() === utc.getTime() ? 'is-selected' : ''}`}
                onClick={() => setSelectedSlot(utc)}
              >
                {formatTime(utc, effectiveTimeZone, use24h)}
              </button>
            )) : (
              <p className="booking-slots-empty">Select an available date to see open time slots.</p>
            )}
          </div>
        </div>

      </div>

      <div className="booking-divider" />

      {sent ? (
        <div className="booking-success">
          <div className="booking-success-icon">✓</div>
          <h3>Request sent!</h3>
          <p>I'll confirm your {selectedDateLabel} · {selectedSlotLabel} slot by email within 24 hours.</p>
          <button className="contact-submit" onClick={resetAll}>Book another</button>
        </div>
      ) : (
        <div className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">What's it about? (optional)</label>
            <textarea className="form-input form-textarea" name="note" placeholder="A line or two of context helps." rows={3} value={form.note} onChange={handleChange} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            className={`contact-submit ${loading ? 'contact-submit--loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Sending…'
              : selectedDateKey && selectedSlot
                ? `Request ${selectedDateLabel} · ${selectedSlotLabel} ↗`
                : 'Pick a date & time above'}
          </button>
        </div>
      )}
    </div>
  );
}
