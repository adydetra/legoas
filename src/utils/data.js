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

  getData() {
    const data = [];

    for (let i = 1; i <= 15; i++) {
      const status = i % 3 === 0 ? 'LUNAS' : (i % 2 === 0 ? 'KONFIRMASI' : 'PROSES');

      data.push(this.generateDataItem(
        i,
        `B2011600506${i}`,
        `KT 309${i} ABC`,
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

    return data;
  },
  getDataPiutangMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getDataPiutangXLarge() {
    return Promise.resolve(this.getData());
  },
};
