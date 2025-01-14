const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");

const swapDepartments = async (
  sourceItemId,
  sourceModel,
  newDepartmentId,
  previousDepartment
) => {
  try {
    if (sourceModel === "User") {
      const sourceItem = await User.findById(sourceItemId);
      if (sourceItem) {
        if (sourceItem.isManager) {
          sourceItem.department = newDepartmentId;
          await sourceItem.save();

          if (previousDepartment) {
            const oldDepartment = await Department.findById(previousDepartment);

            if (oldDepartment) {
              oldDepartment.manager = "";
              await oldDepartment.save();
            }
          }

          const newDepartment = await Department.findById(newDepartmentId);
          if (newDepartment) {
            newDepartment.manager = sourceItem._id.toString();
            await newDepartment.save();
          }
        } else {
          sourceItem.department = newDepartmentId;
          await sourceItem.save();

          if (previousDepartment) {
            const oldDepartment = await Department.findById(previousDepartment);

            if (oldDepartment) {
              oldDepartment.members = oldDepartment.members.filter(
                (memberId) => memberId.toString() !== sourceItemId.toString()
              );
              await oldDepartment.save();
            }
          }

          const newDepartment = await Department.findById(newDepartmentId);

          if (newDepartment) {
            if (!newDepartment.members.includes(sourceItemId)) {
              newDepartment.members.push(sourceItemId);
            }
            await newDepartment.save();
          }
        }
      }
    }
    if (sourceModel === "Service") {
      const sourceItem = await Service.findById(sourceItemId);
      if (sourceItem) {
        const oldDepartment = await Department.findById(sourceItem.department);
        if (oldDepartment) {
          if (oldDepartment.services.includes(sourceItemId)) {
            oldDepartment.services.pull(sourceItemId);
            await oldDepartment.save();
          }
        } else {
          ("");
        }

        const newDepartment = await Department.findById(newDepartmentId);
        if (newDepartment) {
          if (!newDepartment.services.includes(sourceItemId)) {
            newDepartment.services.push(sourceItemId);
            await newDepartment.save();
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

const swapPositions = async (userId, newPositionId, oldPositionId) => {
  if (oldPositionId !== newPositionId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        const oldPosition = await Position.findById(oldPositionId);

        if (oldPosition) {
          oldPosition.members = oldPosition.members.filter(
            (memberId) => memberId.toString() !== userId.toString()
          );
          await oldPosition.save();
        }

        const newPosition = await Position.findById(newPositionId);
        if (newPosition) {
          if (!newPosition.members.includes(userId)) {
            newPosition.members.push(userId);
          }
          await newPosition.save();
        }
      }
    } catch (error) {
      throw error;
    }
  }
};

const swapRoles = async (userId, newRoleId, oldRoleId) => {
  if (newRoleId !== oldRoleId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        const oldRole = await Role.findById(oldRoleId);

        if (oldRole) {
          oldRole.members = oldRole.members.filter(
            (memberId) => memberId.toString() !== userId.toString()
          );
          await oldRole.save();
        }

        const newRole = await Role.findById(newRoleId);
        if (newRole) {
          if (!newRole.members.includes(userId)) {
            newRole.members.push(userId);
          }
          await newRole.save();
        }
      }
    } catch (error) {
      throw error;
    }
  }
};

module.exports = {
  swapDepartments,
  swapPositions,
  swapRoles,
};
