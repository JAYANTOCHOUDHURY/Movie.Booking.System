const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateTicketPDF(booking, user, show, movie, hall, theater) {
    const doc = new PDFDocument();

    const filePath = path.join(__dirname, `../temp/ticket-${booking._id}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Movie Ticket', { align: 'center' }).moveDown();

    doc.fontSize(14).text(`Name ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Movie: ${movie.title}`);
    doc.text(`Theater: ${theater.name}`);
    doc.text(`Hall: ${hall.name}`);
    doc.text(`Seats: ${booking.seatsBooked.join(', ')}`);
    doc.text(`Seats Type: ${booking.seatType}`);
    doc.text(`Date: ${new Date(show.startTime).toDateString()}`);
    doc.text(`Time: ${new Date(show.startTime).toLocaleTimeString()}`);
    doc.text(`Total Price: ₹${booking.totalPrice}`);

    doc.end();

    return filePath;
}
module.exports = generateTicketPDF;