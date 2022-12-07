import '../App.css';
import Kysymys from './Kysymys';


const TenttiMuokkaa = (props) => {

    return(
        <div className='tenttiMuokkaa'>
            
            <div className='kysymysLista'>{props.tenttiData.kysymykset.map((kysymys) => 
                
                <Kysymys dispatch={props.dispatch} kysymys={kysymys} key={kysymys.kysymys_id}
                    />)}
                
            </div>
        </div>
    );
}

export default TenttiMuokkaa