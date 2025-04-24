const { pool } = require('../db');

class Vendedor {
    static async getAll() {
        const [results] = await pool.query('CALL sp_lisven()');
        return results[0];
    }

    static async getById(id) {
        try {
            const [results] = await pool.query('CALL sp_busven(?)', [id]);
            console.log('Resultado de la consulta:', results[0]); // Log para depuración
            return results[0]; // El primer elemento del array contiene los resultados
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    static async search(term) {
        const [results] = await pool.query('CALL sp_searchven(?)', [term]);
        return results[0];
    }

    static async create(nom_ven, apel_ven, cel_ven, id_distrito) {
        const [result] = await pool.query('CALL sp_ingven(?, ?, ?, ?)', [nom_ven, apel_ven, cel_ven, id_distrito || null]);
        return result[0][0].nuevo_id_vendedor;
    }

    static async update(id, nom_ven, apel_ven, cel_ven, id_distrito) {
        await pool.query('CALL sp_modven(?, ?, ?, ?, ?)', [id, nom_ven, apel_ven, cel_ven, id_distrito || null]);
        return true;
    }

    static async delete(id) {
        await pool.query('CALL sp_delven(?)', [id]);
        return true;
    }
}

module.exports = Vendedor; 