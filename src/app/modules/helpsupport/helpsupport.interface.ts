import { Types, Model } from "mongoose";

export interface THelpSupport {
  userId: Types.ObjectId;
  title: string;
  description: string;
  isDelete: boolean;
}

export interface HelpSupportModel extends Model<THelpSupport> {
  // eslint-disable-next-line no-unused-vars
  isHelpSupportCustomId(id: string): Promise<THelpSupport>;
}
