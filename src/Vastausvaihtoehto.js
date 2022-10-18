import logo from './logo.svg';
import './App.css';

const Vastausvaihtoehto = (props) => {
  return (
    <div>
      
      {/* <div><input type='text' value=''>k</input></div> */}
      <div><input type="text" onChange={(event)=>
      { props.dispatch({ type:"VASTAUS_VE_NIMI_MUUTTUI",
      payload: 
      {
        nimi: event.target.value,
        vastausvaihtoehtoIndex: props.vastausvaihtoehtoIndex,
        kysymysIndex: props.kysymysIndex
      }
      })}}  
      value = {props.vastausvaihtoehto.nimi}/>
      </div>
      
    </div>
  );
}

export default Vastausvaihtoehto;
