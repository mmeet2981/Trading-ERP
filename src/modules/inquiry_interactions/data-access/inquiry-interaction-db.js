module.exports = function ({
  sequelize,
  UnknownError,
  NotFoundError
}) {
  return {
    createInquiryInteraction,
    updateInquiryInteraction,
    deleteInquiryInteraction,
    validateInquiryExists,
    getUserById,
    getInquiryInteractionsById,
    sequelize
  };

  async function createInquiryInteraction({ interactionData, transaction, logger }) {
    const context = {
      operation: 'createInquiryInteraction',
      inquiryId: interactionData.inquiry_id,
      interactionType: interactionData.interaction_type
    };

    try {
      logger.debug(context, 'Creating inquiry interaction in database');

      const query = `
        INSERT INTO inquiry_interactions (
          inquiry_id, interaction_type, interaction_datetime,
          outcome, summary, follow_up_required,
          follow_up_datetime, follow_up_status, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        interactionData.inquiry_id,
        interactionData.interaction_type,
        interactionData.interaction_datetime || new Date(),
        interactionData.outcome || null,
        interactionData.summary || null,
        interactionData.follow_up_required || false,
        interactionData.follow_up_datetime || null,
        interactionData.follow_up_status || null,
        interactionData.created_by || null,
        new Date()
      ];

      const result = await sequelize.query(query, {
        bind: values,
        transaction,
        type: sequelize.QueryTypes.INSERT
      });

      const insertedRecord = result[0][0];
      logger.debug({ ...context, interactionId: insertedRecord.id }, 'Inquiry interaction created successfully');

      return insertedRecord;
    } catch (err) {
      logger.error({ ...context, error: err.message, stack: err.stack }, 'Error creating inquiry interaction');

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        const fkError = new Error('Foreign key constraint violation - check inquiry or user exists');
        fkError.name = 'ForeignKeyError';
        throw fkError;
      }

      throw new UnknownError('Failed to create inquiry interaction');
    }
  }

  async function validateInquiryExists({
    inquiryId,
    transaction,
    logger
  }) {
    const context = {
      operation: 'validateInquiryExists',
      inquiryId
    };

    try {
      logger.debug(context, 'Validating inquiry exists');

      const query = 'SELECT id, inquiry_code, status FROM inquiries WHERE id = $1 AND is_deleted = false';
      const result = await sequelize.query(query, {
        bind: [inquiryId],
        transaction,
        type: sequelize.QueryTypes.SELECT
      });

      if (!result[0]) {
        logger.warn(context, 'Inquiry not found');
        throw new NotFoundError('Inquiry not found');
      }

      logger.debug({ ...context, inquiryCode: result[0].inquiry_code, status: result[0].status }, 'Inquiry exists');
      return result[0];
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }

      logger.error({ ...context, error: err.message }, 'Error validating inquiry');
      throw new UnknownError('Failed to validate inquiry');
    }
  }

  async function getUserById({ userId, logger, transaction }) {
    const context = { operation: 'getUserById', userId };

    try {
      if (!userId) {
        logger.debug(context, 'No user ID provided, returning null');
        return null;
      }

      logger.debug(context, 'Getting user by ID');
      const query = 'SELECT * FROM users WHERE user_id = $1';

      const result = await sequelize.query(query, {
        bind: [userId],
        transaction,
        type: sequelize.QueryTypes.SELECT
      });

      const user = result[0] || null;
      logger.debug({ ...context, found: !!user }, user ? 'User found' : 'User not found');

      return user;
    } catch (err) {
      logger.error({ ...context, error: err.message }, 'Error getting user');
      throw new UnknownError('Failed to get user');
    }
  }

  async function updateInquiryInteraction({
    interactionId,
    updateData,
    transaction,
    logger
  }) {
    const context = {
      operation: 'updateInquiryInteraction',
      interactionId,
      updateFields: Object.keys(updateData)
    };

    try {
      logger.info(context, 'Updating inquiry interaction');

      // Build dynamic update query
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      // Add each field to update
      Object.keys(updateData).forEach((field) => {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
        paramCount++;
      });

      // Add interaction ID to values
      values.push(interactionId);

      const query = `
        UPDATE inquiry_interactions 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      logger.debug({ ...context, query, values }, 'Executing update query');

      const result = await sequelize.query(query, {
        bind: values,
        transaction,
        type: sequelize.QueryTypes.UPDATE
      });

      if (result[1] === 0) {
        logger.warn(context, 'Inquiry interaction not found for update');
        throw new NotFoundError('Inquiry interaction not found');
      }

      const updatedInteraction = result[0][0];
      logger.info({ ...context, updatedInteractionId: updatedInteraction.id }, 'Inquiry interaction updated successfully');

      return updatedInteraction;
    } catch (err) {
      logger.error({
        ...context,
        error: err.message,
        stack: err.stack
      }, 'Error updating inquiry interaction');

      if (err instanceof NotFoundError) {
        throw err;
      }

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        const fkError = new Error('Foreign key constraint violation - check inquiry or user exists');
        fkError.name = 'ForeignKeyError';
        throw fkError;
      }

      throw new UnknownError('Failed to update inquiry interaction');
    }
  }

  async function deleteInquiryInteraction({
    interactionId,
    transaction,
    logger
  }) {
    const context = {
      operation: 'deleteInquiryInteraction',
      interactionId
    };

    try {
      logger.info(context, 'Deleting inquiry interaction');

      const query = `
        DELETE FROM inquiry_interactions 
        WHERE id = $1
        RETURNING *
      `;

      // Use SELECT type for DELETE queries with RETURNING
      const result = await sequelize.query(query, {
        bind: [interactionId],
        transaction,
        type: sequelize.QueryTypes.SELECT
      });

      // For SELECT type, result is an array of rows
      if (result.length === 0) {
        logger.warn(context, 'Inquiry interaction not found for deletion');
        throw new NotFoundError('Inquiry interaction not found');
      }

      const deletedInteraction = result[0];
      logger.info({
        ...context,
        deletedInteractionId: deletedInteraction.id
      }, 'Inquiry interaction deleted successfully');

      return deletedInteraction;
    } catch (err) {
      logger.error({
        ...context,
        error: err.message,
        stack: err.stack
      }, 'Error deleting inquiry interaction');

      if (err instanceof NotFoundError) {
        throw err;
      }

      throw new UnknownError('Failed to delete inquiry interaction');
    }
  }

  async function getInquiryInteractionsById({
    inquiryId,
    filters = {},
    pagination = {},
    logger
  }) {
    const context = {
      operation: 'getInquiryInteractionsById',
      inquiryId,
      filters,
      pagination
    };

    try {
      logger.info(context, 'Fetching inquiry interactions by inquiry ID');

      // Build base query
      let query = `
        SELECT 
          ii.id,
          ii.inquiry_id,
          ii.interaction_type,
          ii.interaction_datetime,
          ii.outcome,
          ii.summary,
          ii.follow_up_required,
          ii.follow_up_datetime,
          ii.follow_up_status,
          ii.created_by,
          ii.created_at,
          u.full_name AS created_by_name,
          u.employee_code AS created_by_employee_code,
          u.user_role AS created_by_role,
          -- Get next interaction details
          LEAD(ii.interaction_type) OVER (ORDER BY ii.interaction_datetime) AS next_interaction_type,
          LEAD(ii.interaction_datetime) OVER (ORDER BY ii.interaction_datetime) AS next_interaction_datetime,
          -- Get previous interaction details
          LAG(ii.interaction_type) OVER (ORDER BY ii.interaction_datetime) AS prev_interaction_type,
          LAG(ii.interaction_datetime) OVER (ORDER BY ii.interaction_datetime) AS prev_interaction_datetime
        FROM inquiry_interactions ii
        LEFT JOIN users u ON ii.created_by = u.user_id
        WHERE ii.inquiry_id = $1
      `;

      const values = [inquiryId];
      let paramCount = 2; // Starting from 2 because $1 is inquiryId

      // Apply filters
      if (filters.interaction_type) {
        query += ` AND ii.interaction_type = $${paramCount}`;
        values.push(filters.interaction_type);
        paramCount++;
      }

      if (filters.outcome) {
        query += ` AND ii.outcome = $${paramCount}`;
        values.push(filters.outcome);
        paramCount++;
      }

      if (filters.follow_up_status) {
        query += ` AND ii.follow_up_status = $${paramCount}`;
        values.push(filters.follow_up_status);
        paramCount++;
      }

      if (filters.follow_up_required !== undefined) {
        query += ` AND ii.follow_up_required = $${paramCount}`;
        values.push(filters.follow_up_required);
        paramCount++;
      }

      if (filters.created_by) {
        query += ` AND ii.created_by = $${paramCount}`;
        values.push(filters.created_by);
        paramCount++;
      }

      // Date range filters
      if (filters.start_date) {
        query += ` AND DATE(ii.interaction_datetime) >= $${paramCount}`;
        values.push(filters.start_date);
        paramCount++;
      }

      if (filters.end_date) {
        query += ` AND DATE(ii.interaction_datetime) <= $${paramCount}`;
        values.push(filters.end_date);
        paramCount++;
      }

      if (filters.interaction_date) {
        query += ` AND DATE(ii.interaction_datetime) = $${paramCount}`;
        values.push(filters.interaction_date);
        paramCount++;
      }

      // Add sorting (default by interaction_datetime descending - latest first)
      const sortField = filters.sort_by || 'ii.interaction_datetime';
      const sortOrder = filters.sort_order === 'asc' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortField} ${sortOrder}`;

      // Add pagination
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;
      query += ` LIMIT $${paramCount}`;
      values.push(limit);
      paramCount++;

      query += ` OFFSET $${paramCount}`;
      values.push(offset);

      logger.debug({ ...context, query, values }, 'Executing inquiry interactions query');

      // Execute query
      const result = await sequelize.query(query, {
        bind: values,
        type: sequelize.QueryTypes.SELECT
      });

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total_count
        FROM inquiry_interactions ii
        WHERE ii.inquiry_id = $1
      `;

      const countValues = [inquiryId];
      let countParamCount = 2;

      // Apply same filters for count query
      if (filters.interaction_type) {
        countQuery += ` AND ii.interaction_type = $${countParamCount}`;
        countValues.push(filters.interaction_type);
        countParamCount++;
      }

      if (filters.outcome) {
        countQuery += ` AND ii.outcome = $${countParamCount}`;
        countValues.push(filters.outcome);
        countParamCount++;
      }

      if (filters.start_date) {
        countQuery += ` AND DATE(ii.interaction_datetime) >= $${countParamCount}`;
        countValues.push(filters.start_date);
        countParamCount++;
      }

      if (filters.end_date) {
        countQuery += ` AND DATE(ii.interaction_datetime) <= $${countParamCount}`;
        countValues.push(filters.end_date);
        countParamCount++;
      }

      const countResult = await sequelize.query(countQuery, {
        bind: countValues,
        type: sequelize.QueryTypes.SELECT
      });

      const totalCount = parseInt(countResult[0]?.total_count) || 0;

      // Format the response
      const formattedInteractions = result.map(interaction => {
        const formattedInteraction = {
          id: interaction.id,
          inquiry_id: interaction.inquiry_id,
          interaction_type: interaction.interaction_type,
          interaction_datetime: interaction.interaction_datetime,
          outcome: interaction.outcome,
          summary: interaction.summary,
          follow_up_required: interaction.follow_up_required,
          follow_up_datetime: interaction.follow_up_datetime,
          follow_up_status: interaction.follow_up_status,
          created_by: interaction.created_by,
          created_by_details: interaction.created_by ? {
            name: interaction.created_by_name,
            employee_code: interaction.created_by_employee_code,
            role: interaction.created_by_role
          } : null,
          created_at: interaction.created_at,
          next_interaction: interaction.next_interaction_type ? {
            type: interaction.next_interaction_type,
            datetime: interaction.next_interaction_datetime
          } : null,
          previous_interaction: interaction.prev_interaction_type ? {
            type: interaction.prev_interaction_type,
            datetime: interaction.prev_interaction_datetime
          } : null
        };

        // Calculate interaction duration if there's a previous interaction
        if (interaction.prev_interaction_datetime) {
          const currentTime = new Date(interaction.interaction_datetime);
          const prevTime = new Date(interaction.prev_interaction_datetime);
          const durationMs = currentTime - prevTime;
          const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
          const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

          formattedInteraction.time_since_previous = {
            hours: durationHours,
            minutes: durationMinutes,
            total_minutes: Math.floor(durationMs / (1000 * 60))
          };
        }

        return formattedInteraction;
      });

      logger.info({
        ...context,
        count: formattedInteractions.length,
        totalCount
      }, 'Inquiry interactions fetched successfully');

      return {
        interactions: formattedInteractions,
        pagination: {
          limit,
          offset,
          total: totalCount,
          page: Math.floor(offset / limit) + 1,
          total_pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (err) {
      logger.error({
        ...context,
        error: err.message,
        stack: err.stack
      }, 'Error fetching inquiry interactions by inquiry ID');
      throw new UnknownError('Failed to fetch inquiry interactions');
    }
  }
};

