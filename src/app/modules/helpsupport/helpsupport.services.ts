import status from "http-status";
import AppError from "../../errors/AppError";
import { THelpSupport } from "./helpsupport.interface";
import helpsupports from "./helpsupport.model";
import QueryBuilder from "../../builder/QueryBuilder";
import users from "../users/users.model";
import { user_search_filed } from "./helpsupport.constant";

const recordedHelpAndSupportIntoDb = async (
  userId: string,
  payload: THelpSupport,
) => {
  try {
    const result = await helpsupports.create({
      ...payload,
      userId,
      isDelete: false,
    });

    if (!result) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to record help & support request",
      );
    }

    return {
      status: true,
      message: "Help & support request recorded successfully",
    };
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || "Error while recording help & support request",
    );
  }
};

const findByAllHelpAndSupportReportIntoDb = async (
  query: Record<string, unknown>,
) => {
  try {
    const allUsersdQuery = new QueryBuilder(
      helpsupports.find({}).populate([
        {
          path: "userId",
          select: "name photo email phoneNumber",
        },
      ]),
      query,
    )
      .search(user_search_filed)
      .filter()
      .sort()
      .paginate()
      .fields();

    const all_users = await allUsersdQuery.modelQuery;
    const meta = await allUsersdQuery.countTotal();

    return { meta, all_users };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "find By All Help And Support Report Into Db server unavailable",
      error,
    );
  }
};

const deleteHelpAndSupportIntoDb = async (id: string) => {
  try {
    const isExist = await helpsupports.exists({ _id: id });
    if (!isExist) {
      throw new AppError(
        status.NOT_FOUND,
        "not founded this user  information",
      );
    }
    const result = await helpsupports.findByIdAndDelete(id);
    if (!result) {
      throw new AppError(
        status.NOT_ACCEPTABLE,
        "not extended issues by the delete  support m section",
      );
    }
    return {
      status: true,
      message: "successfully delete help and support",
    };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "find By All  delete Help And Support In to Db server unavailable",
      error,
    );
  }
};

const HelpAndSupportServices = {
  recordedHelpAndSupportIntoDb,
  findByAllHelpAndSupportReportIntoDb,
  deleteHelpAndSupportIntoDb,
};

export default HelpAndSupportServices;
