const Hall = require('../models/Hall');

exports.createHall = async function (req, res) {
  try {
    console.log("Request Body:", req.body);

    const { name, theater, totalSeats, seatTypes, seatMap } = req.body;

    let finalSeatMap = seatMap;

    // If seatMap is not provided, auto-generate it
    if (!seatMap || seatMap.length === 0) {
      finalSeatMap = generateSeatmap(seatTypes.normal, seatTypes.premium);
    }

    const newHall = new Hall({
      name,
      theater,
      totalSeats,
      seatTypes,
      seatMap: finalSeatMap,
      createdBy: req.user.userId
    });

    await newHall.save();

    res.status(201).json({ message: "Hall created successfully", hall: newHall });

  } catch (err) {
    res.status(500).json({ message: "Error creating hall", error: err.message });
  }
};

// Helper function to generate seat map
function generateSeatmap(normalCount, premiumCount) {
  const seatMap = [];

  for (let i = 1; i <= premiumCount; i++) {
    seatMap.push({ seatNumber: `P${i}`, seatType: 'premium' });
  }
  for (let i = 1; i <= normalCount; i++) {
    seatMap.push({ seatNumber: `N${i}`, seatType: 'normal' });
  }

  return seatMap;
}
