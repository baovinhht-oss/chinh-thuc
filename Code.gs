/**
 * 4SK OPEN CHAMPIONSHIPS — Google Apps Script Web App
 * Nhận dữ liệu đăng ký từ form (index.html) và ghi vào Google Sheet.
 *
 * CÁCH DÙNG: xem hướng dẫn chi tiết trong README.md
 */

// Đổi tên các sheet nếu bạn muốn khác đi
const SOLO_SHEET_NAME = 'Solo';
const TEAM_SHEET_NAME = 'Team';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.mode === 'solo') {
      writeSoloRow(ss, data);
    } else if (data.mode === 'team') {
      writeTeamRow(ss, data);
    } else {
      return jsonResponse({ result: 'error', message: 'Thiếu hoặc sai trường "mode".' });
    }

    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.message });
  }
}

function writeSoloRow(ss, data) {
  const sheet = getOrCreateSheet(ss, SOLO_SHEET_NAME,
    ['Thời gian', 'Tên / Biệt danh', 'In-Game Name', 'Discord ID']);

  sheet.appendRow([
    formatTimestamp(data.timestamp),
    data.soloName || '',
    data.soloIGN || '',
    data.soloDiscord || ''
  ]);
}

function writeTeamRow(ss, data) {
  const sheet = getOrCreateSheet(ss, TEAM_SHEET_NAME,
    ['Thời gian', 'Tên đội', 'Đội trưởng - Tên', 'Đội trưởng - IGN', 'Đội trưởng - Discord', 'Thành viên (gộp)', 'Số lượng thành viên']);

  sheet.appendRow([
    formatTimestamp(data.timestamp),
    data.teamName || '',
    data.captainName || '',
    data.captainIGN || '',
    data.captainDiscord || '',
    data.membersFlat || '',
    (data.members || []).length
  ]);
}

// Tạo sheet nếu chưa tồn tại, và ghi hàng tiêu đề nếu sheet còn trống
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  } catch (e) {
    return iso || new Date().toISOString();
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Dùng để test nhanh trong trình soạn thảo Apps Script (Run > testDoPost)
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        mode: 'solo',
        timestamp: new Date().toISOString(),
        soloName: 'Nguyễn Test',
        soloIGN: 'TestIGN',
        soloDiscord: '@test_user'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
