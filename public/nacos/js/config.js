
 let serverUrl="http://10.0.17.42:3000";
 let webUrl='http://127.0.0.1:8080';
//  let serverUrl="http://10.0.18.14:3000";


function getUrlParam(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}