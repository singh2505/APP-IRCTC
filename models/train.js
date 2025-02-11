class Train {
  constructor({ name, source, destination, totalSeats }) {
    this.name = name;
    this.source = source;
    this.destination = destination;
    this.totalSeats = totalSeats;
    this.availableSeats = totalSeats;
  }

  static async create(newTrain) {
    const query = "INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)";
    const values = [newTrain.name, newTrain.source, newTrain.destination, newTrain.totalSeats, newTrain.totalSeats];

    try {
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findBySourceAndDestination(source, destination) {
    const query = "SELECT * FROM trains WHERE source = ? AND destination = ?";

    try {
      const [rows] = await db.query(query, [source, destination]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateAvailableSeats(trainId, newAvailableSeats) {
    const query = "UPDATE trains SET available_seats = ? WHERE id = ?";

    try {
      const [result] = await db.query(query, [newAvailableSeats, trainId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findById(trainId) {
    const query = "SELECT * FROM trains WHERE id = ?";

    try {
      const [rows] = await db.query(query, [trainId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Train;