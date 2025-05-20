const queue = [];
const maxSeats = 24;
const kursi = Array(4).fill(null).map(() => Array(6).fill(null));

function updateKursi() {
  const container = document.querySelector(".seat-grid");
  container.innerHTML = "";

  kursi.forEach((baris, i) => {
    baris.forEach((penonton, j) => {
      const div = document.createElement("div");
      div.className = "seat" + (penonton ? " filled" : "");
      div.textContent = penonton ? penonton : "";
      container.appendChild(div);
    });
  });
}

function updateAntrianUI() {
  const container = document.getElementById("visualAntrian");
  container.innerHTML = "";
  queue.forEach(nama => {
    const div = document.createElement("div");
    div.className = "antrian-item";
    div.textContent = nama;
    container.appendChild(div);
  });
}

function showToast(pesan) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = pesan;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function tambahAntrian() {
  const input = document.getElementById("namaInput").value.trim();
  if (!input) return;

  const daftar = input.split(",").map(n => n.trim());
  daftar.forEach(nama => {
    queue.push(nama);
  });

  updateAntrianUI();
  document.getElementById("namaInput").value = "";
}

function layaniSatu() {
  if (queue.length === 0) {
    showToast("Tidak ada penonton dalam antrian.");
    return;
  }

  let kursiTerisi = false;
  outer: for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      if (!kursi[i][j]) {
        const nama = queue.shift();
        kursi[i][j] = nama;
        kursiTerisi = true;
        showToast(`${nama} mendapatkan kursi baris ${i + 1}, kolom ${j + 1}`);
        break outer;
      }
    }
  }

  if (!kursiTerisi) {
    showToast("Semua kursi sudah penuh!");
  }

  updateKursi();
  updateAntrianUI();
}

function resetKursi() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      kursi[i][j] = null;
    }
  }
  updateKursi();
  showToast("Semua kursi telah direset.");
}
