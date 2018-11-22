import React, { Component } from "react";
import "../package.css";
import axios from "axios";
import NoPackage from "../nopackage";
import LinkWithPrev from "../../LinkWithPrev/linkwithprev.js";

export default class Pack5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      isLoaded: false
    };
    this.createDivPackage = this.createDivPackage.bind(this);
  }

  componentDidMount() {
    axios
      .get("api/packages/system/5days")
      .then(res => {
        this.setState({
          packages: res,
          isLoaded: true
        });
      })
      .then(() => {
        console.log("package", this.state.packages.data);
      });
  }

  createDivPackage(curPack) {
    let divpk = (
      <React.Fragment>
        <div className="set-each-package row">
          <div className="col-sm-4">
            <img
              className="img-pack"
              src={curPack.day_meal[0].meal_1.img_url}
            />
          </div>
          <div className="col-sm dis-grid">
            <div>
              <p className="name-each-pks">{curPack.name_package}</p>
              <p>{curPack.description}</p>
            </div>
            <LinkWithPrev to={"/5days/" + curPack._id}>
              <button className="btn view-pks">View Package</button>
            </LinkWithPrev>
          </div>
        </div>
      </React.Fragment>
    );
    return divpk;
  }

  render() {
    if (!this.state.isLoaded) {
      return <div className="loader" />;
    }
    if (!this.state.packages.data[0]) {
      return <NoPackage />;
    }

    const listPackages = this.state.packages.data.map((pk, index) => (
      <div key={index}>{this.createDivPackage(pk)}</div>
    ));

    return <React.Fragment>{listPackages}</React.Fragment>;
  }
}
