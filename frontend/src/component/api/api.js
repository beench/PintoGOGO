// import React, { Component} from 'react';
// function postData(url = ``, data = {}) {
//     // Default options are marked with *
//       return fetch(url, {
//           method: "POST", // *GET, POST, PUT, DELETE, etc.
//           mode: "cors", // no-cors, cors, *same-origin
//           cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//           credentials: "same-origin", // include, same-origin, *omit
//           headers: {
//               "Content-Type": "application/json; charset=utf-8",
//               // "Content-Type": "application/x-www-form-urlencoded",
//           },
//           redirect: "follow", // manual, *follow, error
//           referrer: "no-referrer", // no-referrer, *client
//           body: JSON.stringify(data), // body data type must match "Content-Type" header
//       })
//         .then(res => res.status)
//     }


// export const RestClient = {
//     post: postData
// };
import axios from 'axios'

export function getFoodOrSnack(menu, isLoaded, path) {
  axios.get("/api/menus/" + path).then(res => {
    console.log("get ",menu)
    this.setState({
      [menu]: res.data,
      [isLoaded]: true
    });
  }).then(()=>{console.log("allmenus ",this.state[menu])})
}

export function getPackage(pack, isLoaded, path){
  axios.get("api/packages"+path).then(res => {
    console.log("get package")
    this.setState({
      [pack] : res.data,
      [isLoaded]: true
    });
  }).then(() => {console.log("package ",this.state[pack])})
}

export function getProfile(profile, isLoaded) {
  axios.get('/api/users/profile')
    .then(res => {
      console.log("get profile")
      this.setState({
        [profile]: res.data,
        [isLoaded]: true
      });
  }).then( () => {console.log(this.state[profile])});
}
