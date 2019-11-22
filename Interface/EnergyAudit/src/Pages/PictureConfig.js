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
            configurationIdentifier: '',
            files:[],
            imgPath: '',
            rectList:[]
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.removeSelection = this.removeSelection.bind(this);
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

    removeSelection(key)  {


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

    stuff(){
        if(this.state.files.length === 0 ){
            return (
            <div>
                <label htmlFor="files" className="ui primary button">Select Image</label>
                <input id="files" style={{visibility:"hidden"}} type="file" accept="image/*" onChange={this.handleFileUpload}/>
            </div>
            );
        }
        else
            return ( <SelectionCanvas onSelect={this.addSelection} imgPath={this.state.imgPath} rectList={this.state.rectList}/>)
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    {this.stuff()}



                    {/*<button className="ui positive button" onChange={this.handleFileUpload}><input type="file" style={{visibility:'hidden'}}/>Positive Button</button>*/}
                    {/*<input type="file"  className="ui small button" onChange={this.handleFileUpload} placeholder='Chose image'/>*/}

                    <div className="col-lg-3">
                        <label>
                            Configuration Identifier:
                            <input type="text" className="form-control" name="configID" onChange={this.updateConfigurationIdentifierValue}/>
                        </label>
                        {/*<h4>Selections</h4>*/}
                        {this.state.selections.map((d,key) => {
                            return <form id={key}>
                                <div className="row">
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
                        <button type="button" className="btn btn-success" onClick={this.saveConfig}>Save Configuration</button>
                       <ConfigTable/>
                    </div>
                </div>
                {JSON.stringify(this.state, null, 2)}
            </div>

        )
    }
}
export default PictureConfig;
