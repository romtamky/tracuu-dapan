(function () {
  if (window.__AUTO_TRACUU__) {
    alert("Bộ bắt chữ tự động đã sẵn sàng!");
    return;
  }
  window.__AUTO_TRACUU__ = true;

  // Tự động lấy domain hiện tại của web app trên Vercel
  const scriptTag = document.currentScript;
  const baseUrl = scriptTag ? scriptTag.src.replace('/inject.js', '') : '';
  const DATA_URL = baseUrl ? `${baseUrl}/data.json` : 'https://DOMAIN_CUA_BAN.vercel.app/data.json';

  let DB = [];

  // Tải ngân hàng câu hỏi
  fetch(DATA_URL)
    .then(r => r.json())
    .then(d => {
      DB = d;
      console.log("[Tra Cứu] Đã nạp thành công", DB.length, "câu hỏi");
    })
    .catch(() => alert("Không thể tải dữ liệu câu hỏi từ server!"));

  // Tạo thanh đáp án nổi ở mép dưới
  const bar = document.createElement('div');
  bar.id = 'auto-ans-bar';
  bar.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 5%;
    width: 90%;
    max-width: 500px;
    background: #0f172a;
    color: #fff;
    border: 2px solid #38bdf8;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    z-index: 2147483647;
    display: none;
    box-sizing: border-box;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  document.body.appendChild(bar);

  // Mở khóa chặn bôi đen văn bản
  document.addEventListener('selectstart', e => e.stopImmediatePropagation(), true);
  document.body.style.userSelect = 'auto';
  document.body.style.webkitUserSelect = 'auto';

  function clean(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/\s+/g, ' ').trim();
  }

  function find() {
    const selected = window.getSelection().toString().trim();
    if (!selected || selected.length < 3) return;

    const qClean = clean(selected);
    const match = DB.find(item => clean(item.q).includes(qClean) || qClean.includes(clean(item.q)));

    if (match) {
      bar.innerHTML = `
        <div style="color: #4ade80; font-weight: bold; font-size: 12px; margin-bottom: 4px;">✔ ĐÁP ÁN ĐÚNG</div>
        <div style="color: #f8fafc; font-size: 15px;">${match.a}</div>
      `;
      bar.style.display = 'block';
    }
  }

  // Bắt sự kiện thả tay trên điện thoại và thả chuột trên PC
  document.addEventListener('touchend', () => setTimeout(find, 250));
  document.addEventListener('mouseup', () => setTimeout(find, 100));

  // Chạm vào thanh đáp án hoặc ra ngoài để ẩn
  bar.addEventListener('click', () => bar.style.display = 'none');
  document.addEventListener('touchstart', (e) => {
    if (e.target !== bar && !bar.contains(e.target)) bar.style.display = 'none';
  });

  alert("Kích hoạt thành công! Hãy chạm bôi đen câu hỏi để hiện đáp án.");
})();