"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Todo, Status, Priority } from "@/types/todo";
import { Navigation } from "@/components/navigation";
import { TodoList } from "@/components/todo-app";
import { KanbanBoard } from "@/components/kanban-board";
import { YourGPT, useAIActions } from "@yourgpt/widget-web-sdk/react";
import { useTheme, type Theme } from "@/components/theme-provider";

// Initialize SDK
YourGPT.init({
  widgetId: process.env.NEXT_PUBLIC_WIDGET_ID || "",
});

interface ToolFunction {
  arguments: string;
  name: string;
}

interface ActionData {
  action: {
    tool: {
      function: ToolFunction;
    };
  };
}

interface AppProps {
  view: "list" | "kanban";
}

export function App({ view }: AppProps) {
  const currentView = view;
  const [todos, setTodos] = useState<Todo[]>([]);
  const { changeTheme } = useTheme();

  const aiActions = useAIActions();

  // Use callback to prevent infinite re-renders with useEffect
  const themeActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    const actionData = data as ActionData;
    const args = actionData.action?.tool?.function?.arguments || `{}`;
    const theme = JSON.parse(args).theme as Theme;

    changeTheme(theme);
    action.respond("Theme changed to " + theme);
  }, [changeTheme]);

  // Universal bulk delete function for todos based on status, category, and priority
  const bulkDeleteActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    const actionData = data as ActionData;
    const args = actionData.action?.tool?.function?.arguments || `{}`;
    let parsedArgs;
    try {
      parsedArgs = JSON.parse(args);
    } catch {
      action.respond("Error parsing arguments.");
      return;
    }

    const { status, category, priority } = parsedArgs;

    // If no filters provided, default to deleting only completed tasks for safety
    if (!status && !category && !priority) {
      setTodos((prevTodos) => {
        const remainingTodos = prevTodos.filter(todo => todo.status !== "done");
        const deletedCount = prevTodos.length - remainingTodos.length;
        action.respond(`Successfully deleted ${deletedCount} completed tasks.`);
        return remainingTodos;
      });
      return;
    }

    let deletedCount = 0;
    let filterText = "";

    setTodos((prevTodos) => {
      const remainingTodos = prevTodos.filter(todo => {
        // Check if todo matches any of the deletion criteria
        const matchesStatus = !status || todo.status === status;
        const matchesCategory = !category || todo.category === category;
        const matchesPriority = !priority || todo.priority === priority;

        // Keep todos that DON'T match all the specified criteria
        return !(matchesStatus && matchesCategory && matchesPriority);
      });

      deletedCount = prevTodos.length - remainingTodos.length;

      // Build response message
      const filters = [];
      if (status) filters.push(`status "${status.replace("_", " ")}"`);
      if (category) filters.push(`category "${category}"`);
      if (priority) filters.push(`${priority} priority`);

      filterText = filters.length > 0 ? ` with ${filters.join(", ")}` : "";

      return remainingTodos;
    });
    action.respond(`Successfully deleted ${deletedCount} task${deletedCount !== 1 ? 's' : ''}${filterText}.`);
  }, []);

  // Enhanced universal move function for todos with comprehensive fallbacks and natural language support
  const moveTodosActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    const actionData = data as ActionData;
    const args = actionData.action?.tool?.function?.arguments || `{}`;
    let parsedArgs;

    try {
      parsedArgs = JSON.parse(args);
    } catch {
      action.respond("❌ Error: Invalid command format. Please try again with a clear instruction like 'move tasks from todo to ongoing' or 'move media tasks from todo to done'.");
      return;
    }

    const { category, priority, from, to, task_ids } = parsedArgs;

    // Helper function to normalize status names (supports natural language)
    const normalizeStatus = (status: string): Status | null => {
      if (!status) return null;

      const statusMap: Record<string, Status> = {
        // Direct matches
        'todo': 'todo',
        'ongoing': 'ongoing',
        'done': 'done',
        // Natural language variations
        'to do': 'todo',
        'to-do': 'todo',
        'pending': 'todo',
        'backlog': 'todo',
        'todo board': 'todo',
        'to do board': 'todo',
        // Ongoing variations
        'in progress': 'ongoing',
        'in-progress': 'ongoing',
        'progress': 'ongoing',
        'working': 'ongoing',
        'active': 'ongoing',
        'ongoing board': 'ongoing',
        'in progress board': 'ongoing',
        // Done variations
        'complete': 'done',
        'completed': 'done',
        'finished': 'done',
        'complete board': 'done',
        'done board': 'done',
        'completed board': 'done'
      };

      return statusMap[status.toLowerCase().trim()] || null;
    };

    // Validate and normalize status parameters
    const fromStatus = normalizeStatus(from);
    const toStatus = normalizeStatus(to);

    if (!from || !to) {
      action.respond("❌ Error: Both 'from' and 'to' boards are required. Try saying something like:\n• 'Move tasks from todo to ongoing'\n• 'Move media tasks from backlog to in progress'\n• 'Move high priority tasks from todo to done'");
      return;
    }

    if (!fromStatus || !toStatus) {
      const validOptions = "• todo/to do/backlog/pending\n• ongoing/in progress/active/working\n• done/completed/finished";
      action.respond(`❌ Error: Invalid board name(s). Valid board names include:\n${validOptions}\n\nYou said: from "${from}" to "${to}"`);
      return;
    }

    if (fromStatus === toStatus) {
      action.respond(`❌ Error: Cannot move tasks from "${from}" to "${to}" - they're the same board! Please specify different source and destination boards.`);
      return;
    }

    // Validate priority if provided
    if (priority && !["low", "medium", "high"].includes(priority.toLowerCase())) {
      action.respond(`❌ Error: Invalid priority "${priority}". Valid priorities are: low, medium, high`);
      return;
    }

    const normalizedPriority = priority?.toLowerCase() as Priority;

    let movedCount = 0;
    let fromText = '';
    let toText = '';
    let filterText = '';

    setTodos((prevTodos) => {
      // First, find todos that match the criteria
      const matchingTodos = prevTodos.filter(todo => {
        const matchesStatus = todo.status === fromStatus;
        const matchesCategory = !category || todo.category?.toLowerCase() === category.toLowerCase();
        const matchesPriority = !normalizedPriority || todo.priority === normalizedPriority;
        const matchesTaskIds = !task_ids || task_ids.includes(todo.id);


        return matchesStatus && matchesCategory && matchesPriority && matchesTaskIds;
      });

      movedCount = matchingTodos.length;

      // If no matching todos found, provide helpful feedback
      if (movedCount === 0) {
        return prevTodos; // Don't update state if no changes
      }

      // Update matching todos
      const updatedTodos = prevTodos.map(todo => {
        const shouldMove = matchingTodos.some(mt => mt.id === todo.id);
        if (shouldMove) {
          return {
            ...todo,
            status: toStatus,
            updatedAt: new Date()
          };
        }
        return todo;
      });

      // Build descriptive text for response
      const filters = [];
      if (category) filters.push(`"${category}" category`);
      if (normalizedPriority) filters.push(`${normalizedPriority} priority`);
      if (task_ids?.length) filters.push(`specific task${task_ids.length > 1 ? 's' : ''}`);

      filterText = filters.length > 0 ? ` with ${filters.join(" and ")}` : "";
      fromText = from.charAt(0).toUpperCase() + from.slice(1);
      toText = to.charAt(0).toUpperCase() + to.slice(1);

      return updatedTodos;
    });

    // Enhanced response with fallbacks and suggestions
    if (movedCount === 0) {
      // Build helpful fallback response
      let fallbackMessage = `❌ No tasks found to move from ${fromText} to ${toText}`;

      if (category || normalizedPriority || task_ids) {
        fallbackMessage += `${filterText}`;
      }

      fallbackMessage += ".\n\n";

      // Provide helpful suggestions based on available data
      const todosByStatus = {
        todo: todos.filter(t => t.status === fromStatus),
        total: todos.length
      };

      if (todosByStatus.todo.length === 0) {
        fallbackMessage += `💡 There are no tasks in the ${fromText} board.`;
      } else {
        fallbackMessage += `💡 There ${todosByStatus.todo.length === 1 ? 'is' : 'are'} ${todosByStatus.todo.length} task${todosByStatus.todo.length !== 1 ? 's' : ''} in ${fromText}`;

        if (category) {
          const categoryTasks = todosByStatus.todo.filter(t => t.category?.toLowerCase() === category.toLowerCase());
          if (categoryTasks.length === 0) {
            const availableCategories = [...new Set(todosByStatus.todo.map(t => t.category).filter(Boolean))];
            fallbackMessage += `, but none with "${category}" category.`;
            if (availableCategories.length > 0) {
              fallbackMessage += `\n   Available categories: ${availableCategories.join(", ")}`;
            }
          }
        }

        if (normalizedPriority) {
          const priorityTasks = todosByStatus.todo.filter(t => t.priority === normalizedPriority);
          if (priorityTasks.length === 0) {
            const availablePriorities = [...new Set(todosByStatus.todo.map(t => t.priority))];
            fallbackMessage += `, but none with ${normalizedPriority} priority.`;
            fallbackMessage += `\n   Available priorities: ${availablePriorities.join(", ")}`;
          }
        }
      }

      // Suggest alternative move actions
      const allAvailableCategories = [...new Set(todosByStatus.todo.map(t => t.category).filter(Boolean))];
      fallbackMessage += "\n\n🔄 Try moving:\n";
      fallbackMessage += `• 'move all tasks from ${fromText.toLowerCase()} to ${toText.toLowerCase()}' (remove filters)\n`;
      if (allAvailableCategories.length > 0) {
        fallbackMessage += `• 'move ${allAvailableCategories[0]} tasks from ${fromText.toLowerCase()} to ${toText.toLowerCase()}'\n`;
      }
      fallbackMessage += "• Use different source/destination boards\n";
      fallbackMessage += "• Check spelling of category names and board names";

      action.respond(fallbackMessage);
      return;
    }

    // Success response with detailed information
    let successMessage = `✅ Successfully moved ${movedCount} task${movedCount !== 1 ? 's' : ''}${filterText} from ${fromText} to ${toText}!`;

    // Add context about remaining tasks
    const remainingInSource = todos.filter(t => t.status === fromStatus).length - movedCount;
    if (remainingInSource > 0) {
      successMessage += `\n\n📊 ${remainingInSource} task${remainingInSource !== 1 ? 's' : ''} still remain in ${fromText}.`;
    }

    // Add efficiency note for large moves
    if (movedCount > 5) {
      successMessage += `\n⚡ Efficiently processed ${movedCount} tasks in batch.`;
    }

    action.respond(successMessage);
  }, [todos]);

  const beastModeActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    changeTheme("forest");
    action.respond("🔥 Beast mode activated! 🔥");
  }, []);

  const deactivateBeastModeActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    changeTheme("light");
    action.respond("✨ Beast mode deactivated! Back to normal. ✨");
  }, []);

  // AI Action to read all todos from each board
  const readTodosActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    // Organize todos by board/status
    const todosByBoard = {
      todo: todos.filter(todo => todo.status === "todo"),
      ongoing: todos.filter(todo => todo.status === "ongoing"),
      done: todos.filter(todo => todo.status === "done")
    };

    const response = `📊 All Todo Boards:\n\n` +
      `🟡 TO DO (${todosByBoard.todo.length} tasks):\n` +
      (todosByBoard.todo.length === 0 ? "   No pending tasks\n" :
        todosByBoard.todo.map((todo, index) =>
          `   ${index + 1}. ${todo.title}${todo.category ? ` [${todo.category}]` : ""}`
        ).join("\n") + "\n") +
      `\n🔵 Ongoing (${todosByBoard.ongoing.length} tasks):\n` +
      (todosByBoard.ongoing.length === 0 ? "   No tasks in progress\n" :
        todosByBoard.ongoing.map((todo, index) =>
          `   ${index + 1}. ${todo.title}${todo.category ? ` [${todo.category}]` : ""}`
        ).join("\n") + "\n") +
      `\n🟢 DONE (${todosByBoard.done.length} tasks):\n` +
      (todosByBoard.done.length === 0 ? "   No completed tasks\n" :
        todosByBoard.done.map((todo, index) =>
          `   ${index + 1}. ${todo.title}${todo.category ? ` [${todo.category}]` : ""}`
        ).join("\n") + "\n");

    action.respond(response);
  }, [todos]);

  // Bulk create tasks function
  const createBulkTasksActionRef = useCallback((data: unknown, action: { respond: (message: string) => void }) => {
    const actionData = data as ActionData;
    const args = actionData.action?.tool?.function?.arguments || `{}`;
    let parsedArgs;
    try {
      parsedArgs = JSON.parse(args);
    } catch {
      action.respond("Error parsing arguments.");
      return;
    }

    const { from, to, category, priority, csv } = parsedArgs;

    // Function to parse CSV data
    const parseCSV = (csvData: string): { category: string; priority: string; title: string }[] => {
      const lines = csvData.trim().split('\n');
      const rows = [];

      // Skip header row and process data
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle CSV parsing with potential commas in task descriptions
        // Split by comma but be smart about it
        const firstCommaIndex = line.indexOf(',');
        const secondCommaIndex = line.indexOf(',', firstCommaIndex + 1);

        if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
          const category = line.substring(0, firstCommaIndex).trim();
          const priority = line.substring(firstCommaIndex + 1, secondCommaIndex).trim().toLowerCase();
          const title = line.substring(secondCommaIndex + 1).trim();

          rows.push({
            category,
            priority,
            title
          });
        }
      }
      return rows;
    };

    const tasks: Todo[] = [];
    const currentDate = new Date();

    // Check if CSV data is provided
    if (csv) {
      try {
        const csvRows = parseCSV(csv);

        if (csvRows.length === 0) {
          action.respond("Error: No valid rows found in CSV data.");
          return;
        }

        // Create tasks from CSV data
        csvRows.forEach((row, index) => {
          // Validate and normalize priority
          let taskPriority: Priority = "medium";
          if (["low", "medium", "high"].includes(row.priority)) {
            taskPriority = row.priority as Priority;
          }

          const newTask: Todo = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
            title: row.title,
            priority: taskPriority,
            status: "todo",
            createdAt: new Date(currentDate.getTime() + index), // Slightly different timestamps
            updatedAt: new Date(currentDate.getTime() + index),
            category: row.category || undefined,
          };

          tasks.push(newTask);
        });

        // Add all tasks to the todo list
        setTodos(prevTodos => [...tasks, ...prevTodos]);

        // Build response message for CSV import
        const taskCount = tasks.length;
        const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))];
        const priorities = [...new Set(tasks.map(t => t.priority))];

        action.respond(
          `Successfully created ${taskCount} task${taskCount !== 1 ? 's' : ''} from CSV data. ` +
          `Categories: ${categories.join(', ')}. ` +
          `Priorities: ${priorities.join(', ')}.`
        );
        return;

      } catch {
        action.respond("Error parsing CSV data. Please check the format.");
        return;
      }
    }

    // Original functionality for range-based task creation
    // Validate required parameters for range mode
    if (!from || !to) {
      action.respond("Error: Either provide 'csv' data for CSV import, or 'from' and 'to' parameters for range-based task creation.");
      return;
    }

    // Validate priority if provided
    if (priority && !["low", "medium", "high"].includes(priority)) {
      action.respond("Error: Invalid priority. Valid priorities are: low, medium, high");
      return;
    }

    // Create a task for each item in the range
    const fromNum = parseInt(from);
    const toNum = parseInt(to);

    if (isNaN(fromNum) || isNaN(toNum)) {
      action.respond("Error: 'from' and 'to' must be valid numbers.");
      return;
    }

    for (let i = fromNum; i <= toNum; i++) {
      const newTask: Todo = {
        id: `${Date.now()}-${i}`,
        title: `Task ${i}`,
        priority: (priority as Priority) || "medium",
        status: "todo",
        createdAt: currentDate,
        updatedAt: currentDate,
        category: category || undefined,
      };
      tasks.push(newTask);
    }

    // Add all tasks to the todo list
    setTodos(prevTodos => [...tasks, ...prevTodos]);

    // Build response message
    const taskCount = tasks.length;
    const filters = [];
    if (category) filters.push(`category "${category}"`);
    if (priority) filters.push(`${priority} priority`);


    const filterText = filters.length > 0 ? ` with ${filters.join(", ")}` : "";
    action.respond(`Successfully created ${taskCount} task${taskCount !== 1 ? 's' : ''}${filterText}.`);
  }, []);

  // Register the AI action only once when the component mounts
  useEffect(() => {
    aiActions.registerAction("change_theme", themeActionRef);
    aiActions.registerAction("bulk_delete", bulkDeleteActionRef);
    aiActions.registerAction("move_todos", moveTodosActionRef);
    aiActions.registerAction("create_bulk_tasks", createBulkTasksActionRef);
    aiActions.registerAction("beast_mode", beastModeActionRef);
    aiActions.registerAction("deactivate_beast_mode", deactivateBeastModeActionRef);
    aiActions.registerAction("read_todos", readTodosActionRef);

    return () => {
      aiActions.unregisterAction("change_theme");
      aiActions.unregisterAction("bulk_delete");
      aiActions.unregisterAction("move_todos");
      aiActions.unregisterAction("create_bulk_tasks");
      aiActions.unregisterAction("beast_mode");
      aiActions.unregisterAction("deactivate_beast_mode");
      aiActions.unregisterAction("read_todos");
    };
  }, []);



  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map(
          (
            todo: Todo & {
              createdAt: string;
              updatedAt: string;
              dueDate?: string;
            }
          ) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          })
        );
        setTodos(parsedTodos);
      } catch (error) {
        console.error("Error parsing todos from localStorage:", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) => {
      const existingTodoIndex = prevTodos.findIndex((todo) => todo.id === updatedTodo.id);

      if (existingTodoIndex >= 0) {
        // Update existing todo
        const newTodos = [...prevTodos];
        newTodos[existingTodoIndex] = updatedTodo;
        return newTodos;
      } else {
        // Add new todo
        return [updatedTodo, ...prevTodos];
      }
    });
  };

  const handleCreateTodo = (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} />

      <main className="container mx-auto px-0 py-8">
        <motion.div key={currentView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          {currentView === "list" ? (
            <TodoList todos={todos} onUpdateTodo={handleUpdateTodo} onCreateTodo={handleCreateTodo} onDeleteTodo={handleDeleteTodo} />
          ) : (
            <KanbanBoard todos={todos} onUpdateTodo={handleUpdateTodo} onCreateTodo={handleCreateTodo} onDeleteTodo={handleDeleteTodo} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
