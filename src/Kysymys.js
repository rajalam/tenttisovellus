import logo from './logo.svg';
import './App.css';
import Vastausvaihtoehto from './Vastausvaihtoehto';

const Kysymys = (props) => {
  return (
    <>
      <div><b>{props.kysymys.nimi}</b></div>
      
      <div>
        {props.kysymys.vastausvaihtoehdot.map((vastausvaihtoehto, index) =>
          <Vastausvaihtoehto dispatch={props.dispatch}
          vastausvaihtoehtoIndex={index} 
          kysymysIndex={props.kysymysIndex}
          vastausvaihtoehto={vastausvaihtoehto} />)}
      </div>
      <div>
      <input type="button" onClick={(event) => {
          props.dispatch({
            type: "VASTAUS_VE_LISATTIIN",
            payload:
            {
              nimi: event.target.value,
              vastausvaihtoehtoIndex: props.vastausvaihtoehtoIndex,
              kysymysIndex: props.kysymysIndex
            }
          })
        }}
          value="+" />
      </div>   
    </>
  );
}

export default Kysymys;
