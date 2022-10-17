import logo from './logo.svg';
import './App.css';
import Vastausvaihtoehto from './Vastausvaihtoehto';

const Kysymys = (props) => {
  return (
    <>
      <div>{props.kysymys.nimi}</div>
      
      <div>
        {props.kysymys.vastausvaihtoehdot.map(vastausvaihtoehto =>
          <Vastausvaihtoehto vastausvaihtoehto={vastausvaihtoehto} />)}
      </div>

    </>
  );
}

export default Kysymys;
