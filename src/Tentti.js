import logo from './logo.svg';
import './App.css';
import Kysymys from './Kysymys';

const Tentti = (props) => {
  return (
    <>
      <div className='Tentti'>{props.tentti.nimi}</div>

      {/* kun kaikki tentit läpikäydään, tulee seur. mapin suorituksen(eli kaikkien kysymysten)
      edellytyksenä tulee olla se, että ollaan piirtämässä aktiivista tenttiä, esim.
      jollain boolean arvolla tämä voidaan hoitaa jotta map suor. vain kun tentti.active
      valittuna */}
      <div>{props.tentti.kysymykset.map((kysymys, index) =>
        <Kysymys dispatch={props.dispatch} kysymysIndex={index} kysymys={kysymys} />)}
      </div>

    </>


  );
}

export default Tentti;
