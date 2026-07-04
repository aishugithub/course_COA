import COURSE_CONFIG from '../../config/course.config.js';

const C = {
  bg: '#0D1117', surface: '#161B22', card: '#1C2333', border: '#30363D',
  blue: '#58A6FF', solidBlue: '#1F6FEB', green: '#3FB950', purple: '#BC8CFF',
  muted: '#8B949E', text: '#E6EDF3', soft: '#C9D1D9',
};

// ── Staircase icon: a small decorative visual for the "scaffolding /
//    one step at a time" idea. Pure SVG, no external assets. ──
function StepsIcon() {
  const steps = [
    { x: 0,   y: 60, w: 34, h: 20 },
    { x: 34,  y: 44, w: 34, h: 36 },
    { x: 68,  y: 28, w: 34, h: 52 },
    { x: 102, y: 8,  w: 34, h: 72 },
  ];
  const colors = [C.muted, C.blue, C.purple, C.green];
  return (
    <svg width="140" height="90" viewBox="0 0 140 90" style={{ display: 'block' }}>
      {steps.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.w - 3} height={s.h} rx="4" fill={colors[i]} opacity={0.85} />
      ))}
    </svg>
  );
}

export default function Landing({ onExploreGuest, onGoToLogin }) {
  const totalUnits = COURSE_CONFIG.modules.reduce((acc, m) => acc + m.units.length, 0);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'system-ui, sans-serif', color: C.text }}>

      {/* ── Hero ── */}
      <div style={{ padding: '72px 24px 56px', textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <StepsIcon />
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 800, margin: 0, letterSpacing: -1 }}>Foothold</h1>
        <p style={{ color: C.blue, fontSize: 20, fontWeight: 600, margin: '10px 0 0' }}>
          Have you got your foothold on how computers really work?
        </p>
        <p style={{ color: C.soft, fontSize: 16, lineHeight: 1.6, margin: '20px auto 0', maxWidth: 560 }}>
          A free, self-paced course on Computer Organization & Architecture — from logic gates
          to a running program. No prior hardware knowledge, no cost, no account required to start.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <button onClick={onExploreGuest} style={{
            background: C.solidBlue, color: '#fff', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          }}>
            Explore the Dashboard →
          </button>
          <button onClick={onGoToLogin} style={{
            background: 'transparent', color: C.text, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}>
            Sign In / Register
          </button>
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 14 }}>
          Browsing is always free — signing in just lets you keep your progress across devices.
        </p>
      </div>

      {/* ── Who it's for ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 32px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: C.text }}>Who this is for</h2>
          <p style={{ color: C.soft, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Anyone curious about what happens beneath the code — how bits, registers, memory and
            buses come together into a working machine. Students, self-learners, curious minds, no
            matter where you are.
            {' '}{totalUnits}+ interactive lessons, each built around a single idea you can click,
            drag, or step through rather than just read.
          </p>
        </div>
      </div>

      {/* ── How you'll learn (Zone of Proximal Development / scaffolding) ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ background: C.card, border: `1px solid ${C.purple}55`, borderRadius: 14, padding: '28px 32px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: C.purple }}>How you'll learn</h2>
          <p style={{ color: C.soft, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Foothold is built on a well-studied idea from learning science: Lev Vygotsky's{' '}
            <strong style={{ color: C.text }}>Zone of Proximal Development</strong>. We learn best
            not from what we already know, and not from what's far beyond us, but from the narrow
            band just past our current ability — reachable with the right support. That support is
            called <strong style={{ color: C.text }}>scaffolding</strong>: temporary structure that
            holds you up while a skill is new, and is gradually removed as you build your own
            footing. Every lesson here follows that idea — a new concept is introduced only once
            you have exactly what you need to understand it, with just enough support to carry you
            the rest of the way on your own.
          </p>
          <p style={{ color: C.soft, fontSize: 14, lineHeight: 1.7, margin: '18px 0 0', paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <strong style={{ color: C.text }}>The research behind this course:</strong> I'm{' '}
            <strong style={{ color: C.text }}>Aishwarya</strong>, a professor of engineering, and
            Foothold is my action research in education — a study of whether active learning through
            interactive content helps beginners learn programming better than reading or watching
            alone. That's why every single lesson here is something you <em>do</em>, not something
            you sit through. Your anonymous progress through the lessons quietly contributes to this
            research and helps make the course better for the next learner.
          </p>
        </div>
      </div>

      {/* ── Explore freely, but a recommended order exists ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 72px' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 32px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: C.text }}>Learn your way</h2>
          <p style={{ color: C.soft, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Once you're in the Dashboard, every module and unit is open — click whichever one
            interests you, in any order. That said, since each unit builds on ideas from the ones
            before it, we <strong style={{ color: C.text }}>recommend going step by step</strong> the
            first time through, for the smoothest climb.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={onExploreGuest} style={{
              background: C.solidBlue, color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              Take me to the Dashboard →
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: C.muted, fontSize: 12, paddingBottom: 40 }}>
        Your progress is saved on this device automatically. Sign in anytime to keep it across devices.
      </div>
    </div>
  );
}
