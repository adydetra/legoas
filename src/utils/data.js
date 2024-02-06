export const DataPiutangService = {
  generateDataItem(id, kewajiban, polisi, pemilik, peserta, va, hargaTerbentuk, biayaAdmin, ppn, lelang, jatuhTempo, lunas, status) {
    return {
      id,
      nomor: { kewajiban, polisi },
      pemilik,
      peserta,
      va,
      hargaTerbentuk,
      biayaAdmin,
      ppn,
      total: hargaTerbentuk + biayaAdmin + ppn,
      tanggal: { lelang, jatuhTempo, lunas },
      status,
    };
  },

  generateRandomPolisi() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters1 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomLetters2 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomLetters3 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomLetters4 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${randomLetters1} ${randomDigits} ${randomLetters2}${randomLetters3}${randomLetters4}`;
  },

  getData() {
    const storedData = JSON.parse(localStorage.getItem('dataPiutang')) || [];

    if (storedData.length === 0) {
      const data = [];

      for (let i = 1; i <= 15; i++) {
        const status = i % 3 === 0 ? 'LUNAS' : (i % 2 === 0 ? 'KONFIRMASI' : 'PROSES');
        const randomPolisi = this.generateRandomPolisi();

        data.push(this.generateDataItem(
          i,
          `B2011600506${i}`,
          randomPolisi,
          `PT XYZ ${i}`,
          `Peserta ${i}`,
          `9562100001245${i}`,
          1000000 * i,
          50000 * i,
          20000 * i,
          `01/01/2022`,
          `15/01/2022`,
          status === 'LUNAS' ? `10/01/2022` : '-',
          status,
        ));
      }

      localStorage.setItem('dataPiutang', JSON.stringify(data));
      return data;
    }

    return storedData;
  },

  getDataPiutangMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getDataPiutangXLarge() {
    return Promise.resolve(this.getData());
  },
};
