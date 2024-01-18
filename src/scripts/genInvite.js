export function generatePDF(id, userName) {
    const pdfDoc = new jsPDF();

    const qrCodeContent = `https://authtest-chi.vercel.app/html/${id}.html`;
    const qrCodeContainer = document.createElement('div');
    const qrCode = new QRCode(qrCodeContainer, {
      text: qrCodeContent,
      width: 50,
      height: 50
    });

    const img = new Image();
    img.src = './src/pic/invite.jpg';

    const imgWidth = pdfDoc.internal.pageSize.getWidth();
    const imgHeight = pdfDoc.internal.pageSize.getHeight();
    pdfDoc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

    const qrCodeDataUrl = qrCodeContainer.firstChild.toDataURL('image/png');

    pdfDoc.addImage(qrCodeDataUrl, 'PNG', imgWidth / 2 - 25, imgHeight / 2 + 35, 50, 50);

    pdfDoc.save(`convite-de-${userName}.pdf`);
}
export function generatePDFWithList(id, userName, giftWillSend) {

    const pdfDoc = new jsPDF();

    const qrCodeContent = `https://authtest-chi.vercel.app/html/${id}.html`;
    const qrCodeContainer = document.createElement('div');
    const qrCode = new QRCode(qrCodeContainer, {
      text: qrCodeContent,
      width: 50,
      height: 50
    });

    const img = new Image();
    img.src = './src/pic/invite.jpg';

    const imgWidth = pdfDoc.internal.pageSize.getWidth();
    const imgHeight = pdfDoc.internal.pageSize.getHeight();
    pdfDoc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

    const qrCodeDataUrl = qrCodeContainer.firstChild.toDataURL('image/png');

    pdfDoc.addImage(qrCodeDataUrl, 'PNG', imgWidth / 2 - 25, imgHeight / 2 + 35, 50, 50);

    pdfDoc.addPage();

    const items = giftWillSend;
    pdfDoc.setFontSize(12);
    pdfDoc.text(20, 20, 'Lista de Presentes:');
    for (let i = 0; i < items.length; i++) {
      pdfDoc.text(20, 40 + i * 10, `${i + 1}. ${items[i]}`);
    }

    pdfDoc.save(`convite-de-${userName}`);
  }
