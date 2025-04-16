import { red, cyan, green } from "colorette";
import Stripe from "stripe";

//local imports
import { Rol } from "../models/rol";
import { User } from "../models/user";

export const roles = [
  { name: "admin" },
  { name: "anonymous" },
  { name: "customer" },
  { name: "authenticated" },
];

async function createRoles() {
  for (const role of roles) {
    const rol = await Rol.findOne({ name: role.name });

    if (!rol) {
      await Rol.create(role);
    }
  }
}

async function createModels() {
  try {
    await createRoles();

    console.log(green("Creating models..."));

    await User.createCollection();
    console.log(cyan("Models created"));
  } catch (error: any) {
    console.log(red(`Can't create the models:${error.message}`));
  }
}

export async function createDatabase() {
  try {
    await createModels();
    console.log(cyan("Database created"));
  } catch (error: any) {
    console.log(red(`Can't create the database:${error.message}`));
  }
}

export async function getUserByEmailOrUsername(
  email: string,
  username: string
) {
  return await User.findOne({ $or: [{ email }, { username }] });
}
