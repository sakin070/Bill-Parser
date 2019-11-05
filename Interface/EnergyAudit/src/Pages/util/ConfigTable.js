import React from 'react'

class ConfigTable extends React.Component{

    render() {
        return <div>
            <form>
                <label>
                    Configuration Identifier:
                    <input type="text" name="configID" />
                </label>
                
                <input type="submit" value="Submit" />
            </form>
        </div>
    }
}

function SectionField() {
    return <form>
        <div className="row">
            <div className="col">
                <input type="text" className="form-control" placeholder="Field Name"/>
            </div>
            <div className="col">
                <input type="text" className="form-control" placeholder="Location"/>
            </div>
        </div>
    </form>
}

export default ConfigTable
