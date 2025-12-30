const TABLE_NAME = "users";

module.exports = function ({ db }) {
  return {
    createUser,
  };

  async function createUser({
    id,
    email,
    phoneNumber,
    password,
    fullname,
    createdBy,
    metaData = {},
    isActive = false,
    employee_type,
    employeeId,
    logger
}) {
    try {
        const query = `
            INSERT INTO ${TABLE_NAME} (
                email, 
                phone_number, 
                password, 
                fullname, 
                created_by,
                created_at,
                meta_data,
                is_active,
                employee_type,
                employee_id
            ) VALUES ($1, $2, $3, $4, $5, NOW(), '{}', $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            email || null,
            phoneNumber || null,
            password,
            fullname,
            createdBy,
            isActive,
            employee_type,
            employeeId
        ];
        const result = await cockroachDb.query(query, values);
        return result.rows[0];
    } catch (err) {
        logger.error(err.message);
        logger.error("Error creating user:")
        throw new UnknownError("Failed to create user");
    }
}
};
