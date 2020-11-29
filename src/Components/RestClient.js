// 컴포넌트 구조 변경시 사용할 예정
import axios from 'axios';

const TOKEN_KEY = "token"

class RestClient{
    isLoggedIn() {
        return this.getToken() !== null;
    }

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    removeToken() {
        return localStorage.removeItem(TOKEN_KEY)
    }

    login(email, password) {
        const LoginData = {email: email, password: password}
        return axios.post("/data/users/login", LoginData)
            .then((response) => this.setToken(response.data.auth_token));
    }

    logout() {
        return this.post("/data/users/logout", {}).then(() => localStorage.removeItem("token"));
    }

    get(url) {
        const config = {headers: {'Authorization': `Token ${this.getToken()}`}};
        return axios.get(url, config);
    }

    post(url, data) {
        const config = {headers: {'Authorization': `Token ${this.getToken()}`}};
        return axios.post(url, data, config);
    }
}

export default RestClient;