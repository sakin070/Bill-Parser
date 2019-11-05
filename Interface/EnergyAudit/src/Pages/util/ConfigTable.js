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

            {this.state.lst.map((d) => {
                return <form>
                    <div className="row">
                    <div className="col">
                    <input type="text" className="form-control" placeholder="Field Name" />
                    </div>
                <div className="col">
                    <input type="text" className="form-control" placeholder="Location" value={d.location}/>
                </div>
                </div>
            </form> })

            }
            <br/>
            <button type="button" className="btn btn-info">New Field</button>
            <br/>
            <button type="button" className="btn btn-success">Save Configuration</button>
        </div>
    }
}


export default ConfigTable
