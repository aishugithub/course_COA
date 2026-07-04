import COURSE_CONFIG from '../../config/course.config.js';

const C = {
  bg: '#0D1117', surface: '#161B22', card: '#1C2333', border: '#30363D',
  blue: '#58A6FF', green: '#3FB950', muted: '#8B949E', text: '#E6EDF3', soft: '#C9D1D9',
};
const MODULE_COLORS = ['#58A6FF','#BC8CFF','#3FB950','#E3B341','#F0883E','#39D5C4'];

export default function Dashboard({ student, completedUnits, onSelectUnit, onRequestLogin, onSignOff }) {
  // Optional units (Crucible challenges, optional: true in the config) are
  // bonus content: they never count toward the course percentage, so a
  // student who finishes every lesson but skips challenges still sees 100%.
  // completedUnits can also contain stage pseudo-ids like "Unit4_C@spark";
  // counting only against required unitIds filters those out too.
  const requiredIds = new Set(
    COURSE_CONFIG.modules.flatMap(m => m.units.filter(u => !u.optional).map(u => u.unitId))
  );
  const totalUnits = requiredIds.size;
  const doneCount = completedUnits.filter(id => requiredIds.has(id)).length;
  const pct = Math.round((doneCount / totalUnits) * 100);
  const isGuest = !student;

  // Free navigation: every unit is always clickable, in any order.
  // completedUnits is still used to show progress (✅ vs ▶️) and the
  // overall % bar, but no longer gates which units can be opened.
  // Guests (student === null) get the exact same Dashboard -- their
  // completedUnits just comes from localStorage instead of Sheets
  // (see guestProgress.js + App.jsx).

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Foothold</div>
          <h1 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0 }}>{COURSE_CONFIG.courseTitle}</h1>
          <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>{COURSE_CONFIG.subtitle}</p>
        </div>
        {isGuest ? (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>👋 Browsing as Guest</div>
            <button onClick={onRequestLogin} style={{ marginTop: 4, background: 'transparent', border: `1px solid ${C.blue}`, color: C.blue, borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
              Sign in to save progress
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: C.text, fontWeight: 600 }}>{student.name}</div>
            <div style={{ color: C.muted, fontSize: 12, fontFamily: 'monospace' }}>{student.rollNo}</div>
            <button onClick={onSignOff} style={{ marginTop: 4, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
              Sign Off
            </button>
          </div>
        )}
      </div>
      <div style={{ height: 4, background: C.border }}>
        <div style={{ height: '100%', width: `${pct}%`, background: C.green, transition: 'width 0.6s' }} />
      </div>
      <div style={{ padding: '24px 32px 0' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 32 }}>🎯</div>
          <div>
            <div style={{ color: C.text, fontWeight: 600 }}>{doneCount} of {totalUnits} units completed</div>
            <div style={{ color: C.muted, fontSize: 13 }}>{pct}% through the course · Keep going!</div>
          </div>
        </div>
      </div>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {COURSE_CONFIG.modules.map((mod, mIdx) => (
          <div key={mod.moduleId}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>{mod.icon}</span>
              <h2 style={{ color: MODULE_COLORS[mIdx % MODULE_COLORS.length], fontSize: 16, fontWeight: 700, margin: 0 }}>{mod.moduleTitle}</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {mod.units.map((unit, uIdx) => {
                const done = completedUnits.includes(unit.unitId);
                const isBonus = !!unit.optional;
                const accent = isBonus ? '#F0883E' : MODULE_COLORS[mIdx % MODULE_COLORS.length];
                return (
                  <div key={unit.unitId} onClick={() => onSelectUnit(unit.unitId)}
                    style={{ background: done ? '#0D2818' : isBonus ? '#1A130D' : C.card, border: `1px solid ${done ? C.green : accent + (isBonus ? '88' : '55')}`, borderRadius: 10, padding: '14px 18px', minWidth: 200, maxWidth: 260, cursor: 'pointer', transition: 'transform 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: isBonus ? accent : C.muted, fontSize: 11, fontFamily: 'monospace' }}>
                        {isBonus ? 'BONUS · CHALLENGE' : unit.unitId.replace('_', '.')}
                      </span>
                      <span style={{ fontSize: 14 }}>{done ? '✅' : isBonus ? '🔥' : '▶️'}</span>
                    </div>
                    <div style={{ color: done ? C.green : C.text, fontSize: 14, fontWeight: 600, marginTop: 6 }}>{unit.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
