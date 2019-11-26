import React from "react";
import SelectionCanvas from "./util/SelectionCanvas";
import ConfigTable from "./util/ConfigTable";
import './PictureConfig.css'
import {useHistory} from "react-router-dom";
class PictureConfig extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selections: [],
            currentSelection:[],
            inputValue: '',
            configurationIdentifier: '',
            files:[],
            imgPath: '',
            rectList:[]
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
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
        this.setState({rectList: this.state.rectList.concat(currentSelection)});
        this.setState({currentSelection:[]});
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
            selections[this.state.selections[i]["inputValue"]]  =  this.rectToTupple(this.state.selections[i]["currentSelection"])
        }
        const data = new FormData();
        data.append('selectionDictionary', JSON.stringify({ selections}).replace("selections",this.state.configurationIdentifier));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:9999/add-selection', true);
        xhr.onload = function () {
            // do something to response
            console.log(this.responseText);
        };
        xhr.send(data);
    };

    updateNameValue = (e) =>{
        this.setState ({inputValue:e.target.value,})
    };

    updateConfigurationIdentifierValue = (e) =>{
        this.setState ({configurationIdentifier:e.target.value,})
    };

    handleFileUpload(e) {
        let file = e.target.files[0]; // this is the file you want
        this.setState( oldState => ({files: oldState.files.concat(file)}));
        this.setState({imgPath:window.URL.createObjectURL(file)});
        window.URL.createObjectURL(file);
        // this.setState({files: this.state.files.concat(file)});
        console.log(window.URL.createObjectURL(file));

        // let reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function (e) {
        //     let image = new Image();
        //     image.src = e.target.result;
        //     image.onload = function() {
        //         // this.setState({imgPath:image.src});
        //         console.log((image.src));
        //
        //     }.bind(this);
        //     }.bind(this);
        // do the rest here
    }
    viewDecider(){
        if(this.state.files.length === 0 ){
            return (
                <div className="ui text container">
                    <h2 className="ui header">Create a new set of configuration selections</h2>
                    <p> You only need to create a configuration if you have a lot of files to parse and the files share the
                        same structure but different content. Otherwise you should try our direct parse
                    </p>

                    <br/>
                    <p>
                        To create a new configuration
                        <ul>
                            <li>First you have to upload an image to base the configuration off of</li>
                            <li>For each section you will like to include in the configuration</li>
                            <ul>
                                <li>Drag across the section of the image</li>
                                <li>Name the section</li>
                                <li>Click the add field button </li>
                            </ul>
                            <li> Input the name you would like the configuration to be stored under</li>
                            <li>Click the save configuration button</li>
                            <li>Start by  selecting the file to template</li>
                                <label htmlFor="files" className="ui primary button">Select File</label>
                                <input id="files" style={{visibility:"hidden"}} type="file" accept="image/*" onChange={this.handleFileUpload}/>
                        </ul>
                    </p>
                </div>
            );
        }
        else
            return (
                <div className="row">
                    <div >
                        <SelectionCanvas className="col lg-9" onSelect={this.addSelection} imgPath={this.state.imgPath} rectList={this.state.rectList}/>
                    </div>
                    <div className="col-lg-3" style={{marginLeft:'10px'}}>
                        <label>
                            Configuration Identifier:
                            <input type="text" className="form-control" name="configID" onChange={this.updateConfigurationIdentifierValue}/>
                        </label>
                        {/*<h4>Selections</h4>*/}
                        {this.state.selections.map((d,key) => {
                            return <form id={key}>
                                <div className="row" style={{marginBottom:'5px'}}>
                                    <div  className="col">
                                        <input type="text" className="form-control" placeholder="Field Name" value={d.inputValue}/>
                                    </div>
                                    <div className='col'>
                                        <button type="button" className="btn btn-info" onClick={() => {
                                            let array = [...this.state.selections]; // make a separate copy of the array
                                            array.splice(key, 1);
                                            let array2 = [...this.state.rectList]; // make a separate copy of the array
                                            array2.splice(key, 1);
                                            this.setState({selections: array, rectList:array2});
                                        }}>Remove</button>
                                        <input type="hidden" className="form-control" placeholder="Location" value={JSON.stringify(d.currentSelection, null, 2)}/>
                                    </div>
                                </div>
                            </form> })
                        }
                        <br/>
                        {this.state.currentSelection.map((d,key) => {
                            return <form id={key}>
                                <div className="row">
                                    {/*<h4>New Field</h4>*/}
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="Field Name" onChange={this.updateNameValue}/>
                                    </div>
                                    <div className='col'>
                                        <button type="button" className="btn btn-info" onClick={this.storeSelection}>Add Field</button>
                                        <input type="text" style={{display:'none'}} className="form-control" placeholder="Location" value={JSON.stringify(d, null, 2)}/>
                                    </div>
                                </div>
                            </form>
                        })
                        }
                        <br/>
                        <button type="button" className="btn btn-success" onClick={this.saveConfig} >Save Configuration</button>
                        <ConfigTable/>
                    </div>
                </div>
            )
    }

    render() {
        return(
            <div className="pictureContainer">
                {this.viewDecider()}
            </div>

        )
    }
}
export default PictureConfig;
