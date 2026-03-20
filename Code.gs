/**
 * ส่วนที่ 1: ฟังก์ชันสำหรับเปิดหน้าเว็บ HTML
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
         .setTitle('FE06 Payment Tracker')
         .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
         .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * ส่วนที่ 2: ฟังก์ชันหลักในการดึงข้อมูลจาก 3 ไฟล์
 */
function checkStatus(id) {
  try {
    if (!id) return { status: "error", message: "No ID provided" };
    const idStr = id.toString().trim();

    const urls = {
      camp: "https://docs.google.com/spreadsheets/d/1GqhiT_mdsKer_blOHHf9S05mkDEPyWsh0lWAbSkjLhw/edit?usp=sharing",
      meet: "https://docs.google.com/spreadsheets/d/1s85ttWRI9rADGE-buVwEPSgE2ULftIFIUeYQMtvTG-g/edit?usp=sharing",
      shirt: "https://docs.google.com/spreadsheets/d/1XX9dMFtiYtU89zlGj3oy6S7W5YsjardVkmA8KWIffa8/edit?usp=sharing"
    };

    function fetchFrom(url) {
      try {
        const ss = SpreadsheetApp.openByUrl(url);
        const sheet = ss.getSheetByName("Status"); 
        if (!sheet) return null;
        
        const data = sheet.getDataRange().getValues();
        return data.find(row => row[0].toString().trim() === idStr);
      } catch (e) {
        console.error("Error fetching from " + url + ": " + e.message);
        return null; 
      }
    }

    // ประกาศตัวแปรเป็น res...
    const resCamp = fetchFrom(urls.camp);
    const resMeet = fetchFrom(urls.meet);
    const resShirt = fetchFrom(urls.shirt);

    if (resCamp || resMeet || resShirt) {
      // แก้ไขชื่อตัวแปรจาก r... เป็น res... ให้ตรงกับข้างบน
      return {
        status: "success",
        id: idStr,
        name: (resCamp?.[2] || resMeet?.[2] || resShirt?.[2] || "Unknown"), 
        nickname: (resCamp?.[4] || resMeet?.[4] || resShirt?.[4] || "-"),
        campStatus: (resCamp?.[5] || "Pending"),
        meetStatus: (resMeet?.[5] || "Pending"),
        shirtStatus: (resShirt?.[5] || "Pending")
      };
    } else {
      return { status: "not_found" };
    }

  } catch (err) {
    return { status: "error", message: "System error: " + err.message };
  }
}
DriveApp.getFiles();
