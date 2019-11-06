import React from "react"
import SelectionCanvas from "./util/SelectionCanvas";
import ConfigTable from "./util/ConfigTable";

class PictureConfig extends React.Component{
    inputValue = '';
    constructor(props){
        super(props);
        this.state = {
            selections: [],
            currentSelection:[],
            inputValue: ''
        }
    }

    addSelection = (rect) => {
        this.setState({currentSelection: [ rect]})
    };

    storeSelection = () =>{
        const currentSelection= this.state.currentSelection[0];
        const inputValue = this.state.inputValue;
        this.setState( oldState => ({selections: oldState.selections.concat({inputValue,currentSelection})}));
        this.setState({currentSelection:[]})
        if(!currentSelection){

        }

    };

    updateNameValue = (e) =>{
        this.setState ({inputValue:e.target.value,})
    };


    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col col-lg-9">
                       <SelectionCanvas onSelect={this.addSelection}/>
                        {JSON.stringify(this.state, null, 2)}
                    </div>
                    <div className="col col-lg-3">

                        {this.state.selections.map((d,key) => {
                            return <form id={key}>
                                <div className="row">
                                    <div  className="col">
                                        <input type="text" className="form-control" placeholder="Field Name" value={d.inputValue}/>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="Location" value={JSON.stringify(d.currentSelection, null, 2)}/>
                                    </div>
                                </div>
                            </form> })

                        }


                        {this.state.currentSelection.map((d,key) => {
                            return <form id={key}>
                                <div className="row">
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="Field Name" onChange={this.updateNameValue}/>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="Location" value={JSON.stringify(d, null, 2)}/>
                                    </div>
                                </div>
                            </form> })

                        }

                        <button type="button" className="btn btn-info" onClick={this.storeSelection}>Add Field</button>
                        <br/>
                        <button type="button" className="btn btn-success">Save Configuration</button>
                       <ConfigTable/>

                    </div>
                </div>
            </div>
        )
    }
}
export default PictureConfig

