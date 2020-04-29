interface IUser {
    _id:string,
    name: string,
    username: string,
    email: string,
    password:string,
    address?:{
        city: string,
        street: string,
        country: string
    }
}

export default IUser;
