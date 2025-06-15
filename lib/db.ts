import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Función connectToDatabase para compatibilidad con las rutas API
export async function connectToDatabase() {
  return pool;
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Objeto db para compatibilidad con Prisma-style
export const db = {
  reservation: {
    create: async (data: { data: any }) => {
      const {
        reservationNumber, eventId, eventTitle, firstName, lastName, email, phone,
        birthDate, nationality, emergencyContact, emergencyPhone, roomType,
        dietaryRestrictions, medicalConditions, experience, motivation,
        additionalOptions, paymentMethod, totalPrice, status, newsletter
      } = data.data;

      const query = `
        INSERT INTO reservations (
          reservation_number, event_id, event_title, first_name, last_name, email, phone,
          birth_date, nationality, emergency_contact, emergency_phone, room_type,
          dietary_restrictions, medical_conditions, experience, motivation,
          additional_options, payment_method, total_price, status, newsletter
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        reservationNumber, eventId, eventTitle, firstName, lastName, email, phone,
        birthDate, nationality, emergencyContact, emergencyPhone, roomType,
        dietaryRestrictions, medicalConditions, experience, motivation,
        additionalOptions, paymentMethod, totalPrice, status, newsletter
      ];

      const result = await executeQuery(query, params);
      return { id: (result as any).insertId, ...data.data };
    },

    findMany: async (options: any = {}) => {
      let query = 'SELECT * FROM reservations';
      let params: any[] = [];

      if (options.orderBy?.createdAt) {
        query += ' ORDER BY created_at ' + (options.orderBy.createdAt === 'desc' ? 'DESC' : 'ASC');
      }

      const results = await executeQuery(query, params);
      return results;
    },

    findUnique: async (options: { where: { id: number } }) => {
      const query = 'SELECT * FROM reservations WHERE id = ?';
      const results = await executeQuery(query, [options.where.id]) as any[];
      return results[0] || null;
    },

    update: async (options: { where: { id: number }, data: any }) => {
      const { status, updatedAt } = options.data;
      const query = 'UPDATE reservations SET status = ?, updated_at = ? WHERE id = ?';
      await executeQuery(query, [status, updatedAt || new Date(), options.where.id]);
      return { id: options.where.id, ...options.data };
    }
  }
};
