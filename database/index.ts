import Account from "./account.model";
import Answer from "./answer.model";
import Collection from "./collection.model";
import Interaction from "./interaction.model";
import Question from "./question.model";
import TagQuestion from "./tag-question.model";
import Tag from "./tag.model";
import User from "./user.model";
import Vote from "./vote.model";

// Barrel export
// Ensure all Mongoose models are loaded before executing any application logic.
// Importing the models upfront registers them with Mongoose, making them available for querying and use across the entire application.
// This prevents issues where models are not registered in time, which could lead to runtime errors, especially when performing operations like fetching documents from collections.

export {
  Account,
  Answer,
  Collection,
  Interaction,
  Question,
  TagQuestion,
  Tag,
  User,
  Vote,
};
