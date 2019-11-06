import React from 'react'

class ConfigTable extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            lst : [{'name':'','location':''}]
        }
    }



    render() {
        return <div>
            <form>
                <label>
                    Configuration Identifier:
                    <input type="text" name="configID" />
                </label>
            </form>


            <br/>

        </div>
    }
}


export default ConfigTable
