import { ObjectId } from "bson";

export class User {
  login: string;
  avatar_url: string;
  email: string;
  password: string;
  active: boolean; // false means banned
  strategies: Array<ObjectId>;
	created: Date;
	_id?: ObjectId;

  constructor(
    login: string,
    avatar_url: string,
    email: string,
    password: string,
    active?: boolean,
    strategies?: Array<ObjectId>,
		created?: Date,
		_id?: ObjectId
  ) {
    this.login = login;
    this.avatar_url = avatar_url;
    this.email = email;
    this.password = password;
    this.active = active ? active : true;
    this.strategies = strategies ? strategies : [];
		this.created = created ? created : new Date();
		this._id = _id ? _id : undefined;
  }
}
