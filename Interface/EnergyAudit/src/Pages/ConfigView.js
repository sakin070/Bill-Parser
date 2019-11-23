import React from "react";
import SelectionCanvas from "./util/SelectionCanvas";
import './PictureConfig.css'


class ConfigView extends React.Component{

  constructor(props){
    super(props);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:9999/selectionList', false);
    xhr.onload =  function ()  {
    };
    xhr.send();
    this.state = {
      selections:JSON.parse(xhr.responseText),
      selection:[],
      files:[],
      imgPath: '',
      rectList:[]
    };
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }


  parseTuple(t) {
    var items = t.replace(/^\(|\)$/g, "").split("),(");
    items.forEach(function(val, index, array) {
      array[index] = val.split(",").map(Number);
    });
    return items;
  }


  updateCanvas = (rectList) => {
    let i;
    let array = [];
    for(i=0; i<rectList.length; i++){
      let rect = this.parseTuple(rectList[i])[0];
      array = array.concat({'x':rect[0],'y':rect[1],'w':rect[2],'h':rect[3]});
    }
    this.setState({rectList:array}) ;
  };


  handleFileUpload(e) {
    let file = e.target.files[0]; // this is the file you want
    this.setState( oldState => ({files: oldState.files.concat(file)}));
    this.setState({imgPath:window.URL.createObjectURL(file)});
  }

  viewDecider(){
    if(this.state.files.length === 0 ){
      return (
          <div className="ui text container">
            <h2 className="ui header"> Configuration Viewer</h2>
            <p> To  see if any of the available templates fit your needs
            </p>

            <br/>
            <p>
              Upload the image you wish to validate against
              <ul>
                <label htmlFor="files" className="ui primary button">Select File</label>
                <input id="files" style={{visibility:"hidden"}} type="file" accept="image/*" onChange={this.handleFileUpload}/>
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
                <p>Available configurations</p>
                <div className="list-group" id="list-tab" role="tablist">
                  {Object.entries(this.state.selections).map((d,key) => {
                    return <div>
                      <button className="list-group-item list-group-item-action" id="list-home-list"  style={{marginBottom:'10px'}} data-toggle="list" role="tab" aria-controls="home" onClick={() => this.updateCanvas(Object.values(d[1]))}> {eval(JSON.stringify(d[0]))} </button>
                    </div>;
                  })}
                </div>
              </div>
            </div>
          </div>
      )
  }

  render() {
    return <div className="pictureContainer">
          {this.viewDecider()}
    </div>
  }
}
export default ConfigView;
