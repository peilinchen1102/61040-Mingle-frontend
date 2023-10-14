import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface ProfileDoc extends BaseDoc {
  owner: ObjectId;
  name: string;
  major: string;
  year: string;
  courses: Array<string>;
}

export default class ProfileConcept {
  public readonly profiles = new DocCollection<ProfileDoc>("profiles");

  async create(owner: ObjectId, name: string, major: string, year: string, courses: Array<string>) {
    await this.canCreate(name, major, year, courses);
    const _id = await this.profiles.createOne({ owner, name, major, year, courses });
    return { msg: "Profile successfully created!", profile: await this.profiles.readOne({ _id }) };
  }

  async getProfiles() {
    const profiles = await this.profiles.readMany({});
    return profiles;
  }

  async getProfile(_id: ObjectId) {
    const profile = await this.profiles.readOne({ owner: _id });
    if (profile == null) {
      throw new NotFoundError(`Profile not found!`);
    }
    return profile;
  }

  async update(owner: ObjectId, update: Partial<ProfileDoc>) {
    this.sanitizeUpdate(update);
    await this.profiles.updateOne({ owner }, update);
    return { msg: "Profile successfully updated!" };
  }

  async delete(owner: ObjectId) {
    await this.profiles.deleteOne({ owner });
    return { msg: "Profile deleted!" };
  }

  async areProfilesSimilar(u1: ObjectId, others: ObjectId[]) {
    const p1 = await this.profiles.readOne({ owner: u1 });
    const suggestions = [];
    for (const other of others) {
      const p2 = await this.profiles.readOne({ owner: other });
      const intersection = p1?.courses.filter((course) => p2?.courses.includes(course));
      if (p1?.major === p2?.major || intersection) {
        suggestions.push(p2);
      }
    }
    return suggestions;
  }

  private sanitizeUpdate(update: Partial<ProfileDoc>) {
    const allowedUpdates = ["name", "major", "year", "courses"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  private async canCreate(name: string, major: string, year: string, courses: Array<string>) {
    if (!name || !major || !year || !courses) {
      throw new BadValuesError("Name, major, year, courses must be nonempty!");
    }
  }
}
