const QRCode = require('qrcode');

const website = 'https://zege-king-fastfood.mathewsumuni222.workers.dev';

QRCode.toFile(
  'public/zege-king-qr.png',
  website,
  {
    width: 1200,
    margin: 4,
    errorCorrectionLevel: 'H'
  },
  function (err) {
    if (err) throw err;
    console.log('');
    console.log('======================================');
    console.log('   ZEGE KING QR CODE CREATED!');
    console.log('======================================');
    console.log('Website:', website);
    console.log('QR File: public/zege-king-qr.png');
  }
);
