import '../App.css';

const TenttiValikko = (props) => {

    return (
        <div className='tenttiValikko'>
            {props.tenttiListaData.map((tentti) => {
                return ( <div key={tentti.id} className='tenttiValikkoAlkio' onClick={ (event) => {
                    /* LISÄÄ onclick action tähän */
                }
                    
                }>
                    {tentti.nimi}
                </div> 
            )})}
        </div>
    );
}

export default TenttiValikko