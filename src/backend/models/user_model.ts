import { ObjectId } from "bson";

export class User {
  login: string;
  email: string;
  password: string;
  active: boolean; // false means banned
  strategies: Array<ObjectId>;
	created: Date;
	pendingPassword: string;
	verified: boolean;
	_id?: ObjectId;

  constructor(
    login: string,
    email: string,
    password: string,
    active?: boolean,
    strategies?: Array<ObjectId>,
		created?: Date,
		pendingPassword?: string,
		verified?: boolean,
		_id?: ObjectId
  ) {
    this.login = login;
    this.email = email;
    this.password = password;
    this.active = active ? active : true;
    this.strategies = strategies ? strategies : [];
		this.created = created ? created : new Date();
		this.pendingPassword = pendingPassword ? pendingPassword : '';
		this.verified = verified ? verified : false;
		this._id = _id ? _id : undefined;
  }
}
