import './App.css';
import FooterPage from './components/FooterPage';
import Menubar from './components/Menubar';

function App() {
  const baseName = process.env.PUBLIC_URL;
  return (
    <div>
      <img src={`${baseName}/home.jpg`} width='100%'/>
      <Menubar/>      
      <FooterPage/>
    </div>
  );
}

export default App;
