
import { Matrix } from './Matrix';
import './App.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  console.log(Date() + " - button start render");
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn"
    >
      {label}
    </button>
  );
};

function App() {
  console.log("app start render");
  return (
    <div className="App">
      <h1>Image Matrix</h1>
      <Matrix rows={2} cols={5} />
      <Button label="Click Me" onClick={() => alert('Button Clicked! Hey there :)')} /> 
    </div>
  );
} 

export { App };
