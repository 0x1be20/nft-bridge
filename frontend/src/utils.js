import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default {
    'post':async (url,data={},headers={})=>{
        const params = new FormData();
        for(let i in data){
            params.append(i,data[i])
        }
        return axios.post(url,params,headers).then(response=>response.data)
    },
    'get':async (url,params={},headers={})=>{
        return axios.get(url,{'params':params}).then(response=>response.data)
    }
}