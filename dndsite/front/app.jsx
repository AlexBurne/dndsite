import React, { useState, useEffect } from 'react';

const App = () => {
  const [worlds, setWorlds] = useState([]);
  const [newWorld, setNewWorld] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchWorlds();
  }, []);

  const fetchWorlds = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/worlds`);
    const data = await res.json();
    setWorlds(data);
  };

  const addWorld = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/worlds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWorld),
    });
    setNewWorld({ name: '', description: '' });
    fetchWorlds();
  };

  const deleteWorld = async (id) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/worlds/${id}`, { method: 'DELETE' });
    fetchWorlds();
  };

  return (
    <div>
      <h1>D&D Worlds</h1>
      <div>
        <input
          type="text"
          placeholder="World Name"
          value={newWorld.name}
          onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })}
        />
        <textarea
          placeholder="World Description"
          value={newWorld.description}
          onChange={(e) => setNewWorld({ ...newWorld, description: e.target.value })}
        ></textarea>
        <button onClick={addWorld}>Add World</button>
      </div>
      <ul>
        {worlds.map((world) => (
          <li key={world._id}>
            <h3>{world.name}</h3>
            <p>{world.description}</p>
            <button onClick={() => deleteWorld(world._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
