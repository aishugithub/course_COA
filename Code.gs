// ============================================================
//  CODE.GS — paste into Google Apps Script editor
//  Deploy as Web App → Anyone → Execute as Me
// ============================================================

function doGet(e) {
  return handleRequest(e.parameter);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    let body;
    try { body = JSON.parse(e.postData.contents); } catch { body = e.parameter; }
    const result = routeAction(body);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function handleRequest(params) {
  try {
    return ContentService.createTextOutput(JSON.stringify(routeAction(params))).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function routeAction(body) {
  switch (body.action) {
    case 'login':        return handleLogin(body);
    case 'register':     return handleRegister(body);
    case 'saveProgress': return handleSaveProgress(body);
    case 'getProgress':  return handleGetProgress(body);
    case 'logEvent':     return handleLogEvent(body);
    default:             return { success: false, message: 'Unknown action' };
  }
}

// ------------------------------------------------------------
// Usage analytics. One row per event: a page/session started,
// a lesson was opened, a lesson was completed, or someone signed
// up. AnonId identifies a browser even for guests who never log
// in; UserId is filled in only once someone is signed in. Creates
// the Events tab itself on first call, so no manual sheet setup
// is required beyond redeploying this script.
// ------------------------------------------------------------
function handleLogEvent(body) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Events');
  if (!sheet) {
    sheet = ss.insertSheet('Events');
    sheet.appendRow(['Timestamp', 'AnonId', 'UserId', 'EventType', 'CourseId', 'UnitId']);
  }
  sheet.appendRow([
    new Date().toISOString(),
    body.anonId || '',
    body.userId || '',
    body.eventType || '',
    body.courseId || '',
    body.unitId || '',
  ]);
  return { success: true };
}

function handleLogin(body) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Students');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const [rollNo, password, name, batch, email] = data[i];
    if (String(rollNo).trim() === String(body.rollNo).trim() &&
        String(password).trim() === String(body.password).trim()) {
      return { success: true, student: { rollNo: String(rollNo), name, batch, email } };
    }
  }
  return { success: false, message: 'Invalid roll number or password.' };
}

// ------------------------------------------------------------
// Self-registration for the public, worldwide version of the
// course (as opposed to professor-provisioned SRFET students,
// who are added to the Students sheet by hand and use handleLogin
// above). Here the "username" a learner logs in with IS their
// email address, and the password is one they invent for this
// site only -- it is never their real email account password.
// The same Students sheet holds both kinds of rows; column 0
// (historically "RollNo") just becomes the login handle, whether
// that's a roll number or an email address. Column layout stays
// identical so handleLogin/handleGetProgress/handleSaveProgress
// don't need to change at all.
// ------------------------------------------------------------
function handleRegister(body) {
  const email = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '').trim();
  const name = String(body.name || '').trim();

  if (!email || !password || !name) {
    return { success: false, message: 'Name, email, and password are all required.' };
  }
  // Very light email shape check -- the real validation (does this
  // inbox exist) isn't something Apps Script can do, so we don't try.
  if (email.indexOf('@') === -1) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Please choose a password with at least 6 characters.' };
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Students');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === email) {
      return { success: false, message: 'An account with this email already exists. Please sign in instead.' };
    }
  }

  // Row shape matches handleLogin's [rollNo, password, name, batch, email]:
  // rollNo slot = the email (that's what they'll type in to sign back in),
  // batch slot marks this as a self-registered public account (not a batch year).
  sheet.appendRow([email, password, name, 'Self-registered', email]);
  return { success: true, student: { rollNo: email, name, batch: 'Self-registered', email } };
}

function handleSaveProgress(body) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Progress');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.rollNo) &&
        String(data[i][1]) === String(body.courseId) &&
        String(data[i][2]) === String(body.unitId)) {
      return { success: true, message: 'Already recorded.' };
    }
  }
  sheet.appendRow([body.rollNo, body.courseId, body.unitId, new Date().toISOString()]);
  return { success: true };
}

function handleGetProgress(body) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Progress');
  const data  = sheet.getDataRange().getValues();
  const units = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.rollNo) &&
        String(data[i][1]) === String(body.courseId)) {
      units.push(String(data[i][2]));
    }
  }
  return { success: true, completedUnits: units };
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let students = ss.getSheetByName('Students');
  if (!students) students = ss.insertSheet('Students');
  students.clearContents();
  students.appendRow(['RollNo', 'Password', 'Name', 'Batch', 'Email']);
  students.appendRow(['2024CS001', 'pass123', 'Sample Student', '2024-2028', 'student@example.com']);
  let progress = ss.getSheetByName('Progress');
  if (!progress) progress = ss.insertSheet('Progress');
  progress.clearContents();
  progress.appendRow(['RollNo', 'CourseId', 'UnitId', 'CompletedAt']);
  return 'Sheets created successfully!';
}
