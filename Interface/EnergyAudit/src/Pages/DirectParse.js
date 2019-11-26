import React from 'react'
import SelectionCanvas from "./util/SelectionCanvas";
import ConfigTable from "./util/ConfigTable";
import './PictureConfig.css'

class DirectParse extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            selections: [],
            currentSelection:[],
            inputValue: '',
            files:[],
            imgPath: '',
            rectList:[],
            parsedText: '',
            inputList: []
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
        this.setState({inputList: this.state.inputList.concat(inputValue)});
        this.setState({currentSelection:[]});
        if(!currentSelection){

        }

    };

    updateNameValue = (e) =>{
        this.setState ({inputValue:e.target.value,})
    };
    parseFile = () =>{
        let str = "";
        for(let i=0;i<this.state.rectList.length;i++){
            const data = new FormData();
            data.append('section',  JSON.stringify(this.state.rectList[i]));
            data.append('imageSize', [855,900]);
            data.append('imagePath',this.state.files[0]);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:9999/direct-parse', false);
            xhr.onload = function () {
            };
            xhr.send(data);
            str = str.concat(this.state.inputList[i],": ",eval(xhr.responseText)+"\n");
        }
        this.setState({parsedText: str})
    };
    updateConfigurationIdentifierValue = (e) =>{
        this.setState ({configurationIdentifier:e.target.value,})
    };

    async handleFileUpload(e) {

        if (e.target.files[0].type === 'application/pdf') {
            const data = new FormData();
            data.append('file', e.target.files[0]);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:9999/create-images', false);
            xhr.onload = function () {
            };
            xhr.send(data);
            let lst = JSON.parse(xhr.responseText);
            console.log(lst);
            const path = e.target.files[0].name.slice(0, -4);
            let i = 0;
            while (i < lst.length) {
                const myHeaders = new Headers();

                const myInit = {
                    method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default'
                };
                const myRequest = new Request('http://127.0.0.1:9999/get-file/'.concat(path, '/', lst[i]), myInit);
                const response = await fetch(myRequest);
                const myBlob = await response.blob();
                const objectURL = window.URL.createObjectURL(myBlob);
                this.setState({imgPath: objectURL});
                console.log(objectURL);
                console.log(this.state);
                const file = new File([myBlob], lst[i]);
                this.setState(oldState => ({files: oldState.files.concat(file)}));
                i++
            }
        } else {
            let file = e.target.files[0]; // this is the file you want
            this.setState(oldState => ({files: oldState.files.concat(file)}));
            console.log(window.URL.createObjectURL(file));
            this.setState({imgPath: window.URL.createObjectURL(file)});
        }
    }

    viewDecider(){
        if(this.state.files.length === 0 ){
            return (
                <div className="ui text container">
                    <h2 className="ui header"> Direct Parsing</h2>
                    <p> If you need the text contained in your image
                    </p>

                    <br/>
                    <p>
                        <ul>
                            <li>You upload the image you wish to extract the text from</li>
                            <li>For each section you will like to parse</li>
                            <ul>
                                <li>Drag across the section of the image</li>
                                <li>Name the section</li>
                                <li>Click the add field button </li>
                            </ul>
                            <li>Click the parse button</li>
                            <li>Watch the text come out of the image</li>
                            <li>Start by  selecting the image</li>
                            <label htmlFor="files" className="ui primary button">Select File</label>
                            <input id="files" style={{visibility:"hidden"}} type="file" accept="image/*, application/pdf" onChange={this.handleFileUpload}/>
                        </ul>
                    </p>
                </div>
            );
        }
        else
            return (
                <div>
                    <div className="row">
                        <div >
                            <SelectionCanvas className="col-lg-9" onSelect={this.addSelection} imgPath={this.state.imgPath} rectList={this.state.rectList}/>
                        </div>
                        <div className="col-lg-3" style={{marginLeft:'10px'}}>
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
                                                let array3 = [...this.state.inputList]; // make a separate copy of the array
                                                array3.splice(key, 1);
                                                this.setState({selections: array, rectList:array2, inputList:array3});
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
                            <button type="button" className="btn btn-success" onClick={this.parseFile}>Parse File</button>
                            <ConfigTable/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-lg-11">
                            <form className="ui form">
                                <textarea placeholder="Parsed Text"  value={this.state.parsedText} style={{minHeight:'100px'}} rows="3"/>
                            </form>
                        </div>
                    </div>

                </div>
            )
    }

    render() {
        return(
            <div className="pictureContainer">
                {this.viewDecider()}
                {/*{JSON.stringify(this.state, null, 2)}*/}
            </div>

        )
    }
}

export  default DirectParse
