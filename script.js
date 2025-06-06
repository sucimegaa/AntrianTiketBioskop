const queue = [];
const studioKursi = {
  A: Array(4).fill(null).map(() => Array(6).fill(null)),
  B: Array(4).fill(null).map(() => Array(6).fill(null)),
  C: Array(4).fill(null).map(() => Array(6).fill(null))
};

const barisHuruf = ['A', 'B', 'C', 'D'];

function updateKursi() {
  for (const studio in studioKursi) {
    const container = document.getElementById(`studio${studio}`);
    container.innerHTML = "";
    studioKursi[studio].forEach((baris, barisIndex) => {
      baris.forEach((kursi, kolomIndex) => {
        // Format nomor kursi: baris menentukan huruf, kolom nomor
        const seatNumber = `${barisHuruf[barisIndex]}${kolomIndex + 1}`;

        const div = document.createElement("div");
        div.className = "seat" + (kursi ? " filled" : "");
        div.setAttribute("data-seat-number", seatNumber);

        if (kursi) {
          div.textContent = kursi; // Nama pelanggan di tengah
          div.title = `${kursi} - Kursi ${seatNumber}`;
        } else {
          div.textContent = "";
          div.title = `Kosong - Kursi ${seatNumber}`;
        }

        container.appendChild(div);
      });
    });
  }
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

function tambahAntrian() {
  const input = document.getElementById("namaInput").value.trim();
  if (!input) return;
  input.split(",").map(n => n.trim()).forEach(nama => queue.push(nama));
  updateAntrianUI();
  document.getElementById("namaInput").value = "";
}

function cariKursiKosong(studio) {
  const layout = studioKursi[studio];
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      if (!layout[i][j]) return { baris: i, kolom: j };
    }
  }
  return null;
}

function layaniAntrian() {
  if (queue.length === 0) {
    alert("Tidak ada penonton dalam antrian.");
    return;
  }

  const nama = queue.shift();
  updateAntrianUI();

  // Pilih studio
  let pilihan = prompt(`${nama}, pilih Studio (A/B/C):`);
  if (!pilihan) {
    alert("Pilihan studio tidak valid.");
    queue.unshift(nama);
    updateAntrianUI();
    return;
  }
  pilihan = pilihan.toUpperCase();
  if (!["A", "B", "C"].includes(pilihan)) {
    alert("Pilihan studio tidak valid.");
    queue.unshift(nama);
    updateAntrianUI();
    return;
  }

  // Cari kursi kosong di studio pilihan
  let kursi = cariKursiKosong(pilihan);
  if (kursi) {
    studioKursi[pilihan][kursi.baris][kursi.kolom] = nama;
    const nomorKursi = `${barisHuruf[kursi.baris]}${kursi.kolom + 1}`;
    alert(`${nama} mendapatkan kursi di Studio ${pilihan}, nomor kursi ${nomorKursi}`);
  } else {
    // Studio penuh, tawarkan ke studio lain yang ada kursi kosong
    const sisa = ["A", "B", "C"].filter(s => s !== pilihan);
    let dipindahkan = false;

    for (let studio of sisa) {
      if (cariKursiKosong(studio)) {
        const konfirmasi = confirm(`Studio ${pilihan} penuh. Apakah ${nama} ingin pindah ke Studio ${studio}?`);
        if (konfirmasi) {
          const cadangan = cariKursiKosong(studio);
          if (cadangan) {
            studioKursi[studio][cadangan.baris][cadangan.kolom] = nama;
            const nomorKursi = `${barisHuruf[cadangan.baris]}${cadangan.kolom + 1}`;
            alert(`${nama} mendapatkan kursi di Studio ${studio}, nomor kursi ${nomorKursi}`);
            dipindahkan = true;
            break;
          } else {
            alert(`Studio ${studio} juga penuh.`);
          }
        }
      }
    }

    if (!dipindahkan) {
      alert(`Maaf ${nama}, tiket habis. Silakan kembali besok.`);
    }
  }

  updateKursi();
}

function resetKursi() {
  for (let studio in studioKursi) {
    studioKursi[studio] = Array(4).fill(null).map(() => Array(6).fill(null));
  }
  updateKursi();
  queue.length = 0;
  updateAntrianUI();
}

// Init awal render
updateKursi();
updateAntrianUI();
