'use strict';

module.exports = function ({ sequelize }) {
  return {
    createDepartment,
    findDepartmentById,
    findDepartmentByName,
    getDepartments,
    updateDepartment,
    deleteDepartment,
  };

  /* ---------------------------------------------------- */
  /* Create Department                                   */
  /* ---------------------------------------------------- */
  async function createDepartment({ department_name, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        INSERT INTO departments (department_name)
        VALUES ($1)
        RETURNING 
          department_id, 
          department_name,
          "createdAt", 
          "updatedAt"
        `,
        {
          bind: [department_name],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Find Department By ID                               */
  /* ---------------------------------------------------- */
  async function findDepartmentById({ department_id, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        SELECT 
          department_id, 
          department_name,
          "createdAt", 
          "updatedAt"
        FROM departments
        WHERE department_id = $1
        `,
        {
          bind: [department_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Find Department By Name                             */
  /* ---------------------------------------------------- */
  async function findDepartmentByName({ department_name, exclude_id = null, logger }) {
    try {
      let query = `
        SELECT department_id
        FROM departments
        WHERE department_name = $1
      `;
      
      const bindParams = [department_name];
      
      if (exclude_id) {
        query += ` AND department_id != $${bindParams.length + 1}`;
        bindParams.push(exclude_id);
      }
      
      query += ` LIMIT 1`;

      const [row] = await sequelize.query(
        query,
        {
          bind: bindParams,
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Get All Departments                                 */
  /* ---------------------------------------------------- */
  async function getDepartments({ logger }) {
    try {
      return await sequelize.query(
        `
        SELECT 
          department_id, 
          department_name,
          "createdAt", 
          "updatedAt"
        FROM departments
        ORDER BY department_name ASC
        `,
        { type: sequelize.QueryTypes.SELECT }
      );
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Update Department                                   */
  /* ---------------------------------------------------- */
  async function updateDepartment({ 
    department_id,
    department_name, 
    logger 
  }) {
    try {
      const [row] = await sequelize.query(
        `
        UPDATE departments
        SET 
          department_name = $1,
          "updatedAt" = now()
        WHERE department_id = $2
        RETURNING 
          department_id, 
          department_name,
          "createdAt", 
          "updatedAt"
        `,
        {
          bind: [department_name, department_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Delete Department                                   */
  /* ---------------------------------------------------- */
  async function deleteDepartment({ department_id, logger }) {
    try {
      const rows = await sequelize.query(
        `
        DELETE FROM departments
        WHERE department_id = $1
        RETURNING department_id
        `,
        {
          bind: [department_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return rows.length > 0;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }
};