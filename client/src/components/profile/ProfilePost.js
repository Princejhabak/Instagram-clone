import React, {Component} from 'react';

class ProfilePost extends Component {

    render(){

        const {data} = this.props;

        return(
            <div className="col-md-4" style={{marginBottom: "32px"}}>
                <div className="thumbnail">
                    <img src={data.imageUrl} alt={data.username} className="img-responsive" width={"100%"} height={"300px"}/>
                </div>
            </div>
        );
    }

}

export default ProfilePost;