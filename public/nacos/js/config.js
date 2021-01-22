
 let serverUrl="http://10.0.17.42:3000";
//  let serverUrl="http://10.0.18.14:8080/appi";
 let webUrl='http://10.0.17.119:8080';
//  let webUrl='http://10.0.18.14:8080';

//  let serverUrl="http://10.0.18.14:3000";


function getUrlParam(variable){
    // console.log(window.location.href)
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}