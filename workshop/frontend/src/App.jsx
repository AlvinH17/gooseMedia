import React, { useState, useEffect } from "react";

function App() {
  const [counter, setCounter] = useState(0); // setting up a counter var with initial value 0
  const [serverMsg, setServerMsg] = useState("1"); // setting up a serverMsg var with initial value ""

  const getCounter = async () => {
    // async means the app can keep running while waiting for the server to respond
    const response = await fetch("https://localhost:3000/counter");
    const data = await response.json();
    setCounter(data.counter);
  };

  const getServerMsg = async () => {
    const response = await fetch("https://localhost:3000/message");
    const message = await response.text();
    setServerMsg(message);
  };

  const addone = async () => {
    const response = await fetch("https://localhost:3000/increment", {
      method: "POST",
    });
    const data = await response.json();
    setCounter(data.counter);
  };

  const minusOne = async () => {
    const response = await fetch("https://localhost:3000/decrement", {
      method: "POST",
    });
    const data = await response.json();
    setCounter(data.counter);
  };

  const resetToZero = async () => {
    const response = await fetch("https://localhost:3000/reset", {
      method: "POST",
    });
    const data = await response.json();
    setCounter(data.counter);
  };

  useEffect(() => {
    getCounter();
    getServerMsg();
  }, []); // empty dependency array means this runs once on component mount

  return (
    <div>
      <h1>Change Plus Plus WorkShop</h1>
      <div>
        <h2>Server</h2>
        <p>{serverMsg}</p>
      </div>
      <h2>Counter: {counter}</h2>
      <button onClick={addone}>Add 1</button>
      <button onClick={minusOne}>Minus 1</button>
      <button onClick={resetToZero}>Reset</button>
      <button onClick={getCounter}>Refresh</button>
    </div>
  );
}

export default App;
