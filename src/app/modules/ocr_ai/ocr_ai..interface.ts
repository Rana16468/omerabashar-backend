import { Model, Types } from "mongoose";

export interface TOcrTech {
  userId: Types.ObjectId;
  filePath: string;
  ocrType:string;
  status: Boolean;
  textImageUrl:string;
  isDelete:Boolean
}

export interface OcrTechModel extends Model<TOcrTech> {
  isOcrTechCustomId(id: string): Promise<TOcrTech>;
}

