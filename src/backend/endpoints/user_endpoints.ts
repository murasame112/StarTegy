import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";;
import * as loginService from "../services/login_service";
import * as mongoClient from '../mongodb/connection';