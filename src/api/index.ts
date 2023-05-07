import Axios from 'axios';

const request = Axios.create({
    baseURL: 'https://ai.mmaozi.com/',
});

export default request;
