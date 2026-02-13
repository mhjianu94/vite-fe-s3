import { useState } from "react";

interface Todo {
  id: string;
  content: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  function createTodo() {
    const content = inputValue.trim();
    if (content) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        content: content,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <main>
      <h1>My todos</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTodo()}
          placeholder="Enter todo content"
        />
        <button onClick={createTodo}>+ new</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p>No todos yet. Add one above!</p>}
    </main>
  );
}

export default App;
