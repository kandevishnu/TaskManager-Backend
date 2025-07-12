import Task from "../models/taskModel.js";

const determineStatus = (checklist) => {
  const total = checklist.length;
  const completed = checklist.filter((item) => item.done).length;

  if (total === 0 || completed === 0) return "pending";
  if (completed === total) return "completed";
  return "in progress";
};

export const createTask = async (req, res) => {
  const { title, description, priority, dueDate, checklist } = req.body;
  const userId = req.user.id;

  try {
    const processedChecklist =
      checklist && checklist.length > 0
        ? checklist
        : [{ text: title, done: false }];

    const status = determineStatus(processedChecklist);

    const newTask = new Task({
      userId,
      title,
      description,
      priority,
      dueDate,
      checklist: processedChecklist,
      status,
    });

    await newTask.save();

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ tasks, length: tasks.length });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, checklist } = req.body;

  try {
    const status = checklist ? determineStatus(checklist) : undefined;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        title,
        description,
        priority,
        dueDate,
        checklist,
        ...(status && { status }), 
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasksByStatus = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query; 

  try {
    if (!["pending", "in progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const tasks = await Task.find({ userId, status }).sort({ createdAt: -1 });
    res.status(200).json({ tasks, length: tasks.length });
  } catch (error) {
    console.error("Error filtering tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
