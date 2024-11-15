const Agenda = require("../../models/models/Agenda");
const Counters = require("../../models/models/Counters");
const Department = require("../../models/models/Department");
const Job = require("../../models/models/Job");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Sale = require("../../models/models/Sale");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");

async function addRoutines(model, source) {
  try {
    const { department, position, role, members, manager } = source;
    switch (model) {
      case "User":
        if (department) {
          const updateField = source.isManager ? "manager" : "members";
          await Department.findByIdAndUpdate(department, {
            $set: { [updateField]: source._id.toString() },
          });
        }

        if (position) {
          await Position.findByIdAndUpdate(position, {
            $push: { members: source._id.toString() },
          });
        }

        if (role) {
          await Role.findByIdAndUpdate(role, {
            $push: { members: source._id.toString() },
          });
        }

        await Agenda.findOneAndUpdate(
          {},
          {
            $push: {
              users: {
                [source._id.toString()]: [],
              },
            },
          },
          { upsert: true }
        );

        const newUserPreferences = new UserPreferences({ userId: source._id });
        await newUserPreferences.save();

        break;
      case "Department":
        if (manager) {
          await User.findByIdAndUpdate(manager, {
            $set: { department: source._id.toString() },
          });
        }

        if (members && members.length > 0) {
          await Promise.all(
            members.map((memberId) =>
              User.findByIdAndUpdate(memberId, {
                $set: { department: source._id.toString() },
              })
            )
          );
        }
        break;
      case "Service":
        if (department) {
          await Department.findByIdAndUpdate(department, {
            $set: { services: source._id.toString() },
          });
        }
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}`, err);
  }
}

async function addCounter(sourceId, model) {
  try {
    let counter = await Counters.findOne();
    if (!counter) {
      counter = new Counters({
        job: model === "Job" ? 1 : 0,
        sale: model === "Sale" ? 1 : 0,
      });
    }
    let newNumber;

    switch (model) {
      case "Job":
        newNumber = counter.job + 1;
        counter.job = newNumber;
        await Job.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "Sale":
        newNumber = counter.sale + 1;
        counter.sale = newNumber;
        await Sale.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      default:
        throw new Error(`Modelo não suportado: ${model}`);
    }

    await counter.save();
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}:`, err);
  }
}

async function addToAssigneeAgenda(
  scheduledTo,
  scheduleTime,
  assignee,
  jobId,
  service
) {
  try {
    const agenda = await Agenda.findOne();

    if (!agenda) {
      throw new Error("Agenda não encontrada");
    }

    const userIndex = agenda.users.findIndex((map) => map.has(assignee));

    if (userIndex === -1) {
      throw new Error("O assignee não existe");
    }

    const userMap = agenda.users[userIndex];
    const tasksArray = userMap.get(assignee);

    tasksArray.push({
      jobId,
      service,
      scheduledTo,
      scheduleTime,
      status: "Aberto",
    });

    userMap.set(assignee, tasksArray);
    agenda.users[userIndex] = userMap;

    await agenda.save();

    await Job.findByIdAndUpdate(jobId, {
      $set: {
        scheduleInfo: {
          assignee,
          time: scheduleTime,
        },
      },
    });
  } catch (err) {
    console.error("Erro ao adicionar na agenda do designado");
  }
}

async function createQuote(model, source) {
  "";
}

module.exports = { addRoutines, createQuote, addCounter, addToAssigneeAgenda };
