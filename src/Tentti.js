import logo from './logo.svg';
import './App.css';
import Kysymys from './Kysymys';

const Tentti = (props) => {
  return (
    <>
      <div className='Tentti'>{props.tentti.nimi}</div>

      <div>{props.tentti.kysymykset.map((kysymys, index) =>
        <Kysymys dispatch={props.dispatch} kysymysIndex={index} kysymys={kysymys} />)}
      </div>
      
    </>

    
  );
}

export default Tentti;
