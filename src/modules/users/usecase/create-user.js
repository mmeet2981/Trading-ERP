module.exports = function ({
    userDb,
    hash,
    joi,
    createUserWisePermissionCall,
    config,
    UnknownError,
  }) {
    return async function createUser({ userData, createdBy, logger }) {
      const schema = joi.object({
        password: joi.string().min(4).max(30).required(),
        fullname: joi.string().max(50).required(),
        email: joi.string().email().max(40).required(),
        phone_number: joi.string().max(20).optional().allow(""),
        is_employee: joi.boolean().required(),
        employee_id: joi.string().allow(null).required(),
        designation: joi.string().allow("", null).required(),
        supervisor_emp_id: joi.string().optional().allow(""),
        unit: joi.string().max(2).required(),
        company_id: joi.number().required(),
        associated_with: joi.array().items(joi.number()).default([]),
        roles: joi.array().items(joi.string()).default([]),
        expires_at: joi.date(),
      });
  
      await schema.validateAsync(userData);
  
      const existingUser =
        await userDb.findUserByEmailAndEmployeeType({
          email: userData.email,
          employee_type: "ERP",
        });
  
      if (existingUser) {
        throw new UnknownError(
          "User with this email and employee type already exists"
        );
      }
  
      const createHash = hash();
      const hashedPassword = await createHash({
        data: userData.password,
        secret: config.secrets.registerUser,
      });
  
      const createdUser = await userDb.createUserEntry({
        userData: {
          password: hashedPassword,
          fullname: userData.fullname,
          email: userData.email,
          created_by: createdBy,
          phone_number: userData.phone_number || null,
          is_active: true,
          is_employee: userData.is_employee,
          employee_type: "ERP",
          employee_id: userData.employee_id,
          designation: userData.designation,
          supervisor_emp_id: userData.supervisor_emp_id || null,
          unit: userData.unit,
          company_id: userData.company_id,
          meta_data: {
            associated_with: userData.associated_with,
          },
          role: userData.roles?.[0] || "",
          expires_at: userData.expires_at,
        },
        logger,
      });
  
      if (userData.associated_with.length > 0) {
        const permissionsObject = {};
  
        userData.associated_with.forEach((locationId) => {
          permissionsObject[`unit_${locationId}`] = { read: true };
        });
  
        await createUserWisePermissionCall({
          logger,
          userId: createdUser.id,
          mainModuleName: "UNIT",
          permission: permissionsObject,
        });
      }
  
      return {
        success: true,
        message: "User created successfully",
        user: {
          id: createdUser.id,
          fullname: createdUser.fullname,
          email: createdUser.email,
          employee_id: createdUser.employee_id,
        },
      };
    };
  };
  