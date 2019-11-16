import React from "react";
import SelectionCanvas from "./util/SelectionCanvas";
import ConfigTable from "./util/ConfigTable";

class PictureConfig extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selections: [],
            currentSelection:[],
            inputValue: '',
            configurationIdentifier: ''
        }
    }

    addSelection = (rect) => {
        if(rect["w"] > 6 && rect["h"]>6){
            this.setState({currentSelection: [ rect]})
        }

    };

    storeSelection = () =>{
        const currentSelection= this.state.currentSelection[0];
        const inputValue = this.state.inputValue;
        this.setState( oldState => ({selections: oldState.selections.concat({inputValue,currentSelection})}));
        this.setState({currentSelection:[]})
        if(!currentSelection){

        }

    };

    rectToTupple(rect){
        return [rect["x"],rect["y"],rect["w"],rect["h"]]
    }
    saveConfig = () =>{
        let selections = {};
        let i;
        for (i = 0; i < this.state.selections.length; i++) {
            selections[this.state.selections[i]["inputValue"]]  =  this.rectToTupple(this.state.selections[i]["currentSelection"]);
        }
        console.log(JSON.stringify(this.state.selections, null, 2));
        console.log(JSON.stringify(selections, null, 2));
        const data = new FormData();
        data.append('selectionDictionary', JSON.stringify({ selections}).replace("selections",this.state.configurationIdentifier));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:9999/add-selection', true);
        xhr.onload = function () {
            // do something to response
            console.log(this.responseText);
        };
        xhr.send(data)
    };

    updateNameValue = (e) =>{
        this.setState ({inputValue:e.target.value,})
    };

    updateConfigurationIdentifierValue = (e) =>{
        this.setState ({configurationIdentifier:e.target.value,})
    };


    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                       <SelectionCanvas onSelect={this.addSelection}/>
                        {JSON.stringify(this.state, null, 2)}
                    </div>
                    <div className="col-lg-3">
                        <label>
                            Configuration Identifier:
                            <input type="text" name="configID" onChange={this.updateConfigurationIdentifierValue}/>
                        </label>
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
                                    <div className='col'>
                                        <button type="button" className="btn btn-info" onClick={this.storeSelection}>Add Field</button>
                                    </div>
                                </div>
                            </form>
                        })
                        }
                        <br/>
                        <button type="button" className="btn btn-success" onClick={this.saveConfig}>Save Configuration</button>
                       <ConfigTable/>
                    </div>
                </div>
            </div>
        )
    }
}
export default PictureConfig;
