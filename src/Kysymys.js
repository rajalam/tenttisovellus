import logo from './logo.svg';
import './App.css';
import Vastausvaihtoehto from './Vastausvaihtoehto';

const Kysymys = (props) => {
  return (
    <div>{props.kysymys.nimi}
      
    </div>
    /* tänne Kysymys funktion sisään voi propseista kaivaa myös Vastausvaihtoehtojen tulostuksen, 
    ettei tarvitse sisäkkäisiä mappeja käyttää App.js:ssä, vt. Katrin ratkaisu */
    
  );
}

export default Kysymys;
