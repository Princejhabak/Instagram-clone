import React, {Component} from 'react';

import spinner from '../../assets/images/spinner.jpg';

class Spinner extends Component {

    render(){
        return(
            <img src={spinner} alt="spinner" width="100%" height="100%"style={{marginTop: "-96px"}}></img>
        );
    }

}

export default Spinner;