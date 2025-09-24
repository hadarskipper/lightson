
import { Matrix } from './Matrix';
import './App.css';



function App() {
  console.log("app start render");
  return (
    <div className="App">
      <h1>Tiles removal game</h1>
      <Matrix rows={2} cols={5} />
    </div>
  );
} 

export { App };
