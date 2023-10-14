import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface MessageDoc extends BaseDoc {
  from: ObjectId;
  to: ObjectId;
  content: string;
}

export default class MessageConcept {
  public readonly messages: DocCollection<MessageDoc>;

  constructor(type: string) {
    this.messages = new DocCollection<MessageDoc>(type);
  }

  async getMessages(user: ObjectId) {
    return await this.messages.readMany(
      {
        $or: [{ from: user }, { to: user }],
      },
      {
        sort: { dateCreated: -1 },
      },
    );
  }

  async getMessagesBetween(user1: ObjectId, user2: ObjectId) {
    return await this.messages.readMany(
      {
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 },
        ],
      },
      { sort: { dateCreated: -1 } },
    );
  }

  async getMessagesByIds(_ids: ObjectId[]) {
    return await this.messages.readMany({ _id: { $in: _ids } }, { sort: { dateCreated: -1 } });
  }

  async sendMessage(from: ObjectId, to: ObjectId, content: string) {
    await this.canSendMessage(from, to);
    const messageId = await this.messages.createOne({ from, to, content });
    return { msg: "Message sent!", id: messageId };
  }

  private async canSendMessage(u1: ObjectId, u2: ObjectId) {
    if (u1.toString() === u2.toString()) {
      throw new CannotMessageSelfError(u1);
    }
  }
}

export class CannotMessageSelfError extends NotAllowedError {
  constructor(public readonly user: ObjectId) {
    super("Message cannot be sent to yourself!");
  }
}
